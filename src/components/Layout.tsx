import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogOut, Heart } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { auth } from '../lib/firebase';
import { cn } from './UI';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

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
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-none rounded-none bg-background/50 flex items-center justify-between px-6">
        <div className="flex flex-col items-start">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            WePraise
          </h1>
          <span className="text-[8px] font-bold text-indigo-400/80 uppercase tracking-widest leading-none">Orações</span>
        </div>
        {user && (
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        )}
      </header>

      <main className="flex-grow pt-18 pb-16 px-6 max-w-2xl mx-auto w-full">
        {children}
      </main>

      <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-md">
        <div className="glass flex items-center justify-around py-1.5 px-2 shadow-2xl shadow-indigo-500/10">
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
