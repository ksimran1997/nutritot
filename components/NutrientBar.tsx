import { View } from 'react-native';
import { Text } from 'heroui-native';

import { cn } from '@/lib/utils';

interface NutrientBarProps {
  label: string;
  unit: string;
  current: number;
  target: number;
  colorClass: string;
}

export function NutrientBar({ label, unit, current, target, colorClass }: NutrientBarProps) {
  const pct = target > 0 ? Math.min(1, current / target) : 0;
  const reached = current >= target && target > 0;
  return (
    <View className="gap-1.5">
      <View className="flex-row items-end justify-between">
        <Text className="text-foreground text-sm font-medium">{label}</Text>
        <Text className="text-muted text-xs">
          <Text
            className={cn('text-sm font-semibold', reached ? 'text-success' : 'text-foreground')}
          >
            {Math.round(current)}
          </Text>
          {` / ${Math.round(target)} ${unit}`}
        </Text>
      </View>
      <View className="bg-default h-2.5 overflow-hidden rounded-full">
        <View
          className={cn('h-full rounded-full', colorClass)}
          style={{ width: `${Math.max(2, pct * 100)}%` }}
        />
      </View>
    </View>
  );
}
