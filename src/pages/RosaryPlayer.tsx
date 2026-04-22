import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button, GlassCard, cn } from '../components/UI';
import { getInitialSteps } from '../data/rosaryData';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore, useAppStore } from '../lib/store';

export default function RosaryPlayer() {
  const steps = getInitialSteps();
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(steps[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [subStepProgress, setSubStepProgress] = useState(0);
  
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { activeRosary, setActiveRosary, clearActiveRosary } = useAppStore();

  // Load saved progress
  useEffect(() => {
    if (activeRosary) {
      setActiveStep(activeRosary.activeStep);
      setCompleted(activeRosary.completedSteps);
      setSubStepProgress(activeRosary.subStepProgress);
      setExpanded(steps[activeRosary.activeStep].id);
    }
  }, []);

  // Save progress locally
  useEffect(() => {
    if (user) {
      setActiveRosary({
        activeStep,
        completedSteps: completed,
        subStepProgress,
        lastUpdated: Date.now(),
        date: activeRosary?.date || new Date().toISOString()
      });
    }
  }, [activeStep, completed, subStepProgress, user]);

  const handleToggle = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleSubStepClick = (index: number) => {
    if (index === subStepProgress) {
      setSubStepProgress(prev => prev + 1);
    }
  };

  const handleCompleteStep = async (id: string, index: number) => {
    const step = steps[index];
    if (step.subStepCount && subStepProgress < step.subStepCount) {
      return;
    }

    const newCompleted = !completed.includes(id) ? [...completed, id] : completed;
    setCompleted(newCompleted);
    
    if (index < steps.length - 1) {
      const nextStep = index + 1;
      setActiveStep(nextStep);
      setExpanded(steps[nextStep].id);
      setSubStepProgress(0);

      // Save to Firebase for cross-device resume
      if (user) {
        try {
          await setDoc(doc(db, 'activeRosaries', user.uid), {
            activeStep: nextStep,
            completedSteps: newCompleted,
            subStepProgress: 0,
            lastUpdated: serverTimestamp()
          });
        } catch (error) {
          console.error('Erro ao salvar progresso no Firebase:', error);
        }
      }
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
      clearActiveRosary();
      // Remove from activeRosaries in Firebase
      await setDoc(doc(db, 'activeRosaries', user.uid), { completed: true });
      alert('Terço finalizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const resetProgress = () => {
    if (confirm('Deseja reiniciar a oração do terço?')) {
      setActiveStep(0);
      setCompleted([]);
      setSubStepProgress(0);
      setExpanded(steps[0].id);
      clearActiveRosary();
    }
  };

  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Oração do Terço</h1>
        <button onClick={resetProgress} className="p-2 text-slate-400 hover:text-white transition-colors" title="Reiniciar">
          <RotateCcw size={20} />
        </button>
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
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 space-y-4">
                          <p className="text-slate-300 leading-relaxed italic">"{step.prayer}"</p>
                          
                          {step.subStepCount && (
                            <div className="space-y-3 pt-2">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                {subStepProgress} de {step.subStepCount} Ave-Marias
                              </p>
                              <div className="flex flex-wrap justify-center gap-2">
                                {Array.from({ length: step.subStepCount }).map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleSubStepClick(i)}
                                    className={cn(
                                      "w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-[10px] font-bold",
                                      i < subStepProgress 
                                        ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20" 
                                        : i === subStepProgress 
                                          ? "bg-white/10 border-indigo-500 text-indigo-400 animate-pulse" 
                                          : "bg-transparent border-slate-700 text-slate-600"
                                    )}
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <Button 
                          onClick={() => handleCompleteStep(step.id, index)} 
                          disabled={step.subStepCount ? subStepProgress < step.subStepCount : false}
                          className={cn(
                            "w-full flex items-center justify-center gap-2 py-3 transition-all",
                            step.subStepCount && subStepProgress < step.subStepCount ? "opacity-50 cursor-not-allowed grayscale" : ""
                          )}
                        >
                          {step.subStepCount && subStepProgress < step.subStepCount 
                            ? `Complete as Ave-Marias (${subStepProgress}/${step.subStepCount})` 
                            : 'Concluir Estágio'}
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
