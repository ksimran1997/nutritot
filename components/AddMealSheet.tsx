import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheet, Button, Input, Label, Spinner, Text, TextField } from 'heroui-native';

import { useBabyStore } from '@/lib/store';
import { analyzeMeal, hasAIAnalysis, type NutrientEstimate } from '@/lib/nutritionAnalysis';
import type { MealType } from '@/lib/types';
import { cn, todayKey, uid } from '@/lib/utils';

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

interface AddMealSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMealSheet({ isOpen, onOpenChange }: AddMealSheetProps) {
  const addMeal = useBabyStore((s) => s.addMeal);

  const [name, setName] = useState('');
  const [portion, setPortion] = useState('');
  const [type, setType] = useState<MealType>('breakfast');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [iron, setIron] = useState('');
  const [calcium, setCalcium] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const canAnalyze = name.trim().length > 0 && !analyzing;
  const canSave = name.trim().length > 0;

  function reset() {
    setName('');
    setPortion('');
    setType('breakfast');
    setCalories('');
    setProtein('');
    setIron('');
    setCalcium('');
    setAnalyzing(false);
    setAnalyzed(false);
    setNote(null);
  }

  function applyEstimate(est: NutrientEstimate) {
    setCalories(String(est.calories));
    setProtein(String(est.protein));
    setIron(String(est.iron));
    setCalcium(String(est.calcium));
    setNote(est.note ?? (est.source === 'ai' ? 'AI estimate — adjust if needed.' : null));
    setAnalyzed(true);
  }

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setNote(null);
    try {
      const est = await analyzeMeal(name, portion);
      applyEstimate(est);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleSave() {
    if (!canSave) return;
    addMeal({
      id: uid(),
      date: todayKey(),
      type,
      name: name.trim(),
      portion: portion.trim() || undefined,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      iron: Number(iron) || 0,
      calcium: Number(calcium) || 0,
    });
    reset();
    onOpenChange(false);
  }

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={['90%']}
          enableDynamicSizing={false}
          contentContainerClassName="h-full"
        >
          <BottomSheetScrollView keyboardShouldPersistTaps="handled">
            <View className="gap-5 px-1 pb-4">
              <BottomSheet.Title>Log a meal</BottomSheet.Title>

              <TextField isRequired>
                <Label>Food</Label>
                <Input placeholder="What did baby eat?" value={name} onChangeText={setName} />
              </TextField>

              <TextField>
                <Label>Portion</Label>
                <Input
                  placeholder="e.g. 1 bowl, 100g, 2 tbsp"
                  value={portion}
                  onChangeText={setPortion}
                />
              </TextField>

              <View className="gap-2">
                <Label>Meal</Label>
                <View className="flex-row gap-2">
                  {MEAL_TYPES.map((m) => (
                    <Pressable
                      key={m.value}
                      onPress={() => setType(m.value)}
                      className={cn(
                        'border-border flex-1 items-center rounded-xl border py-2.5',
                        type === m.value ? 'bg-peach-soft' : 'bg-surface',
                      )}
                    >
                      <Text
                        className={cn(
                          'text-xs font-medium',
                          type === m.value ? 'text-foreground' : 'text-muted',
                        )}
                      >
                        {m.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Button
                variant="secondary"
                isDisabled={!canAnalyze}
                onPress={handleAnalyze}
                size="lg"
              >
                {analyzing ? <Spinner size="sm" /> : null}
                <Button.Label>
                  {analyzing
                    ? 'Analyzing…'
                    : analyzed
                      ? 'Re-analyze nutrients'
                      : hasAIAnalysis
                        ? 'Analyze nutrients with AI'
                        : 'Estimate nutrients'}
                </Button.Label>
              </Button>

              {analyzed ? (
                <View className="gap-3">
                  <Text className="text-muted px-1 text-xs">
                    Estimated nutrients — tap any field to adjust before saving.
                  </Text>
                  <View className="flex-row gap-3">
                    <TextField className="flex-1">
                      <Label>Calories (kcal)</Label>
                      <Input
                        value={calories}
                        onChangeText={setCalories}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </TextField>
                    <TextField className="flex-1">
                      <Label>Protein (g)</Label>
                      <Input
                        value={protein}
                        onChangeText={setProtein}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </TextField>
                  </View>

                  <View className="flex-row gap-3">
                    <TextField className="flex-1">
                      <Label>Iron (mg)</Label>
                      <Input
                        value={iron}
                        onChangeText={setIron}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </TextField>
                    <TextField className="flex-1">
                      <Label>Calcium (mg)</Label>
                      <Input
                        value={calcium}
                        onChangeText={setCalcium}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </TextField>
                  </View>

                  {note ? (
                    <Text className="text-muted px-1 text-[11px] leading-4">{note}</Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </BottomSheetScrollView>

          <View className="border-border bg-surface border-t px-1 pb-safe-offset-3 pt-3">
            <Button isDisabled={!canSave} onPress={handleSave} size="lg">
              <Button.Label>Add meal</Button.Label>
            </Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
