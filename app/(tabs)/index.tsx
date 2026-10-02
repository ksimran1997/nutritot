import { useMemo, useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { Card, Chip, Text, useThemeColor } from 'heroui-native';

import { AddMealSheet } from '@/components/AddMealSheet';
import { AdBanner } from '@/components/AdBanner';
import { ChildSwitcher } from '@/components/ChildSwitcher';
import { NutrientBar } from '@/components/NutrientBar';
import { NutritionChart } from '@/components/NutritionChart';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useActiveChild, useBabyStore } from '@/lib/store';
import {
  buildNutritionSeries,
  formatAge,
  getAgeMonths,
  getAgeStage,
  getNutritionTargets,
  type NutritionRange,
} from '@/lib/nutrition';
import type { MealEntry, NutrientKey } from '@/lib/types';
import { cn, DIET_LABELS, todayKey } from '@/lib/utils';

const MEAL_LABELS: Record<MealEntry['type'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

const NUTRIENT_BARS: { key: NutrientKey; label: string; unit: string; colorClass: string }[] = [
  { key: 'calories', label: 'Calories', unit: 'kcal', colorClass: 'bg-peach' },
  { key: 'protein', label: 'Protein', unit: 'g', colorClass: 'bg-mint' },
  { key: 'iron', label: 'Iron', unit: 'mg', colorClass: 'bg-grape' },
  { key: 'calcium', label: 'Calcium', unit: 'mg', colorClass: 'bg-sky' },
];

const NUTRIENT_HEX: Record<NutrientKey, string> = {
  calories: '#e0a26a', // peach
  protein: '#27b08a', // mint
  iron: '#a061c4', // grape
  calcium: '#3aa6d4', // sky
};

export default function TodayScreen() {
  const profile = useActiveChild();
  const allMeals = useBabyStore((s) => s.meals);
  const removeMeal = useBabyStore((s) => s.removeMeal);
  const [danger] = useThemeColor(['danger']);
  const { width } = useWindowDimensions();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [range, setRange] = useState<NutritionRange>('week');
  const [chartNutrient, setChartNutrient] = useState<NutrientKey>('calories');

  const childId = profile?.id;
  const meals = useMemo(() => allMeals.filter((m) => m.childId === childId), [allMeals, childId]);

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

  const ageMonths = profile ? getAgeMonths(profile.birthDate) : 0;

  const series = useMemo(
    () => buildNutritionSeries(meals, chartNutrient, range, ageMonths),
    [meals, chartNutrient, range, ageMonths],
  );

  if (!profile) return null;

  const stage = getAgeStage(ageMonths);
  const targets = getNutritionTargets(ageMonths);

  const chartWidth = Math.min(width, 520) - 40 - 32; // screen padding + card padding
  const chartMeta = NUTRIENT_BARS.find((b) => b.key === chartNutrient)!;

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-32 gap-4">
        <ChildSwitcher />
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
            {NUTRIENT_BARS.map((b) => (
              <NutrientBar
                key={b.key}
                label={b.label}
                unit={b.unit}
                current={totals[b.key]}
                target={targets[b.key]}
                colorClass={b.colorClass}
              />
            ))}
            <View className="bg-default/60 gap-0.5 rounded-xl p-3">
              <Text className="text-foreground text-xs font-semibold">Average daily calories</Text>
              <Text className="text-muted text-[11px] leading-4">
                Babies at {stage.label.toLowerCase()} need around {targets.calories} kcal per day on
                average. Most of this comes from breast milk or formula in the early months, with
                solids adding more as your baby grows.
              </Text>
            </View>
            <Text className="text-muted text-[11px] leading-4">
              Targets are educational estimates based on WHO guidance for {stage.label}. Always
              follow your pediatrician&apos;s advice.
            </Text>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="gap-3">
            <View className="flex-row items-center justify-between gap-3">
              <Card.Title>Nutrition trend</Card.Title>
              <SegmentedControl<NutritionRange>
                className="w-40"
                value={range}
                onChange={setRange}
                options={[
                  { value: 'week', label: 'Weekly' },
                  { value: 'month', label: 'Monthly' },
                ]}
              />
            </View>

            <View className="flex-row flex-wrap gap-2">
              {NUTRIENT_BARS.map((b) => {
                const active = b.key === chartNutrient;
                return (
                  <Pressable
                    key={b.key}
                    onPress={() => setChartNutrient(b.key)}
                    className={`rounded-full border px-3.5 py-1.5 ${
                      active ? 'border-accent bg-peach-soft' : 'border-border bg-surface'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${active ? 'text-accent' : 'text-foreground'}`}
                    >
                      {b.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {series.activeDays === 0 ? (
              <View className="items-center gap-1 py-10">
                <Text className="text-muted text-sm">No meals logged in this period.</Text>
                <Text className="text-muted text-xs">
                  Log meals to see {range === 'week' ? 'the last 7 days' : 'the last 30 days'}.
                </Text>
              </View>
            ) : (
              <>
                <NutritionChart
                  series={series}
                  range={range}
                  unit={chartMeta.unit}
                  barColor={NUTRIENT_HEX[chartNutrient]}
                  width={chartWidth}
                />
                <View className="bg-default/60 flex-row items-center justify-between rounded-xl px-3 py-2.5">
                  <Text className="text-muted text-xs">
                    Avg / logged day ({series.activeDays} {series.activeDays === 1 ? 'day' : 'days'}
                    )
                  </Text>
                  <Text className="text-foreground text-sm font-semibold">
                    {Math.round(series.averageActive)} / {Math.round(series.target)}{' '}
                    {chartMeta.unit}
                  </Text>
                </View>
              </>
            )}
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
                      {MEAL_LABELS[m.type]}
                      {m.portion ? ` · ${m.portion}` : ''} · {Math.round(m.calories)} kcal ·{' '}
                      {m.protein}g protein · {m.iron}mg iron · {m.calcium}mg calcium
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

        <AdBanner />
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

      <AddMealSheet isOpen={sheetOpen} onOpenChange={setSheetOpen} childId={profile.id} />
    </View>
  );
}
