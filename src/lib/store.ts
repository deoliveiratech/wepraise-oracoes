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
  setActiveRosary: (progress: RosaryProgress | null) => void;
  clearActiveRosary: () => void;
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
      setActiveRosary: (progress) => set({ activeRosary: progress }),
      clearActiveRosary: () => set({ activeRosary: null }),
    }),
    {
      name: 'app-storage',
    }
  )
);
