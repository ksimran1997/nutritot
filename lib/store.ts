import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { BabyProfile, GrowthEntry, MealEntry } from '@/lib/types';
import { uid } from '@/lib/utils';

interface BabyState {
  hydrated: boolean;
  children: BabyProfile[];
  activeChildId: string | null;
  meals: MealEntry[];
  growth: GrowthEntry[];
  setHydrated: () => void;
  /** Add a new child and make them active. Returns the new child's id. */
  addChild: (child: Omit<BabyProfile, 'id'>) => string;
  /** Update an existing child by id. */
  updateChild: (id: string, patch: Partial<Omit<BabyProfile, 'id'>>) => void;
  /** Remove a child along with their meals and growth entries. */
  removeChild: (id: string) => void;
  setActiveChild: (id: string) => void;
  addMeal: (meal: MealEntry) => void;
  removeMeal: (id: string) => void;
  addGrowth: (entry: GrowthEntry) => void;
  removeGrowth: (id: string) => void;
  /** Clears every child and all logged data. */
  reset: () => void;
}

interface PersistedState {
  children: BabyProfile[];
  activeChildId: string | null;
  meals: MealEntry[];
  growth: GrowthEntry[];
}

function isPersistedState(v: unknown): v is PersistedState {
  if (!v || typeof v !== 'object') return false;
  return (
    Array.isArray((v as { children?: unknown }).children) &&
    Array.isArray((v as { meals?: unknown }).meals) &&
    Array.isArray((v as { growth?: unknown }).growth)
  );
}

export const useBabyStore = create<BabyState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      children: [],
      activeChildId: null,
      meals: [],
      growth: [],
      setHydrated: () => set({ hydrated: true }),
      addChild: (child) => {
        const id = uid();
        set((s) => ({
          children: [...s.children, { ...child, id }],
          activeChildId: id,
        }));
        return id;
      },
      updateChild: (id, patch) =>
        set((s) => ({
          children: s.children.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      removeChild: (id) =>
        set((s) => {
          const children = s.children.filter((c) => c.id !== id);
          const activeChildId =
            s.activeChildId === id ? (children[0]?.id ?? null) : s.activeChildId;
          return {
            children,
            activeChildId,
            meals: s.meals.filter((m) => m.childId !== id),
            growth: s.growth.filter((g) => g.childId !== id),
          };
        }),
      setActiveChild: (id) => {
        if (get().children.some((c) => c.id === id)) set({ activeChildId: id });
      },
      addMeal: (meal) => set((s) => ({ meals: [meal, ...s.meals] })),
      removeMeal: (id) => set((s) => ({ meals: s.meals.filter((m) => m.id !== id) })),
      addGrowth: (entry) =>
        set((s) => ({
          growth: [...s.growth, entry].sort((a, b) => a.date.localeCompare(b.date)),
        })),
      removeGrowth: (id) => set((s) => ({ growth: s.growth.filter((g) => g.id !== id) })),
      reset: () => set({ children: [], activeChildId: null, meals: [], growth: [] }),
    }),
    {
      name: 'baby-nutrition-store',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s): PersistedState => ({
        children: s.children,
        activeChildId: s.activeChildId,
        meals: s.meals,
        growth: s.growth,
      }),
      migrate: (persisted, version) => {
        // v0/v1 stored a single `profile` with un-scoped meals/growth.
        if (version < 2 && persisted && typeof persisted === 'object') {
          const old = persisted as {
            profile?: Omit<BabyProfile, 'id'> | null;
            meals?: MealEntry[];
            growth?: GrowthEntry[];
          };
          if (old.profile) {
            const id = uid();
            return {
              children: [{ ...old.profile, id }],
              activeChildId: id,
              meals: (old.meals ?? []).map((m) => ({ ...m, childId: id })),
              growth: (old.growth ?? []).map((g) => ({ ...g, childId: id })),
            } satisfies PersistedState;
          }
          return {
            children: [],
            activeChildId: null,
            meals: [],
            growth: [],
          } satisfies PersistedState;
        }
        // persisted is the current-version shape; zustand guarantees it matches PersistedState.
        if (isPersistedState(persisted)) return persisted;
        return { children: [], activeChildId: null, meals: [], growth: [] };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

/** The currently selected child, or null if none exist. */
export function useActiveChild(): BabyProfile | null {
  return useBabyStore((s) => s.children.find((c) => c.id === s.activeChildId) ?? null);
}
