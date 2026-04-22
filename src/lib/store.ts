import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: any | null;
  setUser: (user: any | null) => void;
}

interface AppState {
  currentRosaryProgress: number;
  setRosaryProgress: (progress: number) => void;
  resetRosaryProgress: () => void;
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

export const useAppStore = create<AppState>((set) => ({
  currentRosaryProgress: 0,
  setRosaryProgress: (progress) => set({ currentRosaryProgress: progress }),
  resetRosaryProgress: () => set({ currentRosaryProgress: 0 }),
}));
