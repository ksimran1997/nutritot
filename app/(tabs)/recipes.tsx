import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ChevronRight, Clock, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card, Chip, Text, useThemeColor } from 'heroui-native';

import { ChildSwitcher } from '@/components/ChildSwitcher';
import { useActiveChild } from '@/lib/store';
import { AGE_STAGES, getAgeMonths, getAgeStage } from '@/lib/nutrition';
import {
  filterByNutrients,
  type NutrientFocus,
  NUTRIENT_FILTERS,
  recipeHasNutrient,
  recipesFor,
} from '@/lib/recipes';
import { DIET_LABELS } from '@/lib/utils';

export default function RecipesScreen() {
  const profile = useActiveChild();
  const router = useRouter();
  const [muted, accent] = useThemeColor(['muted', 'accent']);

  const [focuses, setFocuses] = useState<NutrientFocus[]>([]);

  const stage = useMemo(
    () => (profile ? getAgeStage(getAgeMonths(profile.birthDate)) : AGE_STAGES[0]),
    [profile],
  );

  const toggleFocus = (id: NutrientFocus) =>
    setFocuses((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  if (!profile) return null;

  const allRecommended = recipesFor(stage.id, profile.diet);
  const recommended = filterByNutrients(allRecommended, focuses);
  const browseStages = AGE_STAGES;

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-16 gap-4">
        <ChildSwitcher />
        <View className="gap-1">
          <Text.Heading type="h2">Food ideas</Text.Heading>
          <View className="flex-row flex-wrap items-center gap-2">
            <Chip variant="soft">
              <Chip.Label>{stage.label}</Chip.Label>
            </Chip>
            <Chip variant="soft">
              <Chip.Label>{DIET_LABELS[profile.diet]}</Chip.Label>
            </Chip>
          </View>
        </View>

        <Card variant="secondary">
          <Card.Body className="gap-1">
            <Text className="text-accent text-sm font-semibold">{stage.summary}</Text>
            <Text className="text-muted text-sm">{stage.feedingNote}</Text>
          </Card.Body>
        </Card>

        <Pressable onPress={() => router.push('/suggest')}>
          <Card>
            <Card.Body className="flex-row items-center gap-3">
              <View className="bg-peach-soft h-10 w-10 items-center justify-center rounded-full">
                <Sparkles color={accent} size={20} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-foreground font-semibold">Suggest from ingredients</Text>
                <Text className="text-muted text-xs">
                  Enter what you have in the Suggest tab to get matching ideas
                </Text>
              </View>
              <ChevronRight color={muted} size={18} />
            </Card.Body>
          </Card>
        </Pressable>

        <View className="gap-2">
          <Text className="text-muted px-1 text-xs font-semibold uppercase">
            Babies need plenty of these
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {NUTRIENT_FILTERS.map((f) => {
              const active = focuses.includes(f.id);
              return (
                <Pressable
                  key={f.id}
                  onPress={() => toggleFocus(f.id)}
                  className={`rounded-full border px-3.5 py-1.5 ${
                    active ? 'border-accent bg-peach-soft' : 'border-border bg-surface'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${active ? 'text-accent' : 'text-foreground'}`}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text className="text-foreground px-1 text-base font-semibold">
          {focuses.length > 0
            ? `${NUTRIENT_FILTERS.filter((f) => focuses.includes(f.id))
                .map((f) => f.label)
                .join(' + ')} ideas`
            : `Recommended for ${profile.name}`}
        </Text>
        {recommended.length === 0 ? (
          <Text className="text-muted px-1 text-sm">
            {focuses.length > 0
              ? 'No matching ideas for this stage yet — clear a filter or browse other ages below.'
              : 'No tailored recipes for this stage yet — browse other ages below.'}
          </Text>
        ) : (
          recommended.map((r) => (
            <Pressable key={r.id} onPress={() => router.push(`/recipe/${r.id}`)}>
              <Card>
                <Card.Body className="flex-row items-center gap-3">
                  <Text className="text-3xl">{r.emoji}</Text>
                  <View className="flex-1 gap-1">
                    <Text className="text-foreground font-semibold">{r.title}</Text>
                    <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
                      <View className="flex-row items-center gap-1">
                        <Clock color={muted} size={13} />
                        <Text className="text-muted text-xs">{r.prepMins} min</Text>
                      </View>
                      <Text className="text-muted text-xs">{r.highlights.join(' · ')}</Text>
                    </View>
                  </View>
                  <View className="items-end gap-1">
                    {NUTRIENT_FILTERS.filter((f) => recipeHasNutrient(r, f.id)).map((f) => (
                      <Chip key={f.id} variant="soft">
                        <Chip.Label>{f.label}</Chip.Label>
                      </Chip>
                    ))}
                    <ChevronRight color={muted} size={18} />
                  </View>
                </Card.Body>
              </Card>
            </Pressable>
          ))
        )}

        <Text className="text-foreground mt-2 px-1 text-base font-semibold">Browse by age</Text>
        {browseStages.map((s) => {
          const count = recipesFor(s.id, profile.diet).length;
          return (
            <Card key={s.id} variant="secondary">
              <Card.Body className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-foreground font-semibold">{s.label}</Text>
                  <Text className="text-muted text-xs">
                    {count} idea{count === 1 ? '' : 's'}
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {recipesFor(s.id, profile.diet).map((r) => (
                    <Pressable
                      key={r.id}
                      onPress={() => router.push(`/recipe/${r.id}`)}
                      className="border-border bg-surface flex-row items-center gap-1.5 rounded-full border px-3 py-1.5"
                    >
                      <Text className="text-sm">{r.emoji}</Text>
                      <Text className="text-foreground text-sm">{r.title}</Text>
                    </Pressable>
                  ))}
                </View>
              </Card.Body>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
