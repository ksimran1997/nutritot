import { Pressable, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Text, useThemeColor } from 'heroui-native';
import { addDays, addMonths, addYears, format } from 'date-fns';

interface DateStepperProps {
  value: Date;
  onChange: (date: Date) => void;
  /** prevent picking a future date */
  maxToday?: boolean;
}

type Unit = 'year' | 'month' | 'day';

const UNITS: { key: Unit; label: string }[] = [
  { key: 'year', label: 'Year' },
  { key: 'month', label: 'Month' },
  { key: 'day', label: 'Day' },
];

export function DateStepper({ value, onChange, maxToday = true }: DateStepperProps) {
  const [accent] = useThemeColor(['accent']);

  function shift(unit: Unit, delta: number) {
    let next = value;
    if (unit === 'year') next = addYears(value, delta);
    if (unit === 'month') next = addMonths(value, delta);
    if (unit === 'day') next = addDays(value, delta);
    if (maxToday && next.getTime() > Date.now()) return;
    onChange(next);
  }

  return (
    <View className="gap-3">
      <Text className="text-foreground text-center text-lg font-semibold">
        {format(value, 'eeee, d MMMM yyyy')}
      </Text>
      <View className="flex-row gap-2">
        {UNITS.map((u) => (
          <View key={u.key} className="bg-default flex-1 items-center gap-2 rounded-2xl p-3">
            <Text className="text-muted text-xs font-medium">{u.label}</Text>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => shift(u.key, -1)}
                hitSlop={8}
                className="bg-surface h-9 w-9 items-center justify-center rounded-full"
              >
                <Minus color={accent} size={18} />
              </Pressable>
              <Pressable
                onPress={() => shift(u.key, 1)}
                hitSlop={8}
                className="bg-surface h-9 w-9 items-center justify-center rounded-full"
              >
                <Plus color={accent} size={18} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
