import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '../components/Calendar';
import { Button, GlassCard, cn } from '../components/UI';
import { Play, Flame, Trophy, CheckCircle2 } from 'lucide-react';
import { useAuthStore, useAppStore } from '../lib/store';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { startOfDay, subDays } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { activeRosary } = useAppStore();
  const [stats, setStats] = useState([
    { icon: Flame, label: 'Ofensiva', value: '0 dias', color: 'text-orange-400' },
    { icon: Trophy, label: 'Metas', value: '0 / 30', color: 'text-yellow-400' },
    { icon: CheckCircle2, label: 'Rezados', value: '0 terços', color: 'text-indigo-400' },
  ]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch all rosaries
      const q = query(collection(db, 'rosaries'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const total = snapshot.size;
      const rosaryDates = snapshot.docs.map(doc => doc.data().completedAt?.toDate()).filter(Boolean);

      // Fetch settings
      const settingsRef = doc(db, 'userSettings', user.uid);
      const settingsSnap = await getDoc(settingsRef);
      const settingsData = settingsSnap.exists() ? settingsSnap.data() : {};
      const globalGoal = settingsData.globalGoal || 30;
      const dailyGoal = settingsData.dailyGoal || 1;

      // Calculate streak
      let streak = 0;
      const countsByDay: Record<string, number> = {};
      rosaryDates.forEach(date => {
        const key = startOfDay(date).toISOString();
        countsByDay[key] = (countsByDay[key] || 0) + 1;
      });

      const todayKey = startOfDay(new Date()).toISOString();
      const yesterdayKey = startOfDay(subDays(new Date(), 1)).toISOString();

      // Check if streak is active (today or yesterday met goal)
      const metToday = (countsByDay[todayKey] || 0) >= dailyGoal;
      const metYesterday = (countsByDay[yesterdayKey] || 0) >= dailyGoal;

      if (metToday || metYesterday) {
        let current = metToday ? new Date() : subDays(new Date(), 1);
        while (true) {
          const key = startOfDay(current).toISOString();
          if ((countsByDay[key] || 0) >= dailyGoal) {
            streak++;
            current = subDays(current, 1);
          } else {
            break;
          }
        }
      }

      setStats([
        { icon: Flame, label: 'Ofensiva', value: `${streak} dias`, color: 'text-orange-400' },
        { icon: Trophy, label: 'Metas', value: `${total} / ${globalGoal}`, color: 'text-yellow-400' },
        { icon: CheckCircle2, label: 'Rezados', value: `${total} terços`, color: 'text-indigo-400' },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Olá, {user?.displayName || 'Fiel'}</h1>
        <p className="text-xs text-slate-400">Pronto para sua oração diária?</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="flex flex-col items-center justify-center py-3 px-2 gap-1 text-center">
            <stat.icon className={cn("w-4 h-4", stat.color)} />
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">{stat.label}</p>
              <p className="text-xs font-bold text-white">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <Button 
        onClick={() => navigate('/rosary')} 
        className="w-full py-4 text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/40 bg-gradient-to-r from-indigo-600 to-purple-600 border-none hover:scale-[1.02] transition-transform"
      >
        <Play fill="currentColor" size={24} />
        {activeRosary ? 'Continuar o Terço...' : 'Rezar o Terço'}
      </Button>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-200">Seu Progresso</h2>
        </div>
        <Calendar />
      </section>
    </div>
  );
}

