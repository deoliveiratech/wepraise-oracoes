import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button, GlassCard } from './UI';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && (window.navigator as any).standalone);
    setIsStandalone(!!isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, there is no beforeinstallprompt, so we just show the tip
    if (isIosDevice && !isStandaloneMode) {
      // Don't show immediately to avoid annoyance, wait 2 seconds
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <GlassCard className="p-4 flex items-center justify-between gap-4 border-indigo-500/30 bg-slate-900/90 shadow-2xl shadow-indigo-500/20">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white mb-1">Instalar WePraise</h3>
          {isIOS ? (
            <p className="text-[10px] text-slate-300">
              Para instalar, toque no botão <span className="font-bold text-indigo-300">Compartilhar</span> na barra do navegador e depois em <span className="font-bold text-indigo-300">Adicionar à Tela de Início</span>.
            </p>
          ) : (
            <p className="text-[10px] text-slate-300">
              Instale o app para acesso rápido e orações offline.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isIOS && (
            <Button onClick={handleInstallClick} className="px-3 py-1.5 text-[10px] whitespace-nowrap">
              <Download size={14} className="mr-1 inline" />
              Instalar
            </Button>
          )}
          <button onClick={() => setShowPrompt(false)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
