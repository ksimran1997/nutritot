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
  {
    id: 'lentil-sweet-potato-patties',
    title: 'Lentil & sweet potato patties',
    emoji: '🍠',
    stageIds: ['12-23m'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 25,
    highlights: ['Iron', 'Protein', 'Fibre'],
    ingredients: ['Cooked red lentils', 'Mashed sweet potato', 'Oat flour', 'A little olive oil'],
    steps: [
      'Mix the lentils, sweet potato and oat flour into a soft dough.',
      'Shape into small flat patties.',
      'Cook with a little oil until set, then cool and cut into easy-to-hold pieces.',
    ],
  },
  {
    id: 'spinach-cheese-omelette',
    title: 'Spinach & cheese omelette',
    emoji: '🍳',
    stageIds: ['12-23m'],
    diets: ['vegetarian', 'non-vegetarian'],
    prepMins: 10,
    highlights: ['Protein', 'Iron', 'Calcium'],
    ingredients: ['1 egg', 'Finely chopped spinach', 'Grated mild cheese', 'A little oil'],
    steps: [
      'Whisk the egg with spinach and cheese.',
      'Cook gently until the egg is fully set on both sides.',
      'Cool slightly and slice into soft finger-sized strips.',
    ],
  },
  {
    id: 'turkey-vegetable-meatballs',
    title: 'Turkey & vegetable meatballs',
    emoji: '🍗',
    stageIds: ['12-23m'],
    diets: ['non-vegetarian'],
    prepMins: 30,
    highlights: ['Iron', 'Protein', 'Zinc'],
    ingredients: ['Minced turkey', 'Grated courgette', 'Oat flour', 'A little olive oil'],
    steps: [
      'Mix the turkey, courgette and oat flour.',
      'Shape into small meatballs and bake until fully cooked through.',
      'Cut into safe bite-sized pieces before serving.',
    ],
  },

  // ---- Indian ----
  {
    id: 'soya-veg-khichdi',
    title: 'Soya chunk & veg khichdi',
    emoji: '🍚',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 25,
    highlights: ['Protein', 'Iron', 'Energy'],
    ingredients: [
      'Soya chunks (soaked, finely chopped)',
      'Rice',
      'Moong dal',
      'Soft cooked carrot',
      'A little ghee or oil',
      'Water',
    ],
    steps: [
      'Soak soya chunks in hot water, squeeze and chop very finely.',
      'Pressure-cook rice, dal, soya and carrot until very soft and mushy.',
      'Mash to an age-appropriate texture and stir in a little ghee or oil.',
    ],
  },
  {
    id: 'paneer-veg-mash',
    title: 'Paneer & vegetable mash',
    emoji: '🧀',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['vegetarian', 'non-vegetarian'],
    prepMins: 15,
    highlights: ['Calcium', 'Protein'],
    ingredients: ['Soft paneer (cottage cheese)', 'Steamed peas', 'Boiled potato', 'A little ghee'],
    steps: [
      'Crumble soft paneer finely.',
      'Mash with steamed peas and boiled potato.',
      'Stir in a little ghee and serve warm.',
    ],
  },
  {
    id: 'dal-rice',
    title: 'Soft dal & rice',
    emoji: '🥘',
    stageIds: ['6-8m', '9-11m', '12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 20,
    highlights: ['Protein', 'Iron', 'Energy'],
    ingredients: [
      'Moong dal (lentils)',
      'Rice',
      'A pinch of turmeric',
      'Water',
      'A little ghee or oil',
    ],
    steps: [
      'Cook dal and rice together with turmeric until very soft.',
      'Mash well to a smooth, runny consistency.',
      'Add a little ghee or oil for energy.',
    ],
  },
  {
    id: 'ragi-porridge',
    title: 'Ragi (finger millet) porridge',
    emoji: '🥣',
    stageIds: ['6-8m', '9-11m', '12-23m'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 15,
    highlights: ['Calcium', 'Iron', 'Energy'],
    ingredients: ['Ragi flour (finger millet)', 'Milk or formula', 'Mashed banana or jaggery'],
    steps: [
      'Whisk ragi flour into milk with no lumps.',
      'Cook gently, stirring, until thick and glossy.',
      'Sweeten lightly with mashed banana and serve warm.',
    ],
  },
  {
    id: 'idli-mash',
    title: 'Soft idli mash',
    emoji: '🍥',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 10,
    highlights: ['Energy', 'Easy to digest'],
    ingredients: ['Steamed idli', 'A little milk or curd', 'Mashed soft vegetables'],
    steps: [
      'Mash a steamed idli with a little milk or curd.',
      'Mix in soft mashed vegetables.',
      'Serve warm and soft.',
    ],
  },

  // ---- Middle Eastern ----
  {
    id: 'hummus-mash',
    title: 'Smooth hummus',
    emoji: '🥙',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 10,
    highlights: ['Protein', 'Iron', 'Healthy fats'],
    ingredients: ['Cooked chickpeas', 'Tahini (sesame paste)', 'A little olive oil', 'Lemon juice'],
    steps: [
      'Blend chickpeas with tahini and a little olive oil until very smooth.',
      'Add a small squeeze of lemon and thin with water as needed.',
      'Serve as a dip with soft bread or vegetables.',
    ],
  },
  {
    id: 'lentil-soup',
    title: 'Red lentil soup (shorba)',
    emoji: '🍲',
    stageIds: ['6-8m', '9-11m', '12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 25,
    highlights: ['Iron', 'Protein'],
    ingredients: [
      'Red lentils',
      'Carrot',
      'Cumin',
      'Water or stock (no salt)',
      'A little olive oil',
    ],
    steps: [
      'Simmer lentils and carrot with a pinch of cumin until soft.',
      'Blend smooth and thin to a soupy texture.',
      'Cool to lukewarm before serving.',
    ],
  },
  {
    id: 'labneh-fruit',
    title: 'Labneh with soft fruit',
    emoji: '🍶',
    stageIds: ['12-23m', '24m+'],
    diets: ['vegetarian', 'non-vegetarian'],
    prepMins: 5,
    highlights: ['Calcium', 'Protein', 'Probiotics'],
    ingredients: ['Labneh (strained yogurt)', 'Mashed soft fruit', 'A drizzle of olive oil'],
    steps: ['Spoon labneh into a bowl.', 'Swirl in mashed fruit.', 'Serve chilled.'],
  },

  // ---- European / British ----
  {
    id: 'veg-risotto',
    title: 'Soft pea & cheese risotto',
    emoji: '🍚',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['vegetarian', 'non-vegetarian'],
    prepMins: 25,
    highlights: ['Energy', 'Calcium', 'Protein'],
    ingredients: [
      'Risotto or short-grain rice',
      'Steamed peas',
      'Grated cheese',
      'Stock (no salt)',
    ],
    steps: [
      'Cook rice slowly in unsalted stock until very soft and creamy.',
      'Stir in steamed peas and a little grated cheese.',
      'Mash lightly to a safe texture and serve warm.',
    ],
  },
  {
    id: 'pasta-tomato',
    title: 'Soft pasta with tomato & veg',
    emoji: '🍝',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 20,
    highlights: ['Energy', 'Vitamin C', 'Fibre'],
    ingredients: ['Small soft pasta', 'Ripe tomato', 'Courgette (zucchini)', 'A little olive oil'],
    steps: [
      'Cook pasta until very soft.',
      'Simmer chopped tomato and courgette into a soft sauce with a little oil.',
      'Mix and mash lightly to a safe texture.',
    ],
  },
  {
    id: 'shepherds-veg',
    title: 'Cottage-style lentil & potato bake',
    emoji: '🥔',
    stageIds: ['12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 30,
    highlights: ['Iron', 'Protein', 'Energy'],
    ingredients: ['Cooked lentils', 'Mashed potato', 'Soft cooked carrot and peas', 'A little oil'],
    steps: [
      'Mix cooked lentils with soft carrot and peas.',
      'Top with mashed potato and warm through.',
      'Serve soft, mashing further if needed.',
    ],
  },

  // ---- American ----
  {
    id: 'sweet-potato-mash',
    title: 'Mashed sweet potato',
    emoji: '🍠',
    stageIds: ['6-8m', '9-11m', '12-23m'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 20,
    highlights: ['Vitamin A', 'Energy', 'Fibre'],
    ingredients: ['Sweet potato', 'A little milk or formula', 'A pinch of cinnamon'],
    steps: [
      'Roast or boil sweet potato until very soft.',
      'Mash with a little milk to a smooth purée.',
      'Add a tiny pinch of cinnamon if liked.',
    ],
  },
  {
    id: 'peanut-banana-toast',
    title: 'Banana & smooth peanut toast',
    emoji: '🥜',
    stageIds: ['12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 5,
    highlights: ['Energy', 'Protein', 'Healthy fats'],
    ingredients: ['Soft bread or toast', 'Smooth peanut butter (thinned)', 'Mashed banana'],
    steps: [
      'Spread a thin layer of smooth peanut butter, thinned with a little water.',
      'Top with mashed banana.',
      'Cut into soft, safe strips. Introduce peanut early only per pediatric advice.',
    ],
  },
  {
    id: 'scrambled-egg-cheese',
    title: 'Soft scrambled egg & cheese',
    emoji: '🍳',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['vegetarian', 'non-vegetarian'],
    prepMins: 10,
    highlights: ['Protein', 'Choline', 'Calcium'],
    ingredients: ['Egg', 'A little grated cheese', 'A splash of milk', 'A little butter or oil'],
    steps: [
      'Whisk egg with a splash of milk.',
      'Cook gently with a little butter until fully set and soft.',
      'Fold in a little grated cheese and serve in small pieces.',
    ],
  },

  // ---- Iron & protein focused ----
  {
    id: 'rajma-mash',
    title: 'Mashed kidney bean (rajma) bowl',
    emoji: '🫘',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 25,
    highlights: ['Iron', 'Protein', 'Fibre'],
    ingredients: [
      'Cooked kidney beans (rajma)',
      'Soft cooked tomato',
      'A pinch of cumin',
      'A little oil',
      'Water',
    ],
    steps: [
      'Simmer cooked kidney beans with soft tomato and a pinch of cumin until very tender.',
      'Mash thoroughly to a smooth, lump-free texture for younger babies.',
      'Stir in a little oil and serve warm.',
    ],
  },
  {
    id: 'spinach-lentil-puree',
    title: 'Spinach & lentil purée',
    emoji: '🥬',
    stageIds: ['6-8m', '9-11m', '12-23m'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 20,
    highlights: ['Iron', 'Protein', 'Folate'],
    ingredients: ['Red lentils', 'Soft cooked spinach', 'A little oil', 'Water'],
    steps: [
      'Cook lentils until very soft and stir in washed, soft-cooked spinach.',
      'Blend smooth, adding cooking water to loosen.',
      'Serve with a vitamin C food (like a little mashed fruit) to help iron absorption.',
    ],
  },
  {
    id: 'beef-veg-mash',
    title: 'Soft beef & vegetable mash',
    emoji: '🥩',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['non-vegetarian'],
    prepMins: 30,
    highlights: ['Iron', 'Protein', 'Zinc'],
    ingredients: [
      'Finely cooked lean beef',
      'Boiled potato',
      'Soft cooked carrot',
      'Water or stock (no salt)',
    ],
    steps: [
      'Cook lean beef very thoroughly and blend or finely shred.',
      'Mash with boiled potato and soft carrot, loosening with a little stock.',
      'Serve warm at an age-appropriate texture.',
    ],
  },
  {
    id: 'chana-spinach',
    title: 'Chickpea & spinach mash',
    emoji: '🥗',
    stageIds: ['9-11m', '12-23m', '24m+'],
    diets: ['vegan', 'vegetarian', 'non-vegetarian'],
    prepMins: 20,
    highlights: ['Iron', 'Protein', 'Folate'],
    ingredients: ['Cooked chickpeas', 'Soft cooked spinach', 'A little olive oil', 'Lemon juice'],
    steps: [
      'Mash well-cooked chickpeas with soft spinach until smooth.',
      'Loosen with a little olive oil and a squeeze of lemon.',
      'Serve warm — pair with a vitamin C food to boost iron uptake.',
    ],
  },
];

export function recipesFor(stageId: string, diet: DietPreference): Recipe[] {
  return RECIPES.filter((r) => r.stageIds.includes(stageId) && r.diets.includes(diet));
}

/** Nutrient focus filters parents can apply to recipe lists. */
export type NutrientFocus = 'iron' | 'protein';

export const NUTRIENT_FILTERS: { id: NutrientFocus; label: string; keyword: string }[] = [
  { id: 'iron', label: 'Iron rich', keyword: 'iron' },
  { id: 'protein', label: 'Protein rich', keyword: 'protein' },
];

/** True when a recipe highlights the given nutrient focus. */
export function recipeHasNutrient(recipe: Recipe, focus: NutrientFocus): boolean {
  const keyword = NUTRIENT_FILTERS.find((f) => f.id === focus)?.keyword ?? focus;
  return recipe.highlights.some((h) => h.toLowerCase().includes(keyword));
}

/** Filter a recipe list to those matching all selected nutrient focuses. */
export function filterByNutrients(recipes: Recipe[], focuses: NutrientFocus[]): Recipe[] {
  if (focuses.length === 0) return recipes;
  return recipes.filter((r) => focuses.every((f) => recipeHasNutrient(r, f)));
}

export interface RecipeSuggestion {
  recipe: Recipe;
  /** The parent's own ingredient terms that this recipe uses. */
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

/**
 * Maps common ingredient names (including regional / international names) to the
 * canonical tokens used in recipe ingredient lists, so a parent typing "soya
 * chunks", "curd", "courgette" or "atta" still matches the right recipes.
 * Keys and values are single lowercase tokens (post-tokenisation).
 */
const SYNONYMS: Record<string, string[]> = {
  // Soya chunks (textured soy protein) are a distinct food from tofu. They map
  // to the dedicated `soyachunk` token only — never to `tofu` — so "soya
  // chunks" matches the soya recipes and never the tofu fingers.
  soya: ['soyachunk'],
  soy: ['soyachunk'],
  soyachunk: ['soyachunk'],
  chunk: ['soyachunk'],
  // Tofu stands on its own and shares no tokens with soya chunks.
  tofu: ['tofu'],
  paneer: ['paneer', 'cottage', 'cheese'],
  cottage: ['cottage', 'paneer', 'cheese'],
  curd: ['curd', 'yogurt', 'yoghurt'],
  yoghurt: ['yogurt', 'yoghurt', 'curd'],
  yogurt: ['yogurt', 'yoghurt', 'curd'],
  labneh: ['labneh', 'yogurt'],
  dal: ['dal', 'lentil', 'moong'],
  daal: ['dal', 'lentil', 'moong'],
  lentil: ['lentil', 'dal', 'moong'],
  moong: ['moong', 'dal', 'lentil'],
  chickpea: ['chickpea'],
  channa: ['chickpea'],
  chana: ['chickpea'],
  garbanzo: ['chickpea'],
  rajma: ['kidney', 'bean'],
  kidney: ['kidney', 'bean'],
  bean: ['bean', 'kidney'],
  spinach: ['spinach'],
  palak: ['spinach'],
  beef: ['beef'],
  mutton: ['beef'],
  ragi: ['ragi'],
  millet: ['ragi', 'millet'],
  jaggery: ['jaggery', 'banana'],
  ghee: ['ghee', 'oil', 'butter'],
  butter: ['butter', 'oil', 'ghee'],
  courgette: ['courgette', 'zucchini'],
  zucchini: ['zucchini', 'courgette'],
  capsicum: ['pepper'],
  brinjal: ['aubergine', 'eggplant'],
  aubergine: ['aubergine', 'eggplant'],
  eggplant: ['eggplant', 'aubergine'],
  atta: ['wheat', 'flour'],
  wheat: ['wheat', 'flour'],
  tahini: ['tahini', 'sesame'],
  sesame: ['sesame', 'tahini'],
  peanut: ['peanut'],
  groundnut: ['peanut'],
  idli: ['idli'],
  hummus: ['chickpea'],
  rice: ['rice', 'risotto'],
  risotto: ['risotto', 'rice'],
  pasta: ['pasta'],
  noodle: ['pasta'],
  sweetpotato: ['sweet', 'potato'],
  shakarkandi: ['sweet', 'potato'],
};

/** Normalise a phrase into meaningful keyword tokens, expanding known synonyms. */
function tokenize(text: string): string[] {
  const base = text
    .toLowerCase()
    .replace(/[^a-z\s/]/g, ' ')
    .split(/[\s/]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    .map((w) => (w.endsWith('es') ? w.slice(0, -2) : w.endsWith('s') ? w.slice(0, -1) : w));

  const expanded = new Set<string>();
  for (const word of base) {
    expanded.add(word);
    const syns = SYNONYMS[word];
    if (syns) for (const s of syns) expanded.add(s);
  }
  return [...expanded];
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
  // Track each parent term alongside its tokens so we can report back exactly
  // what the parent typed (not the recipe's wording) and which terms matched.
  const parentTerms = rawIngredients.map((term) => ({ term, tokens: new Set(tokenize(term)) }));
  const parentTokens = new Set(parentTerms.flatMap((t) => [...t.tokens]));
  if (parentTokens.size === 0) return [];

  const suggestions: RecipeSuggestion[] = [];

  for (const recipe of RECIPES) {
    if (!recipe.diets.includes(diet)) continue;

    const missing: string[] = [];
    /** Parent terms this recipe actually uses (kept as the parent typed them). */
    const matchedTerms = new Set<string>();
    /** Non-staple ingredients the parent did not list — these "count against" the recipe. */
    let missingCore = 0;
    /** Total non-staple ingredients the recipe needs. */
    let coreTotal = 0;
    let matchedCount = 0;
    /** Whether the parent covered the recipe's first (defining) core ingredient. */
    let definingMatched = false;
    let seenDefining = false;

    for (const ingredient of recipe.ingredients) {
      const tokens = tokenize(ingredient);
      if (tokens.length === 0) continue;
      const isStaple = tokens.every((t) => PANTRY_STAPLES.has(t));
      if (!isStaple) coreTotal += 1;

      // Which of the parent's terms cover this recipe ingredient?
      const coveringTerms = parentTerms.filter((p) => tokens.some((t) => p.tokens.has(t)));
      const isDefining = !isStaple && !seenDefining;
      if (isDefining) seenDefining = true;
      if (coveringTerms.length > 0) {
        matchedCount += 1;
        if (isDefining) definingMatched = true;
        for (const p of coveringTerms) matchedTerms.add(p.term);
      } else {
        missing.push(ingredient);
        if (!isStaple) missingCore += 1;
      }
    }

    if (matchedCount === 0) continue;

    // Keep suggestions grounded in what the parent listed, while still letting
    // a strong single ingredient surface its signature dish.
    //  - If the parent covers the recipe's defining (first non-staple)
    //    ingredient, surface it — the dish is built around something they
    //    have — and list the rest under "Also needs". This lets "soya chunks"
    //    surface the soya khichdi.
    //  - Otherwise the parent must cover at least half the core ingredients,
    //    so loosely related dishes (where they only share a minor ingredient)
    //    don't slip in.
    const coveredCore = coreTotal - missingCore;
    if (!definingMatched && coveredCore < Math.ceil(coreTotal / 2)) continue;

    const considered = coreTotal || 1;
    suggestions.push({
      recipe,
      matched: [...matchedTerms],
      missing,
      coverage: matchedCount / considered,
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
