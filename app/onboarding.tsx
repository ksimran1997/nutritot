import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Baby } from 'lucide-react-native';
import { Button, Input, Label, Text, TextField, useThemeColor } from 'heroui-native';

import { DateStepper } from '@/components/DateStepper';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useBabyStore } from '@/lib/store';
import type { DietPreference, Sex } from '@/lib/types';
import { formatAge } from '@/lib/nutrition';

export default function Onboarding() {
  const router = useRouter();
  const { childId } = useLocalSearchParams();
  const children = useBabyStore((s) => s.children);
  const addChild = useBabyStore((s) => s.addChild);
  const updateChild = useBabyStore((s) => s.updateChild);
  const setActiveChild = useBabyStore((s) => s.setActiveChild);
  const [accent] = useThemeColor(['accent']);

  const editing = childId ? children.find((c) => c.id === childId) : undefined;
  const isFirstChild = children.length === 0;

  const [name, setName] = useState(editing?.name ?? '');
  const [birthDate, setBirthDate] = useState<Date>(
    editing ? new Date(editing.birthDate) : new Date(),
  );
  const [sex, setSex] = useState<Sex>(editing?.sex ?? 'girl');
  const [diet, setDiet] = useState<DietPreference>(editing?.diet ?? 'vegetarian');

  const canSave = name.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const data = {
      name: name.trim(),
      birthDate: birthDate.toISOString(),
      sex,
      diet,
    };
    if (editing) {
      updateChild(editing.id, data);
      setActiveChild(editing.id);
    } else {
      addChild(data);
    }
    router.replace('/(tabs)');
  }

  const title = editing
    ? "Edit child's details"
    : isFirstChild
      ? 'Tell us about your baby'
      : 'Add another child';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      className="bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="px-5 pt-safe-offset-6 pb-10 gap-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center gap-3">
          <View className="bg-peach-soft h-16 w-16 items-center justify-center rounded-3xl">
            <Baby color={accent} size={32} />
          </View>
          <Text.Heading type="h2" align="center">
            {title}
          </Text.Heading>
          <Text.Paragraph align="center" color="muted">
            We tailor nutrition targets, growth charts and recipes to each child.
          </Text.Paragraph>
        </View>

        <TextField isRequired>
          <Label>Child&apos;s name</Label>
          <Input
            placeholder="e.g. Maya"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </TextField>

        <View className="gap-2">
          <Label>Date of birth</Label>
          <DateStepper value={birthDate} onChange={setBirthDate} />
          <Text className="text-muted text-center text-sm">
            {formatAge(birthDate.toISOString())}
          </Text>
        </View>

        <View className="gap-2">
          <Label>Sex</Label>
          <SegmentedControl<Sex>
            value={sex}
            onChange={setSex}
            options={[
              { value: 'girl', label: 'Girl' },
              { value: 'boy', label: 'Boy' },
            ]}
          />
          <Text className="text-muted text-xs">Used for accurate WHO growth percentile bands.</Text>
        </View>

        <View className="gap-2">
          <Label>Family diet</Label>
          <SegmentedControl<DietPreference>
            value={diet}
            onChange={setDiet}
            options={[
              { value: 'vegan', label: 'Vegan' },
              { value: 'vegetarian', label: 'Veg' },
              { value: 'non-vegetarian', label: 'Non-veg' },
            ]}
          />
          <Text className="text-muted text-xs">
            Recipe suggestions respect your family&apos;s dietary choice.
          </Text>
        </View>

        <Button isDisabled={!canSave} onPress={handleSave} size="lg">
          {editing ? 'Save changes' : isFirstChild ? 'Start tracking' : 'Add child'}
        </Button>

        {!isFirstChild && !editing ? (
          <Button variant="ghost" onPress={() => router.back()}>
            Cancel
          </Button>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
