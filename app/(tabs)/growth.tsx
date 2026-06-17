import { useMemo, useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { Card, Text, useThemeColor } from 'heroui-native';
import { format } from 'date-fns';

import { AddGrowthSheet } from '@/components/AddGrowthSheet';
import { GrowthChart } from '@/components/GrowthChart';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useBabyStore } from '@/lib/store';
import { estimatePercentileBand, type GrowthMetric } from '@/lib/growth';
import { getAgeMonths } from '@/lib/nutrition';

export default function GrowthScreen() {
  const profile = useBabyStore((s) => s.profile);
  const growth = useBabyStore((s) => s.growth);
  const removeGrowth = useBabyStore((s) => s.removeGrowth);
  const [danger] = useThemeColor(['danger']);
  const { width } = useWindowDimensions();
  const [metric, setMetric] = useState<GrowthMetric>('weight');
  const [sheetOpen, setSheetOpen] = useState(false);

  const latest = useMemo(
    () => (growth.length > 0 ? growth[growth.length - 1] : undefined),
    [growth],
  );

  if (!profile) return null;

  const chartWidth = Math.min(width, 520) - 40 - 32; // screen padding + card padding
  const ageMonths = getAgeMonths(profile.birthDate);

  const latestBand =
    latest &&
    estimatePercentileBand(
      metric,
      profile.sex,
      latest.ageMonths,
      metric === 'weight' ? latest.weightKg : latest.heightCm,
    );

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-32 gap-4">
        <View className="gap-1">
          <Text.Heading type="h2">Growth charts</Text.Heading>
          <Text.Paragraph color="muted">
            Plotted against WHO percentile bands for a {profile.sex === 'boy' ? 'boy' : 'girl'} aged{' '}
            {ageMonths} months.
          </Text.Paragraph>
        </View>

        <SegmentedControl<GrowthMetric>
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'weight', label: 'Weight' },
            { value: 'height', label: 'Height' },
          ]}
        />

        <Card>
          <Card.Body className="gap-3">
            {growth.length === 0 ? (
              <View className="items-center gap-1 py-10">
                <Text className="text-muted text-sm">No measurements yet.</Text>
                <Text className="text-muted text-xs">
                  Add weight and height to see the growth curve.
                </Text>
              </View>
            ) : (
              <GrowthChart metric={metric} sex={profile.sex} entries={growth} width={chartWidth} />
            )}
          </Card.Body>
        </Card>

        {latest && latestBand ? (
          <Card variant="secondary">
            <Card.Body className="gap-1">
              <Text className="text-foreground text-sm font-semibold">
                Latest {metric}:{' '}
                {metric === 'weight' ? `${latest.weightKg} kg` : `${latest.heightCm} cm`}
              </Text>
              <Text className="text-muted text-sm">{latestBand} for age.</Text>
            </Card.Body>
          </Card>
        ) : null}

        <View className="gap-2">
          <Text className="text-foreground px-1 text-base font-semibold">History</Text>
          {growth.length === 0 ? (
            <Text className="text-muted px-1 text-sm">Measurements will appear here.</Text>
          ) : (
            [...growth].toReversed().map((g) => (
              <Card key={g.id}>
                <Card.Body className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 gap-0.5">
                    <Text className="text-foreground font-medium">
                      {g.weightKg > 0 ? `${g.weightKg} kg` : '—'}
                      {g.heightCm > 0 ? ` · ${g.heightCm} cm` : ''}
                      {g.headCm ? ` · head ${g.headCm} cm` : ''}
                    </Text>
                    <Text className="text-muted text-xs">
                      {format(new Date(g.date), 'd MMM yyyy')} · {g.ageMonths} mo
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => removeGrowth(g.id)}
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
      </ScrollView>

      <Pressable
        onPress={() => setSheetOpen(true)}
        className="bg-accent absolute right-5 bottom-6 h-14 w-14 items-center justify-center rounded-full"
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

      <AddGrowthSheet isOpen={sheetOpen} onOpenChange={setSheetOpen} />
    </View>
  );
}
