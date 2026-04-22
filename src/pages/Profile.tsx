import { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/store';
import { GlassCard, cn } from '../components/UI';
import { User, Bell, Flame, Target, LogOut, ChevronRight, Settings, Clock, Book } from 'lucide-react';
import { allMysteries, getMysteriesByDay } from '../data/rosaryData';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    dailyGoal: 1,
    notifications: true,
    reminderTime: '20:00',
    rosaryTimes: ['06:00', '12:00', '18:00'],
    globalGoal: 30,
    periodType: 'month'
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    const docRef = doc(db, 'userSettings', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setSettings({
        ...settings,
        ...data,
        rosaryTimes: data.rosaryTimes || ['06:00', '12:00', '18:00'],
        globalGoal: data.globalGoal || 30,
        periodType: data.periodType || 'month'
      });
    }
  };

  const handleSaveSettings = async (newSettings: any) => {
    try {
      await setDoc(doc(db, 'userSettings', user.uid), newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error(error);
    }
  };

  const updateRosaryTime = (index: number, time: string) => {
    const newTimes = [...settings.rosaryTimes];
    newTimes[index] = time;
    handleSaveSettings({ ...settings, rosaryTimes: newTimes });
  };

  const updatePeriod = (type: string, goal: number) => {
    handleSaveSettings({ ...settings, periodType: type, globalGoal: goal });
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center text-center space-y-3 py-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
          <User size={40} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{user?.displayName || 'Fiel'}</h1>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Configuração de Ofensiva</h2>
        <GlassCard className="divide-y divide-white/5 p-0">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                <Target size={20} />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Meta Diária</p>
                <p className="text-[10px] text-slate-400">Quantidade de terços por dia</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-white/5">
              {[1, 2, 3].map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleSaveSettings({ ...settings, dailyGoal: goal })}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                    settings.dailyGoal === goal 
                      ? "bg-indigo-500 text-white shadow-lg" 
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Período da Meta</p>
                <p className="text-[10px] text-slate-400">Duração do seu compromisso</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Mês', type: 'month', goal: 30 },
                { label: 'Trimestre', type: 'quarter', goal: 90 },
                { label: 'Ano', type: 'year', goal: 365 }
              ].map((p) => (
                <button
                  key={p.type}
                  onClick={() => updatePeriod(p.type, p.goal)}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold border transition-all",
                    settings.periodType === p.type
                      ? "bg-purple-600/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/10"
                      : "bg-slate-800/50 border-white/5 text-slate-400 hover:text-white"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {Array.from({ length: settings.dailyGoal }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-500/10 rounded-lg text-slate-400">
                  <Settings size={18} />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Horário do Terço {i + 1}</p>
                  <p className="text-[10px] text-slate-400">Defina o melhor horário para orar</p>
                </div>
              </div>
              <input
                type="time"
                value={settings.rosaryTimes[i] || '08:00'}
                onChange={(e) => updateRosaryTime(i, e.target.value)}
                className="bg-slate-800/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          ))}

          <div className="p-4 flex items-center justify-between opacity-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Lembretes</p>
                <p className="text-[10px] text-slate-400">Notificações diárias (Em breve)</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-slate-700 rounded-full relative transition-colors cursor-not-allowed">
              <div className="absolute left-1 top-1 w-3 h-3 bg-slate-500 rounded-full" />
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                <Flame size={20} />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Modo Intensivo</p>
                <p className="text-[10px] text-slate-400">Dobra os pontos em dias santos</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-indigo-500 rounded-full relative transition-colors">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Mistérios do Terço</h2>
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 bg-indigo-500/10 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Hoje é dia de:</p>
                <h3 className="text-lg font-bold text-white">{getMysteriesByDay().name}</h3>
              </div>
              <Book size={24} className="text-indigo-400" />
            </div>
          </div>
          <div className="p-4 space-y-4">
            {Object.entries(allMysteries).map(([key, m]) => {
              const isToday = getMysteriesByDay().name === m.name;
              return (
                <div key={key} className={cn("space-y-1 p-2 rounded-lg transition-colors", isToday ? "bg-white/5" : "")}>
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-bold", isToday ? "text-indigo-400" : "text-slate-200")}>{m.name}</p>
                    <p className="text-[10px] text-slate-500">{m.days.map(d => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d]).join(' e ')}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic line-clamp-2">
                    {m.items.join(' • ')}
                  </p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Conta</h2>
        <GlassCard className="p-0">
          <button onClick={handleLogout} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                <LogOut size={20} />
              </div>
              <p className="font-medium text-white text-sm">Sair da Conta</p>
            </div>
            <ChevronRight size={18} className="text-slate-600" />
          </button>
        </GlassCard>
      </section>

      <div className="text-center pt-4">
        <p className="text-[10px] text-slate-600">WePraise v1.0.0</p>
      </div>
    </div>
  );
}
