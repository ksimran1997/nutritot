import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheet, Button, Input, Label, Text, TextField } from 'heroui-native';

import { useBabyStore } from '@/lib/store';
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
  const [type, setType] = useState<MealType>('breakfast');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [iron, setIron] = useState('');
  const [calcium, setCalcium] = useState('');

  const canSave = name.trim().length > 0;

  function reset() {
    setName('');
    setType('breakfast');
    setCalories('');
    setProtein('');
    setIron('');
    setCalcium('');
  }

  function handleSave() {
    if (!canSave) return;
    addMeal({
      id: uid(),
      date: todayKey(),
      type,
      name: name.trim(),
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
          snapPoints={['85%']}
          enableDynamicSizing={false}
          contentContainerClassName="h-full"
        >
          <BottomSheetScrollView keyboardShouldPersistTaps="handled">
            <View className="gap-5 px-1 pb-10">
              <BottomSheet.Title>Log a meal</BottomSheet.Title>

              <TextField isRequired>
                <Label>Food</Label>
                <Input placeholder="What did baby eat?" value={name} onChangeText={setName} />
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

              <Button isDisabled={!canSave} onPress={handleSave} size="lg">
                Add meal
              </Button>
            </View>
          </BottomSheetScrollView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
