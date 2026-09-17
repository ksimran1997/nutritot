import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {
  Card,
  Chip,
  Description,
  Input,
  Label,
  Text,
  TextField,
  useThemeColor,
} from 'heroui-native';

import { useActiveChild } from '@/lib/store';
import { ChildSwitcher } from '@/components/ChildSwitcher';
import { AGE_STAGES, getAgeMonths, getAgeStage } from '@/lib/nutrition';
import {
  parseIngredientInput,
  suggestFromIngredients,
  NUTRIENT_FILTERS,
  recipeHasNutrient,
} from '@/lib/recipes';
import { DIET_LABELS } from '@/lib/utils';

const QUICK_INGREDIENTS = [
  'banana',
  'oats',
  'avocado',
  'lentils',
  'soya chunks',
  'paneer',
  'chickpeas',
  'carrot',
  'sweet potato',
  'squash',
  'pumpkin',
  'apple',
  'dragon fruit',
  'mango',
  'papaya',
  'okra',
  'aubergine',
  'rice',
  'egg',
  'chicken',
  'tofu',
  'yogurt',
  'broccoli',
];

export default function SuggestScreen() {
  const profile = useActiveChild();
  const router = useRouter();
  const [muted, accent] = useThemeColor(['muted', 'accent']);

  const [input, setInput] = useState('');

  const stage = useMemo(
    () => (profile ? getAgeStage(getAgeMonths(profile.birthDate)) : AGE_STAGES[0]),
    [profile],
  );

  const terms = useMemo(() => parseIngredientInput(input), [input]);

  const suggestions = useMemo(() => {
    if (!profile || terms.length === 0) return [];
    return suggestFromIngredients(terms, profile.diet, stage.id);
  }, [profile, terms, stage.id]);

  if (!profile) return null;

  const addQuick = (item: string) => {
    setInput((prev) => {
      const existing = parseIngredientInput(prev).map((t) => t.toLowerCase());
      if (existing.includes(item.toLowerCase())) return prev;
      const trimmed = prev.trim();
      if (!trimmed) return item;
      return `${trimmed.replace(/[,\s]+$/, '')}, ${item}`;
    });
  };

  return (
    <View className="bg-background flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="px-5 pt-4 pb-16 gap-4"
          keyboardShouldPersistTaps="handled"
        >
          <ChildSwitcher />
          <View className="flex-row items-center gap-2">
            <Sparkles color={accent} size={18} />
            <Text className="text-foreground flex-1 text-sm">
              List what you have at home — we&apos;ll only suggest ideas you can make from those
              ingredients, matched to {profile.name}&apos;s age and diet.
            </Text>
          </View>

          <View className="flex-row flex-wrap items-center gap-2">
            <Chip variant="soft">
              <Chip.Label>{stage.label}</Chip.Label>
            </Chip>
            <Chip variant="soft">
              <Chip.Label>{DIET_LABELS[profile.diet]}</Chip.Label>
            </Chip>
          </View>

          <TextField>
            <Label>Ingredients</Label>
            <Input
              placeholder="e.g. banana, oats, milk"
              value={input}
              onChangeText={setInput}
              multiline
              numberOfLines={3}
              autoCapitalize="none"
              className="min-h-20"
            />
            <Description>Separate with commas or new lines.</Description>
          </TextField>

          <View className="gap-2">
            <Text className="text-muted text-xs font-semibold uppercase">Quick add</Text>
            <View className="flex-row flex-wrap gap-2">
              {QUICK_INGREDIENTS.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => addQuick(item)}
                  className="border-border bg-surface rounded-full border px-3 py-1.5"
                >
                  <Text className="text-foreground text-sm capitalize">{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {terms.length === 0 ? (
            <Card variant="secondary">
              <Card.Body>
                <Text className="text-muted text-sm">
                  Add a few ingredients above to see matching food ideas.
                </Text>
              </Card.Body>
            </Card>
          ) : suggestions.length === 0 ? (
            <Card variant="secondary">
              <Card.Body className="gap-1">
                <Text className="text-foreground font-semibold">Nothing matches yet</Text>
                <Text className="text-muted text-sm">
                  We only show ideas you can make from what you listed. Add another ingredient or
                  two (e.g. banana, oats, lentils, carrot), or browse all ideas in the Recipes tab.
                </Text>
              </Card.Body>
            </Card>
          ) : (
            <View className="gap-3">
              <Text className="text-foreground px-1 text-base font-semibold">
                {suggestions.length} idea{suggestions.length === 1 ? '' : 's'} from your ingredients
              </Text>
              {suggestions.map(({ recipe, matched, missing, inStage, canMakeNow }) => {
                const nutrientTags = NUTRIENT_FILTERS.filter((f) =>
                  recipeHasNutrient(recipe, f.id),
                );
                const showTagRow = canMakeNow || !inStage || nutrientTags.length > 0;

                return (
                  <Pressable key={recipe.id} onPress={() => router.push(`/recipe/${recipe.id}`)}>
                    <Card>
                      <Card.Body className="gap-3">
                        <View className="flex-row items-center gap-3">
                          <Text className="text-3xl">{recipe.emoji}</Text>
                          <View className="flex-1 gap-1">
                            <Text className="text-foreground font-semibold">{recipe.title}</Text>
                            <Text className="text-muted text-xs">
                              {recipe.highlights.join(' · ')}
                            </Text>
                            {showTagRow && (
                              <View className="flex-row flex-wrap items-center gap-1.5 pt-0.5">
                                {canMakeNow ? (
                                  <Chip variant="soft">
                                    <Chip.Label>Ready to make</Chip.Label>
                                  </Chip>
                                ) : null}
                                {!inStage && (
                                  <Chip variant="tertiary">
                                    <Chip.Label>Other age</Chip.Label>
                                  </Chip>
                                )}
                                {nutrientTags.map((f) => (
                                  <Chip key={f.id} variant="soft">
                                    <Chip.Label>{f.label}</Chip.Label>
                                  </Chip>
                                ))}
                              </View>
                            )}
                          </View>
                          <ChevronRight color={muted} size={18} />
                        </View>

                        <View className="gap-1">
                          <Text className="text-mint text-xs font-semibold">
                            You have: {matched.join(', ')}
                          </Text>
                          {missing.length > 0 && (
                            <Text className="text-muted text-xs">
                              Also needs: {missing.join(', ')}
                            </Text>
                          )}
                        </View>
                      </Card.Body>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text className="text-muted px-1 text-center text-[11px] leading-4">
            Ideas are matched to what you list (plus basic staples like water or oil). Always check
            for allergies, cut food to safe sizes, and follow your pediatrician&apos;s advice.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
