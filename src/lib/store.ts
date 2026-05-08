import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: any | null;
  setUser: (user: any | null) => void;
}

interface RosaryProgress {
  activeStep: number;
  completedSteps: string[];
  subStepProgress: number;
  lastUpdated: number;
  date: string;
}

interface AppState {
  activeRosary: RosaryProgress | null;
  isOnline: boolean;
  resetRosaryTrigger: number;
  setActiveRosary: (progress: RosaryProgress | null) => void;
  clearActiveRosary: () => void;
  setIsOnline: (isOnline: boolean) => void;
  triggerResetRosary: () => void;
}

export const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeRosary: null,
      isOnline: navigator.onLine,
      resetRosaryTrigger: 0,
      setActiveRosary: (progress) => set({ activeRosary: progress }),
      clearActiveRosary: () => set({ activeRosary: null }),
      setIsOnline: (isOnline) => set({ isOnline }),
      triggerResetRosary: () => set((state) => ({ resetRosaryTrigger: state.resetRosaryTrigger + 1 })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ activeRosary: state.activeRosary }), // Only persist activeRosary
    }
  )
);
