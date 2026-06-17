import type { MealType } from '@/lib/types';

export interface FoodPreset {
  name: string;
  type: MealType;
  calories: number;
  protein: number;
  iron: number;
  calcium: number;
}

/** Approximate per-serving nutrition for common baby/toddler foods (educational estimates). */
export const FOOD_PRESETS: FoodPreset[] = [
  {
    name: 'Breast milk / formula feed',
    type: 'breakfast',
    calories: 90,
    protein: 2,
    iron: 0.3,
    calcium: 60,
  },
  {
    name: 'Iron-fortified cereal',
    type: 'breakfast',
    calories: 60,
    protein: 1.5,
    iron: 4.5,
    calcium: 30,
  },
  {
    name: 'Banana oat porridge',
    type: 'breakfast',
    calories: 110,
    protein: 3,
    iron: 1.2,
    calcium: 70,
  },
  { name: 'Avocado purée', type: 'snack', calories: 80, protein: 1, iron: 0.3, calcium: 6 },
  {
    name: 'Lentil & carrot purée',
    type: 'lunch',
    calories: 90,
    protein: 4,
    iron: 1.6,
    calcium: 25,
  },
  {
    name: 'Mashed sweet potato',
    type: 'lunch',
    calories: 70,
    protein: 1.3,
    iron: 0.4,
    calcium: 20,
  },
  { name: 'Tofu & broccoli', type: 'dinner', calories: 95, protein: 6, iron: 1.8, calcium: 180 },
  { name: 'Egg & potato mash', type: 'lunch', calories: 130, protein: 7, iron: 1.1, calcium: 35 },
  {
    name: 'Chicken & sweet potato',
    type: 'dinner',
    calories: 140,
    protein: 9,
    iron: 0.8,
    calcium: 25,
  },
  { name: 'Soft fish & rice', type: 'dinner', calories: 150, protein: 11, iron: 0.5, calcium: 20 },
  { name: 'Yogurt with fruit', type: 'snack', calories: 90, protein: 4, iron: 0.1, calcium: 150 },
  { name: 'Mashed beans', type: 'lunch', calories: 100, protein: 6, iron: 2.1, calcium: 35 },
  { name: 'Soft fruit pieces', type: 'snack', calories: 50, protein: 0.5, iron: 0.2, calcium: 8 },
  { name: 'Steamed veggies', type: 'snack', calories: 40, protein: 1.5, iron: 0.6, calcium: 30 },
];
