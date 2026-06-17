import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { BabyProfile, GrowthEntry, MealEntry } from '@/lib/types';

interface BabyState {
  hydrated: boolean;
  profile: BabyProfile | null;
  meals: MealEntry[];
  growth: GrowthEntry[];
  setHydrated: () => void;
  setProfile: (profile: BabyProfile) => void;
  updateProfile: (patch: Partial<BabyProfile>) => void;
  addMeal: (meal: MealEntry) => void;
  removeMeal: (id: string) => void;
  addGrowth: (entry: GrowthEntry) => void;
  removeGrowth: (id: string) => void;
  reset: () => void;
}

export const useBabyStore = create<BabyState>()(
  persist(
    (set) => ({
      hydrated: false,
      profile: null,
      meals: [],
      growth: [],
      setHydrated: () => set({ hydrated: true }),
      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) =>
        set((s) => (s.profile ? { profile: { ...s.profile, ...patch } } : s)),
      addMeal: (meal) => set((s) => ({ meals: [meal, ...s.meals] })),
      removeMeal: (id) => set((s) => ({ meals: s.meals.filter((m) => m.id !== id) })),
      addGrowth: (entry) =>
        set((s) => ({
          growth: [...s.growth, entry].sort((a, b) => a.date.localeCompare(b.date)),
        })),
      removeGrowth: (id) => set((s) => ({ growth: s.growth.filter((g) => g.id !== id) })),
      reset: () => set({ profile: null, meals: [], growth: [] }),
    }),
    {
      name: 'baby-nutrition-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ profile: s.profile, meals: s.meals, growth: s.growth }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
