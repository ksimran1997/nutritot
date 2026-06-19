import type { DietPreference } from '@/lib/types';

export interface Recipe {
  id: string;
  title: string;
  emoji: string;
  /** age stage ids this recipe suits */
  stageIds: string[];
  diets: DietPreference[];
  prepMins: number;
  highlights: string[]; // key nutrients
  ingredients: string[];
  steps: string[];
}

/**
 * Curated age- and diet-appropriate food ideas. Educational suggestions only;
 * always check for allergies and follow a pediatrician's advice.
 */
export const RECIPES: Recipe[] = [
  {
    id: 'milk-only',
    title: 'Breast milk or formula',
    emoji: '🍼',
    stageIds: ['0-6m'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 0,
    highlights: ['Complete nutrition', 'Hydration'],
    ingredients: ['Breast milk on demand, or prepared infant formula'],
    steps: [
      'Feed on demand, watching for hunger cues.',
      'No water, juice, or solids needed before about 6 months.',
    ],
  },
  {
    id: 'avocado-puree',
    title: 'Smooth avocado purée',
    emoji: '🥑',
    stageIds: ['6-8m'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 5,
    highlights: ['Healthy fats', 'Energy'],
    ingredients: ['1/2 ripe avocado', 'A little breast milk or formula to thin'],
    steps: ['Mash avocado until very smooth.', 'Thin with milk to a runny purée.', 'Serve fresh.'],
  },
  {
    id: 'iron-lentil-puree',
    title: 'Red lentil & carrot purée',
    emoji: '🥕',
    stageIds: ['6-8m', '9-11m'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 20,
    highlights: ['Iron', 'Protein', 'Vitamin A'],
    ingredients: ['2 tbsp red lentils', '1 small carrot', 'Water'],
    steps: [
      'Simmer lentils and chopped carrot until very soft.',
      'Blend to a smooth purée, adding cooking water as needed.',
      'Cool to lukewarm before serving.',
    ],
  },
  {
    id: 'oat-banana',
    title: 'Banana oat porridge',
    emoji: '🍌',
    stageIds: ['6-8m', '9-11m'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 10,
    highlights: ['Energy', 'Fibre', 'Iron'],
    ingredients: ['2 tbsp baby oats', 'Milk or formula', '1/4 ripe banana'],
    steps: [
      'Cook oats in milk until soft.',
      'Mash in banana.',
      'Stir to a smooth, thick porridge.',
    ],
  },
  {
    id: 'egg-yolk-mash',
    title: 'Soft egg & potato mash',
    emoji: '🥚',
    stageIds: ['9-11m'],
    diets: ['vegetarian', 'non-vegetarian'],
    prepMins: 15,
    highlights: ['Protein', 'Iron', 'Choline'],
    ingredients: ['1 well-cooked egg', '1 small boiled potato', 'A little milk'],
    steps: [
      'Boil egg fully and mash with potato.',
      'Loosen with milk to a soft, lumpy texture.',
      'Serve warm in small spoonfuls.',
    ],
  },
  {
    id: 'chicken-veg-mash',
    title: 'Chicken & sweet potato mash',
    emoji: '🍗',
    stageIds: ['9-11m', '12-23m'],
    diets: ['non-vegetarian'],
    prepMins: 25,
    highlights: ['Iron', 'Protein', 'Zinc'],
    ingredients: ['30g cooked chicken', '1/2 sweet potato', 'Water or stock (no salt)'],
    steps: [
      'Cook and finely shred chicken.',
      'Mash with cooked sweet potato.',
      'Blend or mash to an age-appropriate texture.',
    ],
  },
  {
    id: 'tofu-veg-fingers',
    title: 'Tofu & veggie soft fingers',
    emoji: '🧈',
    stageIds: ['9-11m', '12-23m'],
    diets: ['vegan', 'vegetarian'],
    prepMins: 15,
    highlights: ['Protein', 'Calcium', 'Iron'],
    ingredients: ['Firm tofu strips', 'Steamed broccoli florets', 'A drizzle of oil'],
    steps: [
      'Lightly pan-fry tofu strips until set.',
      'Steam broccoli until soft.',
      'Serve as soft finger foods, cut to safe sizes.',
    ],
  },
  {
    id: 'bean-veg-bowl',
    title: 'Mashed bean & veg bowl',
    emoji: '🫘',
    stageIds: ['12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 15,
    highlights: ['Iron', 'Protein', 'Fibre'],
    ingredients: ['Cooked kidney beans', 'Soft cooked vegetables', 'Olive oil'],
    steps: [
      'Lightly mash beans and vegetables together.',
      'Stir in a little oil for energy.',
      'Serve warm with a spoon or as soft scoops.',
    ],
  },
  {
    id: 'fish-rice',
    title: 'Soft fish & rice',
    emoji: '🐟',
    stageIds: ['12-23m', '24m+'],
    diets: ['non-vegetarian'],
    prepMins: 20,
    highlights: ['Omega-3', 'Protein', 'Iodine'],
    ingredients: ['White fish fillet (deboned)', 'Soft cooked rice', 'Steamed peas'],
    steps: [
      'Steam fish thoroughly and check for bones.',
      'Flake and mix with soft rice and peas.',
      'Serve warm in small portions.',
    ],
  },
  {
    id: 'yogurt-fruit',
    title: 'Yogurt with mashed fruit',
    emoji: '🥣',
    stageIds: ['12-23m', '24m+'],
    diets: ['vegetarian', 'non-vegetarian'],
    prepMins: 5,
    highlights: ['Calcium', 'Protein', 'Probiotics'],
    ingredients: ['Plain full-fat yogurt', 'Mashed berries or banana'],
    steps: ['Spoon yogurt into a bowl.', 'Swirl in mashed fruit.', 'Serve chilled.'],
  },
  {
    id: 'fortified-cereal',
    title: 'Iron-fortified breakfast bowl',
    emoji: '🥥',
    stageIds: ['12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 5,
    highlights: ['Iron', 'Energy'],
    ingredients: ['Iron-fortified baby cereal', 'Fortified plant or dairy milk', 'Soft fruit'],
    steps: [
      'Mix cereal with warm milk.',
      'Top with soft mashed fruit.',
      'Serve at a safe temperature.',
    ],
  },
];

export function recipesFor(stageId: string, diet: DietPreference): Recipe[] {
  return RECIPES.filter((r) => r.stageIds.includes(stageId) && r.diets.includes(diet));
}

export interface RecipeSuggestion {
  recipe: Recipe;
  /** How many of the parent's ingredients this recipe uses. */
  matched: string[];
  /** Recipe ingredients the parent did not list. */
  missing: string[];
  /** 0–1 share of recipe ingredients the parent already has. */
  coverage: number;
  /** True when the parent already has every ingredient this recipe needs. */
  canMakeNow: boolean;
  /** True when the recipe suits the baby's current age stage. */
  inStage: boolean;
}

/**
 * Some recipe ingredients are basic staples most kitchens already have. We
 * don't penalise a recipe for "needing" these when deciding whether a parent
 * can make it from what they listed.
 */
const PANTRY_STAPLES = new Set(['water', 'oil', 'stock', 'milk', 'formula']);

/** Common words to ignore when comparing free-text ingredients. */
const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'of',
  'and',
  'or',
  'to',
  'with',
  'fresh',
  'ripe',
  'small',
  'large',
  'little',
  'cooked',
  'boiled',
  'steamed',
  'soft',
  'firm',
  'plain',
  'some',
  'no',
  'salt',
  'water',
  'cup',
  'cups',
  'tbsp',
  'tsp',
  'tablespoon',
  'teaspoon',
  'g',
  'gram',
  'grams',
  'ml',
  'piece',
  'pieces',
  'slice',
  'slices',
  'drizzle',
  'thin',
]);

/** Normalise a phrase into meaningful keyword tokens. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s/]/g, ' ')
    .split(/[\s/]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    .map((w) => (w.endsWith('es') ? w.slice(0, -2) : w.endsWith('s') ? w.slice(0, -1) : w));
}

/** Split a parent's free-text list ("banana, oats and milk") into terms. */
export function parseIngredientInput(input: string): string[] {
  return input
    .split(/[,\n;]+|\band\b/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Rank recipes by how well they can be made from the ingredients a parent
 * actually listed. Only recipes whose main ingredients are mostly covered by
 * the parent's input are returned, so suggestions stay grounded in what they
 * have rather than introducing extra ingredients. Filtered to the baby's diet
 * and sorted with ready-to-make, age-appropriate recipes first.
 * Educational suggestions only.
 */
export function suggestFromIngredients(
  rawIngredients: string[],
  diet: DietPreference,
  stageId: string,
): RecipeSuggestion[] {
  const parentTokens = new Set(rawIngredients.flatMap(tokenize));
  if (parentTokens.size === 0) return [];

  const suggestions: RecipeSuggestion[] = [];

  for (const recipe of RECIPES) {
    if (!recipe.diets.includes(diet)) continue;

    const matched: string[] = [];
    const missing: string[] = [];
    /** Non-staple ingredients the parent did not list — these "count against" the recipe. */
    let missingCore = 0;

    for (const ingredient of recipe.ingredients) {
      const tokens = tokenize(ingredient);
      if (tokens.length === 0) continue;
      const hit = tokens.some((t) => parentTokens.has(t));
      if (hit) {
        matched.push(ingredient);
      } else {
        missing.push(ingredient);
        if (!tokens.every((t) => PANTRY_STAPLES.has(t))) missingCore += 1;
      }
    }

    if (matched.length === 0) continue;

    // Keep suggestions grounded in what the parent listed: only recipes they
    // can make now (no missing core ingredients) or that need at most one more.
    if (missingCore > 1) continue;

    const considered = matched.length + missing.length || 1;
    suggestions.push({
      recipe,
      matched,
      missing,
      coverage: matched.length / considered,
      canMakeNow: missingCore === 0,
      inStage: recipe.stageIds.includes(stageId),
    });
  }

  return suggestions.sort((a, b) => {
    if (a.canMakeNow !== b.canMakeNow) return a.canMakeNow ? -1 : 1;
    if (a.inStage !== b.inStage) return a.inStage ? -1 : 1;
    if (b.matched.length !== a.matched.length) return b.matched.length - a.matched.length;
    return b.coverage - a.coverage;
  });
}
