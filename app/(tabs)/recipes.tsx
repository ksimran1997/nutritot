import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ChevronRight, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card, Chip, Text, useThemeColor } from 'heroui-native';

import { useBabyStore } from '@/lib/store';
import { AGE_STAGES, getAgeMonths, getAgeStage } from '@/lib/nutrition';
import { recipesFor } from '@/lib/recipes';
import { DIET_LABELS } from '@/lib/utils';

export default function RecipesScreen() {
  const profile = useBabyStore((s) => s.profile);
  const router = useRouter();
  const [muted] = useThemeColor(['muted']);

  const stage = useMemo(
    () => (profile ? getAgeStage(getAgeMonths(profile.birthDate)) : AGE_STAGES[0]),
    [profile],
  );

  if (!profile) return null;

  const recommended = recipesFor(stage.id, profile.diet);
  const otherStages = AGE_STAGES.filter((s) => s.id !== stage.id);

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-16 gap-4">
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

        <Text className="text-foreground px-1 text-base font-semibold">
          Recommended for {profile.name}
        </Text>
        {recommended.length === 0 ? (
          <Text className="text-muted px-1 text-sm">
            No tailored recipes for this stage yet — browse other ages below.
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
                  <ChevronRight color={muted} size={18} />
                </Card.Body>
              </Card>
            </Pressable>
          ))
        )}

        <Text className="text-foreground mt-2 px-1 text-base font-semibold">
          Explore other ages
        </Text>
        {otherStages.map((s) => {
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
