import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { Card, Chip, Text, useThemeColor } from 'heroui-native';

import { AddMealSheet } from '@/components/AddMealSheet';
import { NutrientBar } from '@/components/NutrientBar';
import { useBabyStore } from '@/lib/store';
import { formatAge, getAgeMonths, getAgeStage, getNutritionTargets } from '@/lib/nutrition';
import type { MealEntry, NutrientKey } from '@/lib/types';
import { cn, DIET_LABELS, todayKey } from '@/lib/utils';

const MEAL_LABELS: Record<MealEntry['type'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function TodayScreen() {
  const profile = useBabyStore((s) => s.profile);
  const meals = useBabyStore((s) => s.meals);
  const removeMeal = useBabyStore((s) => s.removeMeal);
  const [danger] = useThemeColor(['danger']);
  const [sheetOpen, setSheetOpen] = useState(false);

  const today = todayKey();
  const todaysMeals = useMemo(() => meals.filter((m) => m.date === today), [meals, today]);

  const totals = useMemo(() => {
    return todaysMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        iron: acc.iron + m.iron,
        calcium: acc.calcium + m.calcium,
      }),
      { calories: 0, protein: 0, iron: 0, calcium: 0 },
    );
  }, [todaysMeals]);

  if (!profile) return null;

  const ageMonths = getAgeMonths(profile.birthDate);
  const stage = getAgeStage(ageMonths);
  const targets = getNutritionTargets(ageMonths);

  const bars: { key: NutrientKey; label: string; unit: string; colorClass: string }[] = [
    { key: 'calories', label: 'Energy', unit: 'kcal', colorClass: 'bg-peach' },
    { key: 'protein', label: 'Protein', unit: 'g', colorClass: 'bg-mint' },
    { key: 'iron', label: 'Iron', unit: 'mg', colorClass: 'bg-grape' },
    { key: 'calcium', label: 'Calcium', unit: 'mg', colorClass: 'bg-sky' },
  ];

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-32 gap-4">
        <View className="gap-1">
          <Text.Heading type="h2">{profile.name}</Text.Heading>
          <View className="flex-row flex-wrap items-center gap-2">
            <Text.Paragraph color="muted">{formatAge(profile.birthDate)}</Text.Paragraph>
            <Chip variant="soft">
              <Chip.Label>{DIET_LABELS[profile.diet]}</Chip.Label>
            </Chip>
          </View>
        </View>

        <Card className="gap-1">
          <Card.Body className="gap-1">
            <Text className="text-accent text-sm font-semibold">
              {stage.label} · {stage.summary}
            </Text>
            <Text className="text-muted text-sm">{stage.feedingNote}</Text>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="gap-4">
            <View className="flex-row items-center justify-between">
              <Card.Title>Today&apos;s nutrition</Card.Title>
              <Text className="text-muted text-xs">{todaysMeals.length} logged</Text>
            </View>
            {bars.map((b) => (
              <NutrientBar
                key={b.key}
                label={b.label}
                unit={b.unit}
                current={totals[b.key]}
                target={targets[b.key]}
                colorClass={b.colorClass}
              />
            ))}
            <Text className="text-muted text-[11px] leading-4">
              Targets are educational estimates based on WHO guidance for {stage.label}. Always
              follow your pediatrician&apos;s advice.
            </Text>
          </Card.Body>
        </Card>

        <View className="gap-2">
          <Text className="text-foreground px-1 text-base font-semibold">Meals today</Text>
          {todaysMeals.length === 0 ? (
            <Card variant="secondary">
              <Card.Body className="items-center gap-1 py-6">
                <Text className="text-muted text-sm">No meals logged yet.</Text>
                <Text className="text-muted text-xs">Tap the + button to add the first one.</Text>
              </Card.Body>
            </Card>
          ) : (
            todaysMeals.map((m) => (
              <Card key={m.id}>
                <Card.Body className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 gap-0.5">
                    <Text className="text-foreground font-medium">{m.name}</Text>
                    <Text className="text-muted text-xs">
                      {MEAL_LABELS[m.type]} · {Math.round(m.calories)} kcal · {m.protein}g protein
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => removeMeal(m.id)}
                    hitSlop={8}
                    className="bg-default h-9 w-9 items-center justify-center rounded-full"
                  >
                    <Trash2 color={danger} size={16} />
                  </Pressable>
                </Card.Body>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => setSheetOpen(true)}
        className={cn(
          'bg-accent absolute right-5 bottom-6 h-14 w-14 items-center justify-center rounded-full',
        )}
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        }}
      >
        <Plus color="#fff" size={26} />
      </Pressable>

      <AddMealSheet isOpen={sheetOpen} onOpenChange={setSheetOpen} />
    </View>
  );
}
