import { useState } from 'react';
import { View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheet, Button, Input, Label, Text, TextField } from 'heroui-native';

import { useActiveChild, useBabyStore } from '@/lib/store';
import { getAgeMonths } from '@/lib/nutrition';
import { cn, todayKey, uid } from '@/lib/utils';

interface AddGrowthSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  childId: string;
}

export function AddGrowthSheet({ isOpen, onOpenChange, childId }: AddGrowthSheetProps) {
  const profile = useActiveChild();
  const addGrowth = useBabyStore((s) => s.addGrowth);

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [head, setHead] = useState('');

  const canSave = Number(weight) > 0 || Number(height) > 0 || Number(head) > 0;

  function reset() {
    setWeight('');
    setHeight('');
    setHead('');
  }

  function handleSave() {
    if (!profile || !canSave) return;
    addGrowth({
      id: uid(),
      childId,
      date: todayKey(),
      ageMonths: getAgeMonths(profile.birthDate),
      weightKg: Number(weight) || 0,
      heightCm: Number(height) || 0,
      headCm: Number(head) || undefined,
    });
    reset();
    onOpenChange(false);
  }

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content snapPoints={['60%']} enableDynamicSizing={false}>
          <BottomSheetScrollView keyboardShouldPersistTaps="handled">
            <View className="gap-5 px-1 pb-10">
              <BottomSheet.Title>Add measurement</BottomSheet.Title>
              <Text className="text-muted text-sm">
                Recorded at {profile ? `${getAgeMonths(profile.birthDate)} months` : 'today'}.
              </Text>

              <View className="flex-row gap-3">
                <TextFieldInput label="Weight (kg)" value={weight} onChange={setWeight} />
                <TextFieldInput label="Height (cm)" value={height} onChange={setHeight} />
              </View>
              <TextFieldInput
                label="Head circumference (cm) · optional"
                value={head}
                onChange={setHead}
              />

              <Button isDisabled={!canSave} onPress={handleSave} size="lg">
                Save measurement
              </Button>
            </View>
          </BottomSheetScrollView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

function TextFieldInput({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <TextField className={cn('flex-1', className)}>
      <Label>{label}</Label>
      <Input value={value} onChangeText={onChange} keyboardType="numeric" placeholder="0" />
    </TextField>
  );
}
