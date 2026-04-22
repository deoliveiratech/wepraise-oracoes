import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CheckCircle2, Play, X, Clock, AlertCircle } from 'lucide-react';
import { GlassCard, Button, cn } from '../components/UI';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [settings, setSettings] = useState({
    dailyGoal: 1,
    rosaryTimes: ['08:00', '12:00', '18:00']
  });
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchSettings();
      fetchCompletedRosaries();
    }
  }, [user, currentDate]);

  const fetchSettings = async () => {
    const docRef = doc(db, 'userSettings', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setSettings({
        dailyGoal: data.dailyGoal || 1,
        rosaryTimes: data.rosaryTimes || ['08:00', '12:00', '18:00']
      });
    }
  };

  const fetchCompletedRosaries = async () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    
    const q = query(
      collection(db, 'rosaries'),
      where('userId', '==', user.uid),
      where('completedAt', '>=', start),
      where('completedAt', '<=', end)
    );

    const querySnapshot = await getDocs(q);
    const dates = querySnapshot.docs
      .map(doc => doc.data().completedAt?.toDate())
      .filter((date): date is Date => date !== undefined);
    setCompletedDates(dates);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getDayStatus = (day: Date) => {
    const count = completedDates.filter(d => isSameDay(d, day)).length;
    return {
      count,
      isGoalMet: count >= settings.dailyGoal,
      isPartial: count > 0 && count < settings.dailyGoal
    };
  };

  return (
    <div className="relative">
      <GlassCard className="p-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-1">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-center text-[9px] font-bold text-slate-500 py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, i) => {
            const { count, isGoalMet, isPartial } = getDayStatus(day);
            const today = isToday(day);

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-xl text-sm relative transition-all duration-300",
                  isGoalMet ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : 
                  isPartial ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" :
                  "bg-white/5 text-slate-400 hover:bg-white/10",
                  today && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-background z-10",
                  today && !isGoalMet && !isPartial && "bg-white/10 text-white"
                )}
              >
                <span className={cn(
                  "font-medium",
                  isGoalMet ? "text-white" : today ? "text-white" : ""
                )}>
                  {format(day, 'd')}
                </span>
                
                {isGoalMet && (
                  <div className="absolute -top-1 -right-1 text-white bg-indigo-600 rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 size={10} fill="currentColor" className="text-indigo-600" />
                  </div>
                )}
                
                {isPartial && (
                  <div className="absolute bottom-1.5 flex gap-0.5">
                    {Array.from({ length: settings.dailyGoal }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "w-1 h-1 rounded-full",
                          idx < count ? "bg-yellow-400" : "bg-slate-700"
                        )} 
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      <AnimatePresence>
        {selectedDate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDate(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 max-w-sm mx-auto z-[70]"
            >
              <GlassCard className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize">
                      {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </h3>
                    <p className="text-xs text-slate-400">Status das orações</p>
                  </div>
                  <button onClick={() => setSelectedDate(null)} className="p-2 text-slate-500 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  {Array.from({ length: settings.dailyGoal }).map((_, idx) => {
                    const count = completedDates.filter(d => isSameDay(d, selectedDate)).length;
                    const isDone = idx < count;
                    const time = settings.rosaryTimes[idx] || '08:00';

                    return (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            isDone ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800 text-slate-500"
                          )}>
                            {isDone ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Terço {idx + 1}</p>
                            <p className="text-[10px] text-slate-400">Previsto para as {time}</p>
                          </div>
                        </div>
                        {isDone ? (
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Concluído</span>
                        ) : (
                          <Button 
                            onClick={() => navigate('/rosary')}
                            variant="secondary" 
                            className="py-1 px-3 text-[10px] flex items-center gap-1.5"
                          >
                            <Play size={10} fill="currentColor" />
                            Rezar
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!getDayStatus(selectedDate).isGoalMet && isToday(selectedDate) && (
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex gap-3">
                    <AlertCircle className="text-indigo-400 shrink-0" size={18} />
                    <p className="text-[10px] text-indigo-300 leading-relaxed">
                      Você ainda tem orações pendentes para hoje. Que tal dedicar um momento agora?
                    </p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
