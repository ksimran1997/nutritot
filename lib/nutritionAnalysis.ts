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

/**
 * Very rough local estimator used when no AI key is configured. Scales a
 * baseline nutrient density by keywords found in the food description and by a
 * parsed portion size in grams. Educational estimates only.
 */
function heuristicEstimate(food: string, portion: string): NutrientEstimate {
  const text = `${food} ${portion}`.toLowerCase();

  // Parse a gram amount from the portion ("100g", "1 cup", "2 tbsp"...).
  const grams = parsePortionGrams(text);
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

function parsePortionGrams(text: string): number {
  const gramMatch = text.match(/(\d+(?:\.\d+)?)\s*(g|gram|grams)\b/);
  if (gramMatch) return clamp(Number(gramMatch[1]), 1, 2000);

  const mlMatch = text.match(/(\d+(?:\.\d+)?)\s*(ml|millilit)/);
  if (mlMatch) return clamp(Number(mlMatch[1]), 1, 2000); // ~1g per ml

  const qty = text.match(/(\d+(?:\.\d+)?)/);
  const n = qty ? Number(qty[1]) : 1;
  if (text.includes('cup')) return clamp(n * 150, 1, 2000);
  if (text.includes('tbsp') || text.includes('tablespoon')) return clamp(n * 15, 1, 2000);
  if (text.includes('tsp') || text.includes('teaspoon')) return clamp(n * 5, 1, 2000);
  if (text.includes('bowl')) return clamp(n * 200, 1, 2000);
  if (text.includes('piece') || text.includes('slice')) return clamp(n * 40, 1, 2000);
  // Default to a typical baby serving.
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
  const prompt =
    `Estimate the nutrient content of this food for a baby/toddler meal.\n` +
    `Food: ${food}\nPortion: ${portionText}\n\n` +
    `Return ONLY a JSON object with numeric fields: calories (kcal), protein (grams), ` +
    `iron (mg), calcium (mg). No text, no units, just the JSON.`;

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
    calories: clamp(round(Number(parsedRaw.calories) || 0), 0, 4000),
    protein: clamp(round(Number(parsedRaw.protein) || 0, 1), 0, 200),
    iron: clamp(round(Number(parsedRaw.iron) || 0, 2), 0, 50),
    calcium: clamp(round(Number(parsedRaw.calcium) || 0), 0, 3000),
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
