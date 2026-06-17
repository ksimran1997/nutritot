export type DietPreference = 'vegan' | 'vegetarian' | 'non-vegetarian';

export type Sex = 'boy' | 'girl';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface BabyProfile {
  name: string;
  birthDate: string; // ISO date
  sex: Sex;
  diet: DietPreference;
}

export interface MealEntry {
  id: string;
  date: string; // ISO date (yyyy-MM-dd)
  type: MealType;
  name: string;
  calories: number;
  protein: number; // grams
  iron: number; // mg
  calcium: number; // mg
}

export interface GrowthEntry {
  id: string;
  date: string; // ISO date (yyyy-MM-dd)
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  headCm?: number;
}

export type NutrientKey = 'calories' | 'protein' | 'iron' | 'calcium';

export interface NutritionTargets {
  calories: number; // kcal/day
  protein: number; // g/day
  iron: number; // mg/day
  calcium: number; // mg/day
}
