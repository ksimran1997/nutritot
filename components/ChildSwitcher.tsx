import { Pressable, ScrollView, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Text, useThemeColor } from 'heroui-native';

import { useBabyStore } from '@/lib/store';
import { cn } from '@/lib/utils';

/**
 * Horizontal selector for switching the active child. Hidden when only one
 * child exists, except it always offers a way to add another.
 */
export function ChildSwitcher() {
  const router = useRouter();
  const children = useBabyStore((s) => s.children);
  const activeChildId = useBabyStore((s) => s.activeChildId);
  const setActiveChild = useBabyStore((s) => s.setActiveChild);
  const [accent] = useThemeColor(['accent']);

  if (children.length <= 1) {
    if (children.length === 0) return null;
    return (
      <View className="flex-row">
        <Pressable
          onPress={() => router.push('/onboarding')}
          className="border-border bg-surface flex-row items-center gap-1.5 rounded-full border px-3.5 py-2"
        >
          <Plus color={accent} size={16} />
          <Text className="text-accent text-sm font-medium">Add child</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pr-1"
    >
      {children.map((c) => {
        const active = c.id === activeChildId;
        return (
          <Pressable
            key={c.id}
            onPress={() => setActiveChild(c.id)}
            className={cn(
              'rounded-full border px-4 py-2',
              active ? 'border-accent bg-peach-soft' : 'border-border bg-surface',
            )}
          >
            <Text className={cn('text-sm font-medium', active ? 'text-accent' : 'text-foreground')}>
              {c.name}
            </Text>
          </Pressable>
        );
      })}
      <Pressable
        onPress={() => router.push('/onboarding')}
        className="border-border bg-surface flex-row items-center gap-1.5 rounded-full border px-3.5 py-2"
      >
        <Plus color={accent} size={16} />
        <Text className="text-accent text-sm font-medium">Add</Text>
      </Pressable>
    </ScrollView>
  );
}
