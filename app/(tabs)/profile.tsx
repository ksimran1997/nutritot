import { ScrollView, View } from 'react-native';
import { Baby, CalendarDays, Salad, UtensilsCrossed } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Separator, Text, useThemeColor } from 'heroui-native';
import { format } from 'date-fns';

import { useBabyStore } from '@/lib/store';
import { formatAge, getAgeStage, getAgeMonths } from '@/lib/nutrition';
import { DIET_LABELS } from '@/lib/utils';

export default function ProfileScreen() {
  const profile = useBabyStore((s) => s.profile);
  const meals = useBabyStore((s) => s.meals);
  const growth = useBabyStore((s) => s.growth);
  const reset = useBabyStore((s) => s.reset);
  const router = useRouter();
  const [accent] = useThemeColor(['accent']);

  if (!profile) return null;

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

        <Button variant="secondary" onPress={() => router.push('/onboarding')}>
          Edit baby details
        </Button>
        <Button variant="danger-soft" onPress={reset}>
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
