import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogOut, Heart, WifiOff, ArrowLeft, RotateCcw } from 'lucide-react';
import { useAuthStore, useAppStore } from '../lib/store';
import { auth } from '../lib/firebase';
import { cn } from './UI';
import { PwaInstallPrompt } from './PwaInstallPrompt';
import { getMysteriesByDay } from '../data/rosaryData';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { isOnline, triggerResetRosary } = useAppStore();

  const isRosaryPage = location.pathname === '/rosary';
  const mystery = getMysteriesByDay();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Início' },
    { icon: BookOpen, path: '/rosary', label: 'Terço' },
    { icon: Heart, path: '/prayers', label: 'Orações' },
    { icon: User, path: '/profile', label: 'Perfil' },
  ];

  return (
    <div className="flex flex-col min-h-screen relative">
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-none rounded-none bg-background/50 flex items-center justify-between px-6">
        {isRosaryPage ? (
          <>
            <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex flex-col items-center">
              <h1 className="text-sm font-bold text-white">Oração do Terço</h1>
              <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest">{mystery.name}</p>
            </div>
            <button 
              onClick={() => {
                if (confirm('Deseja reiniciar a oração do terço?')) {
                  triggerResetRosary();
                }
              }} 
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Reiniciar"
            >
              <RotateCcw size={20} />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                  WePraise
                </h1>
                <span className="text-[8px] font-bold text-indigo-400/80 uppercase tracking-widest leading-none">Orações</span>
              </div>
              {!isOnline && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 animate-pulse">
                  <WifiOff size={10} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Offline</span>
                </div>
              )}
            </div>
            {user && (
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors">
                <LogOut size={20} />
              </button>
            )}
          </>
        )}
      </header>

      <main className="flex-grow pt-18 pb-24 px-6 max-w-2xl mx-auto w-full">
        {children}
      </main>

      <PwaInstallPrompt />

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-slate-800/50">
        <div className="flex items-center justify-around py-3 px-4 max-w-2xl mx-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 p-2 transition-all duration-300',
                location.pathname === item.path ? 'text-indigo-400 scale-110' : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <item.icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
