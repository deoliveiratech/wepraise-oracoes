import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 500); // Wait for exit animation
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f172a]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.2
            }}
            className="flex flex-col items-center gap-6"
          >
            {/* Logo Icon */}
            <div className="relative w-24 h-24">
              <motion.img
                src="/pwa-512x512.png"
                alt="WePraise Logo"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="w-full h-full object-contain"
              />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 rounded-full scale-150" />
            </div>

            {/* App Name */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                WePraise
              </h1>
              <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">
                Orações
              </p>
            </motion.div>
          </motion.div>

          {/* Loading indicator */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 2, ease: "linear", delay: 0.5 }}
            className="absolute bottom-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
