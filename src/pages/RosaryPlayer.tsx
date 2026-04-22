import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button, GlassCard, cn } from '../components/UI';
import { getInitialSteps } from '../data/rosaryData';
import type { RosaryStep } from '../data/rosaryData';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../lib/store';

export default function RosaryPlayer() {
  const [steps] = useState<RosaryStep[]>(getInitialSteps());
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(steps[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const handleToggle = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleCompleteStep = (id: string, index: number) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
    }
    if (index < steps.length - 1) {
      setActiveStep(index + 1);
      setExpanded(steps[index + 1].id);
    } else {
      handleFinishRosary();
    }
  };

  const handleFinishRosary = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'rosaries'), {
        userId: user.uid,
        completedAt: serverTimestamp(),
        type: 'full'
      });
      alert('Terço finalizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Oração do Terço</h1>
        <div className="w-10"></div>
      </div>

      <div className="relative space-y-3">
        {/* Progress Line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-800 -z-10" />

        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = completed.includes(step.id);
          const isExpanded = expanded === step.id;

          return (
            <div key={step.id} className="relative pl-12">
              {/* Step Node */}
              <div 
                className={cn(
                  "absolute left-4 top-4 -translate-x-1/2 w-4 h-4 rounded-full border-4 transition-all duration-500 z-10",
                  isCompleted ? "bg-indigo-500 border-indigo-500/30 scale-125" : 
                  isActive ? "bg-white border-indigo-500 animate-pulse" : "bg-slate-800 border-slate-700"
                )} 
              />

              <GlassCard 
                className={cn(
                  "p-0 overflow-hidden border-none transition-all duration-500",
                  isActive ? "ring-2 ring-indigo-500/50 scale-[1.02]" : "opacity-70 grayscale-[0.5]"
                )}
              >
                <button 
                  onClick={() => handleToggle(step.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="space-y-1">
                    <p className={cn("text-[9px] font-bold uppercase tracking-widest", isCompleted ? "text-indigo-400" : "text-slate-500")}>
                      {isCompleted ? 'Concluído' : `Estágio ${index + 1}`}
                    </p>
                    <h3 className="font-bold text-white text-base">{step.title}</h3>
                    <p className="text-[10px] text-slate-400">{step.description}</p>
                  </div>
                  {isExpanded ? <ChevronDown size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-500" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 pb-4 space-y-4">
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                          <p className="text-slate-300 leading-relaxed italic">"{step.prayer}"</p>
                        </div>
                        <Button 
                          onClick={() => handleCompleteStep(step.id, index)} 
                          className="w-full flex items-center justify-center gap-2 py-3"
                        >
                          Concluir Estágio
                          <ArrowRight size={18} />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
