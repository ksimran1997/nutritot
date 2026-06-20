import { differenceInDays, differenceInMonths, eachDayOfInterval, format, subDays } from 'date-fns';

import type { MealEntry, NutrientKey, NutritionTargets } from '@/lib/types';

export interface AgeStage {
  id: string;
  label: string;
  /** inclusive lower bound in months */
  minMonths: number;
  /** exclusive upper bound in months */
  maxMonths: number;
  summary: string;
  feedingNote: string;
}

/**
 * Age stages aligned with WHO infant & young child feeding guidance.
 */
export const AGE_STAGES: AgeStage[] = [
  {
    id: '0-6m',
    label: '0–6 months',
    minMonths: 0,
    maxMonths: 6,
    summary: 'Exclusive milk feeding',
    feedingNote:
      'Breast milk or formula only. No solids, water, or other foods are recommended before about 6 months.',
  },
  {
    id: '6-8m',
    label: '6–8 months',
    minMonths: 6,
    maxMonths: 9,
    summary: 'Starting solids',
    feedingNote:
      'Introduce smooth purées and mashed foods 2–3 times a day alongside milk. Start single ingredients to watch for reactions.',
  },
  {
    id: '9-11m',
    label: '9–11 months',
    minMonths: 9,
    maxMonths: 12,
    summary: 'More texture & finger foods',
    feedingNote:
      'Offer mashed and finely chopped foods plus soft finger foods 3–4 times a day. Continue milk feeds.',
  },
  {
    id: '12-23m',
    label: '12–23 months',
    minMonths: 12,
    maxMonths: 24,
    summary: 'Family foods',
    feedingNote:
      'Share most family foods, chopped or mashed as needed, across 3 meals and 1–2 snacks a day.',
  },
  {
    id: '24m+',
    label: '2 years +',
    minMonths: 24,
    maxMonths: 600,
    summary: 'Balanced toddler diet',
    feedingNote:
      'A varied diet of family foods across regular meals and snacks. Keep offering iron- and calcium-rich foods.',
  },
];

export function getAgeMonths(birthDate: string, on: Date = new Date()): number {
  const birth = new Date(birthDate);
  return Math.max(0, differenceInMonths(on, birth));
}

export function getAgeDays(birthDate: string, on: Date = new Date()): number {
  return Math.max(0, differenceInDays(on, new Date(birthDate)));
}

export function formatAge(birthDate: string, on: Date = new Date()): string {
  const days = getAgeDays(birthDate, on);
  if (days < 31) return `${days} day${days === 1 ? '' : 's'} old`;
  const months = getAgeMonths(birthDate, on);
  if (months < 24) {
    const weeksRemainder = Math.floor((days - months * 30.4375) / 7);
    if (months < 12 && weeksRemainder > 0) {
      return `${months} mo ${weeksRemainder} wk`;
    }
    return `${months} month${months === 1 ? '' : 's'} old`;
  }
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths > 0 ? `${years}y ${remMonths}m old` : `${years} years old`;
}

export function getAgeStage(ageMonths: number): AgeStage {
  return (
    AGE_STAGES.find((s) => ageMonths >= s.minMonths && ageMonths < s.maxMonths) ?? AGE_STAGES[0]
  );
}

/**
 * Approximate daily nutrition targets by age, derived from WHO / IOM dietary
 * reference intakes for infants and young children. Educational estimates only.
 */
export function getNutritionTargets(ageMonths: number): NutritionTargets {
  if (ageMonths < 6) return { calories: 550, protein: 9, iron: 0.27, calcium: 200 };
  if (ageMonths < 9) return { calories: 650, protein: 11, iron: 11, calcium: 260 };
  if (ageMonths < 12) return { calories: 750, protein: 11, iron: 11, calcium: 260 };
  if (ageMonths < 24) return { calories: 900, protein: 13, iron: 7, calcium: 700 };
  return { calories: 1000, protein: 13, iron: 7, calcium: 700 };
}

export const NUTRIENT_META: Record<
  keyof NutritionTargets,
  { label: string; unit: string; colorClass: string }
> = {
  calories: { label: 'Energy', unit: 'kcal', colorClass: 'bg-peach' },
  protein: { label: 'Protein', unit: 'g', colorClass: 'bg-mint' },
  iron: { label: 'Iron', unit: 'mg', colorClass: 'bg-grape' },
  calcium: { label: 'Calcium', unit: 'mg', colorClass: 'bg-sky' },
};

export type NutritionRange = 'week' | 'month';

export interface DailyNutrition {
  date: string; // yyyy-MM-dd
  value: number;
}

export interface NutritionSeries {
  nutrient: NutrientKey;
  /** one point per day across the range, oldest first */
  points: DailyNutrition[];
  /** target/day for the nutrient at the baby's current age */
  target: number;
  /** mean intake across days that had at least one logged meal */
  averageActive: number;
  /** number of days with at least one logged meal in the range */
  activeDays: number;
}

/**
 * Build a per-day intake series for a nutrient across the last 7 (week) or
 * 30 (month) days. Days with no logged meals are included with a value of 0.
 */
export function buildNutritionSeries(
  meals: MealEntry[],
  nutrient: NutrientKey,
  range: NutritionRange,
  ageMonths: number,
  today: Date = new Date(),
): NutritionSeries {
  const span = range === 'week' ? 7 : 30;
  const start = subDays(today, span - 1);
  const days = eachDayOfInterval({ start, end: today });

  const byDay = new Map<string, number>();
  const loggedDays = new Set<string>();
  for (const m of meals) {
    const key = m.date;
    byDay.set(key, (byDay.get(key) ?? 0) + m[nutrient]);
    loggedDays.add(key);
  }

  const points: DailyNutrition[] = days.map((d) => {
    const key = format(d, 'yyyy-MM-dd');
    return { date: key, value: byDay.get(key) ?? 0 };
  });

  const activeKeys = points.filter((p) => loggedDays.has(p.date));
  const activeDays = activeKeys.length;
  const averageActive =
    activeDays > 0 ? activeKeys.reduce((s, p) => s + p.value, 0) / activeDays : 0;

  return {
    nutrient,
    points,
    target: getNutritionTargets(ageMonths)[nutrient],
    averageActive,
    activeDays,
  };
}
