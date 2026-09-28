import type { NutritionTargets } from '@/lib/types';

export interface NutrientEstimate extends NutritionTargets {
  /** How the values were produced. */
  source: 'ai' | 'estimate';
  /** Optional short note shown to the parent. */
  note?: string;
}

const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function round(n: number, decimals = 0): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

const UNICODE_FRACTIONS: Record<string, number> = {
  '¼': 0.25,
  '½': 0.5,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅛': 0.125,
  '⅜': 0.375,
  '⅝': 0.625,
  '⅞': 0.875,
};

function parseQuantity(text: string): number {
  const mixedFraction = text.match(/(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixedFraction) {
    const denominator = Number(mixedFraction[3]);
    if (denominator > 0) return Number(mixedFraction[1]) + Number(mixedFraction[2]) / denominator;
  }

  const fraction = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (denominator > 0) return Number(fraction[1]) / denominator;
  }

  const unicodeFraction = Object.entries(UNICODE_FRACTIONS).find(([symbol]) =>
    text.includes(symbol),
  );
  if (unicodeFraction) {
    const whole = text.match(/(\d+)\s*[¼½¾⅓⅔⅛⅜⅝⅞]/);
    return (whole ? Number(whole[1]) : 0) + unicodeFraction[1];
  }

  const decimal = text.match(/(?:^|\s)(\d+(?:\.\d+)?)/);
  return decimal ? Number(decimal[1]) : 1;
}

/**
 * Very rough local estimator used when no AI key is configured. Scales a
 * baseline nutrient density by keywords found in the food description and by a
 * parsed portion size in grams. Educational estimates only.
 */
function heuristicEstimate(food: string, portion: string): NutrientEstimate {
  const text = `${food} ${portion}`.toLowerCase();

  // Parse a gram amount from the portion ("100g", "1/2 bowl", "2 tbsp"...).
  const grams = parsePortionGrams(portion.toLowerCase());
  const factor = grams / 100; // nutrient tables are per 100g

  // Baseline per-100g density for a generic mixed baby food.
  let kcal = 90;
  let protein = 3;
  let iron = 0.8;
  let calcium = 40;

  const has = (...words: string[]) => words.some((w) => text.includes(w));

  if (has('milk', 'formula', 'breast', 'yogurt', 'yoghurt', 'cheese', 'paneer', 'dairy')) {
    kcal = 70;
    protein = 4;
    iron = 0.1;
    calcium = 120;
  } else if (has('meat', 'chicken', 'beef', 'lamb', 'fish', 'egg', 'turkey', 'liver')) {
    kcal = 150;
    protein = 18;
    iron = has('liver', 'beef', 'red meat') ? 4 : 1.5;
    calcium = 20;
  } else if (has('lentil', 'dal', 'dhal', 'bean', 'chickpea', 'tofu', 'pea', 'legume')) {
    kcal = 120;
    protein = 9;
    iron = 2.5;
    calcium = 50;
  } else if (has('spinach', 'kale', 'broccoli', 'greens', 'leafy')) {
    kcal = 35;
    protein = 3;
    iron = 2.7;
    calcium = 100;
  } else if (has('rice', 'oat', 'cereal', 'bread', 'pasta', 'porridge', 'roti', 'wheat')) {
    kcal = 120;
    protein = 3;
    iron = 1.2;
    calcium = 20;
  } else if (
    has('banana', 'apple', 'pear', 'fruit', 'mango', 'berry', 'avocado', 'peach', 'puree')
  ) {
    kcal = 70;
    protein = 1;
    iron = 0.4;
    calcium = 15;
  } else if (has('carrot', 'potato', 'sweet potato', 'pumpkin', 'squash', 'veg', 'vegetable')) {
    kcal = 60;
    protein = 1.5;
    iron = 0.6;
    calcium = 30;
  }

  return {
    source: 'estimate',
    calories: clamp(round(kcal * factor), 0, 4000),
    protein: clamp(round(protein * factor, 1), 0, 200),
    iron: clamp(round(iron * factor, 2), 0, 50),
    calcium: clamp(round(calcium * factor), 0, 3000),
    note: 'Offline estimate. Add an OpenAI key for AI analysis, and adjust values as needed.',
  };
}

const PORTION_AMOUNT_PATTERN =
  '((?:\\d+\\s+)?\\d+\\s*\\/\\s*\\d+|\\d+\\s*[¼½¾⅓⅔⅛⅜⅝⅞]|\\d+(?:[.,]\\d+)?|[¼½¾⅓⅔⅛⅜⅝⅞])';

interface PortionUnit {
  pattern: string;
  grams: number;
}

/**
 * Standardized gram equivalents used to scale per-100g nutrition data.
 * Volume uses the practical estimate of 1ml = 1g; household containers and
 * count units are approximate because their actual capacity or size varies.
 */
const PORTION_UNITS: PortionUnit[] = [
  { pattern: 'kilograms?|kilogrammes?|kgs?|kilos?', grams: 1000 },
  { pattern: 'milligrams?|mgs?', grams: 0.001 },
  { pattern: 'grams?|grammes?|gms?|g', grams: 1 },
  { pattern: 'pounds?|lbs?', grams: 453.592 },
  { pattern: 'ounces?|oz', grams: 28.3495 },
  { pattern: 'lit(?:er|re)s?|ltrs?|lt|l', grams: 1000 },
  { pattern: 'centilit(?:er|re)s?|cls?', grams: 10 },
  { pattern: 'millilit(?:er|re)s?|mls?', grams: 1 },
  { pattern: 'fluid\\s*ounces?|fl\\.?\\s*oz', grams: 29.5735 },
  { pattern: 'cups?', grams: 240 },
  { pattern: 'tablespoons?|table\\s*spoons?|tbsps?|tbsp|tbs', grams: 15 },
  { pattern: 'teaspoons?|tea\\s*spoons?|tsps?|tsp', grams: 5 },
  { pattern: 'bowls?', grams: 200 },
  { pattern: 'scoops?', grams: 30 },
  { pattern: 'handfuls?', grams: 30 },
  { pattern: 'slices?', grams: 30 },
  { pattern: 'pieces?|pcs?', grams: 40 },
  { pattern: 'servings?|portions?', grams: 80 },
];

export function parsePortionGrams(text: string): number {
  const normalizedText = text.toLowerCase().replaceAll(',', '.').trim();
  if (!normalizedText) return 80;

  for (const unit of PORTION_UNITS) {
    const match = normalizedText.match(
      new RegExp(`${PORTION_AMOUNT_PATTERN}\\s*(?:${unit.pattern})\\.?\\b`),
    );
    if (match) {
      return clamp(parseQuantity(match[1]) * unit.grams, 0.001, 5000);
    }
  }

  // A number without a measurement is treated as a count of typical
  // baby-size servings, so "2 bananas" or simply "2" scales from "1".
  const hasQuantity = new RegExp(PORTION_AMOUNT_PATTERN).test(normalizedText);
  if (hasQuantity) return clamp(parseQuantity(normalizedText) * 80, 0.001, 5000);

  // No stated quantity means one typical baby serving.
  return 80;
}

interface OpenAINutrients {
  calories?: number;
  protein?: number;
  iron?: number;
  calcium?: number;
}

/** Type guard: checks the OpenAI response envelope has the expected shape. */
function isOpenAIResponse(v: unknown): v is { choices?: { message?: { content?: string } }[] } {
  return typeof v === 'object' && v !== null;
}

/** Type guard: checks the parsed nutrient object has the expected shape. */
function isOpenAINutrients(v: unknown): v is OpenAINutrients {
  return typeof v === 'object' && v !== null;
}

async function aiEstimate(food: string, portion: string): Promise<NutrientEstimate> {
  const portionText = portion.trim() ? portion.trim() : 'a typical baby serving';
  const servingGrams = parsePortionGrams(portion.toLowerCase());
  const servingFactor = servingGrams / 100;
  const prompt =
    `Estimate the nutrient density of this prepared food.\n` +
    `Food: ${food}\n\n` +
    `Return values for exactly 100 grams of the food. The entered serving is ${portionText} ` +
    `(approximately ${round(servingGrams, 1)} grams), but do not calculate the serving totals.\n\n` +
    `Return ONLY a JSON object with numeric fields: calories (kcal per 100g), ` +
    `protein (grams per 100g), iron (mg per 100g), calcium (mg per 100g). ` +
    `No text, no units, just the JSON.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a pediatric nutrition assistant. You return concise JSON nutrient estimates. Values are best-effort estimates for educational use.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI request failed: ${res.status}`);
  }

  const raw: unknown = await res.json();
  if (!isOpenAIResponse(raw)) throw new Error('Unexpected OpenAI response shape');
  const content = raw.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty AI response');

  const parsedRaw: unknown = JSON.parse(content);
  if (!isOpenAINutrients(parsedRaw)) throw new Error('Unexpected nutrient JSON shape');

  return {
    source: 'ai',
    calories: clamp(round((Number(parsedRaw.calories) || 0) * servingFactor), 0, 4000),
    protein: clamp(round((Number(parsedRaw.protein) || 0) * servingFactor, 1), 0, 200),
    iron: clamp(round((Number(parsedRaw.iron) || 0) * servingFactor, 2), 0, 50),
    calcium: clamp(round((Number(parsedRaw.calcium) || 0) * servingFactor), 0, 3000),
  };
}

/**
 * Analyze a meal's nutrients from a food description and portion. Uses OpenAI
 * when EXPO_PUBLIC_OPENAI_API_KEY is set; otherwise falls back to a local
 * heuristic estimate so the feature still works offline.
 */
export async function analyzeMeal(food: string, portion: string): Promise<NutrientEstimate> {
  const trimmed = food.trim();
  if (!trimmed) {
    return { source: 'estimate', calories: 0, protein: 0, iron: 0, calcium: 0 };
  }

  if (OPENAI_KEY) {
    try {
      return await aiEstimate(trimmed, portion);
    } catch {
      const fallback = heuristicEstimate(trimmed, portion);
      return {
        ...fallback,
        note: 'AI analysis unavailable right now — showing an estimate. Adjust values as needed.',
      };
    }
  }

  return heuristicEstimate(trimmed, portion);
}

export const hasAIAnalysis = Boolean(OPENAI_KEY);
