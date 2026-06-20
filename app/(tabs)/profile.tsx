import { Alert, Platform, ScrollView, View } from 'react-native';
import {
  Baby,
  CalendarDays,
  Pencil,
  Plus,
  Salad,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Chip, Separator, Text, useThemeColor } from 'heroui-native';
import { format } from 'date-fns';

import { useActiveChild, useBabyStore } from '@/lib/store';
import { formatAge, getAgeStage, getAgeMonths } from '@/lib/nutrition';
import { cn, DIET_LABELS } from '@/lib/utils';

export default function ProfileScreen() {
  const profile = useActiveChild();
  const children = useBabyStore((s) => s.children);
  const allMeals = useBabyStore((s) => s.meals);
  const allGrowth = useBabyStore((s) => s.growth);
  const activeChildId = useBabyStore((s) => s.activeChildId);
  const setActiveChild = useBabyStore((s) => s.setActiveChild);
  const removeChild = useBabyStore((s) => s.removeChild);
  const reset = useBabyStore((s) => s.reset);
  const router = useRouter();
  const [accent, danger] = useThemeColor(['accent', 'danger']);

  if (!profile) return null;

  const meals = allMeals.filter((m) => m.childId === profile.id);
  const growth = allGrowth.filter((g) => g.childId === profile.id);
  const stage = getAgeStage(getAgeMonths(profile.birthDate));

  const rows = [
    {
      icon: CalendarDays,
      label: 'Date of birth',
      value: format(new Date(profile.birthDate), 'd MMM yyyy'),
    },
    { icon: Baby, label: 'Age', value: formatAge(profile.birthDate) },
    { icon: Salad, label: 'Family diet', value: DIET_LABELS[profile.diet] },
    { icon: UtensilsCrossed, label: 'Feeding stage', value: stage.label },
  ];

  function confirmRemoveChild(id: string, name: string) {
    const doRemove = () => removeChild(id);
    if (Platform.OS === 'web') {
      doRemove();
      return;
    }
    Alert.alert(
      `Remove ${name}?`,
      'This deletes their profile, meals and measurements. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: doRemove },
      ],
    );
  }

  function confirmReset() {
    const doReset = () => {
      reset();
      router.replace('/onboarding');
    };
    if (Platform.OS === 'web') {
      doReset();
      return;
    }
    Alert.alert('Reset all data?', 'This removes every child and all logged data.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: doReset },
    ]);
  }

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-16 gap-4">
        <View className="items-center gap-3 py-2">
          <View className="bg-peach-soft h-20 w-20 items-center justify-center rounded-3xl">
            <Baby color={accent} size={40} />
          </View>
          <View className="items-center gap-0.5">
            <Text.Heading type="h2">{profile.name}</Text.Heading>
            <Text.Paragraph color="muted">
              {profile.sex === 'boy' ? 'Boy' : 'Girl'} · {formatAge(profile.birthDate)}
            </Text.Paragraph>
          </View>
        </View>

        <View className="gap-2">
          <View className="flex-row items-center justify-between px-1">
            <Text className="text-foreground text-base font-semibold">
              {children.length > 1 ? 'Children' : 'Child'}
            </Text>
            <Chip variant="soft" size="sm">
              <Chip.Label>{children.length}</Chip.Label>
            </Chip>
          </View>

          {children.map((c) => {
            const active = c.id === activeChildId;
            return (
              <Card key={c.id} className={cn(active && 'border-accent border')}>
                <Card.Body className="flex-row items-center gap-3 py-3">
                  <View className="bg-peach-soft h-11 w-11 items-center justify-center rounded-2xl">
                    <Baby color={accent} size={22} />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-foreground font-medium">{c.name}</Text>
                      {active ? (
                        <View className="bg-accent/15 rounded-full px-2 py-0.5">
                          <Text className="text-accent text-[10px] font-semibold">Active</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text className="text-muted text-xs">
                      {c.sex === 'boy' ? 'Boy' : 'Girl'} · {formatAge(c.birthDate)}
                    </Text>
                  </View>
                  {!active ? (
                    <Button variant="secondary" size="sm" onPress={() => setActiveChild(c.id)}>
                      <Button.Label>Switch</Button.Label>
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    isIconOnly
                    onPress={() =>
                      router.push({ pathname: '/onboarding', params: { childId: c.id } })
                    }
                  >
                    <Pencil color={accent} size={16} />
                  </Button>
                  {children.length > 1 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      isIconOnly
                      onPress={() => confirmRemoveChild(c.id, c.name)}
                    >
                      <Trash2 color={danger} size={16} />
                    </Button>
                  ) : null}
                </Card.Body>
              </Card>
            );
          })}

          <Button variant="secondary" onPress={() => router.push('/onboarding')}>
            <Plus color={accent} size={18} />
            <Button.Label>Add another child</Button.Label>
          </Button>
        </View>

        <Text className="text-foreground px-1 text-base font-semibold">
          {profile.name}&apos;s details
        </Text>
        <Card>
          <Card.Body className="gap-0">
            {rows.map((r, i) => (
              <View key={r.label}>
                <View className="flex-row items-center justify-between py-3">
                  <View className="flex-row items-center gap-2.5">
                    <r.icon color={accent} size={18} />
                    <Text className="text-foreground">{r.label}</Text>
                  </View>
                  <Text className="text-muted">{r.value}</Text>
                </View>
                {i < rows.length - 1 ? <Separator /> : null}
              </View>
            ))}
          </Card.Body>
        </Card>

        <View className="flex-row gap-3">
          <Card className="flex-1">
            <Card.Body className="items-center gap-0.5 py-4">
              <Text className="text-foreground text-2xl font-bold">{meals.length}</Text>
              <Text className="text-muted text-xs">Meals logged</Text>
            </Card.Body>
          </Card>
          <Card className="flex-1">
            <Card.Body className="items-center gap-0.5 py-4">
              <Text className="text-foreground text-2xl font-bold">{growth.length}</Text>
              <Text className="text-muted text-xs">Measurements</Text>
            </Card.Body>
          </Card>
        </View>

        <Button variant="danger-soft" onPress={confirmReset}>
          Reset all data
        </Button>

        <Text className="text-muted px-1 text-center text-[11px] leading-4">
          This app provides educational nutrition and growth guidance only. It is not medical
          advice. Always consult your pediatrician.
        </Text>
      </ScrollView>
    </View>
  );
}
