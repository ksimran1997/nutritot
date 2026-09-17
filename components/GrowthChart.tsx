import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { Text, useThemeColor } from 'heroui-native';

import { getPercentileBands, type GrowthMetric } from '@/lib/growth';
import type { GrowthEntry, Sex } from '@/lib/types';

interface GrowthChartProps {
  metric: GrowthMetric;
  sex: Sex;
  entries: GrowthEntry[];
  width: number;
}

const HEIGHT = 220;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 28;
const MAX_MONTH = 24;

function valueForMetric(entry: GrowthEntry, metric: GrowthMetric): number | undefined {
  if (metric === 'weight') return entry.weightKg;
  if (metric === 'height') return entry.heightCm;
  return entry.headCm;
}

export function GrowthChart({ metric, sex, entries, width }: GrowthChartProps) {
  const [accent, muted, border] = useThemeColor(['accent', 'muted', 'border']);

  const bands = getPercentileBands(metric, sex);

  const { yMin, yMax } = useMemo(() => {
    const vals = bands.flatMap((b) => [b.p3, b.p97]);
    const userVals = entries
      .map((entry) => valueForMetric(entry, metric))
      .filter((value): value is number => value !== undefined && value > 0);
    const all = [...vals, ...userVals];
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const padding = (hi - lo) * 0.08 || 1;
    return { yMin: lo - padding, yMax: hi + padding };
  }, [bands, entries, metric]);

  const plotW = width - PAD_L - PAD_R;
  const plotH = HEIGHT - PAD_T - PAD_B;

  const xFor = (month: number) => PAD_L + (Math.min(month, MAX_MONTH) / MAX_MONTH) * plotW;
  const yFor = (v: number) => PAD_T + (1 - (v - yMin) / (yMax - yMin)) * plotH;

  const pathFor = (key: 'p3' | 'p50' | 'p97') => {
    return bands
      .map((b, i) => `${i === 0 ? 'M' : 'L'}${xFor(b.month).toFixed(1)},${yFor(b[key]).toFixed(1)}`)
      .join(' ');
  };

  const plottedEntries = entries.flatMap((entry) => {
    const value = valueForMetric(entry, metric);
    return entry.ageMonths <= MAX_MONTH && value !== undefined && value > 0
      ? [{ entry, value }]
      : [];
  });

  const userPath = plottedEntries
    .map(
      ({ entry, value }, index) =>
        `${index === 0 ? 'M' : 'L'}${xFor(entry.ageMonths).toFixed(1)},${yFor(value).toFixed(1)}`,
    )
    .join(' ');

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = (yMax - yMin) / 4;
    for (let i = 0; i <= 4; i++) ticks.push(yMin + step * i);
    return ticks;
  }, [yMin, yMax]);

  const xTicks = [0, 6, 12, 18, 24];
  const unit = metric === 'weight' ? 'kg' : 'cm';

  return (
    <View>
      <Svg width={width} height={HEIGHT}>
        {yTicks.map((t) => (
          <Line
            key={`y${t.toFixed(2)}`}
            x1={PAD_L}
            y1={yFor(t)}
            x2={width - PAD_R}
            y2={yFor(t)}
            stroke={border}
            strokeWidth={1}
          />
        ))}
        {yTicks.map((t) => (
          <SvgText key={`yl${t.toFixed(2)}`} x={4} y={yFor(t) + 3} fontSize={9} fill={muted}>
            {t.toFixed(0)}
          </SvgText>
        ))}
        {xTicks.map((m) => (
          <SvgText
            key={`xl${m}`}
            x={xFor(m)}
            y={HEIGHT - 8}
            fontSize={9}
            fill={muted}
            textAnchor="middle"
          >
            {m}m
          </SvgText>
        ))}

        {/* percentile bands */}
        <Path
          d={pathFor('p97')}
          stroke={muted}
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="none"
          opacity={0.55}
        />
        <Path d={pathFor('p50')} stroke={muted} strokeWidth={1.5} fill="none" opacity={0.8} />
        <Path
          d={pathFor('p3')}
          stroke={muted}
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="none"
          opacity={0.55}
        />

        {/* user line */}
        {userPath ? <Path d={userPath} stroke={accent} strokeWidth={2.5} fill="none" /> : null}
        {plottedEntries.map(({ entry, value }) => (
          <Circle
            key={entry.id}
            cx={xFor(entry.ageMonths)}
            cy={yFor(value)}
            r={3.5}
            fill={accent}
          />
        ))}
      </Svg>
      <View className="flex-row flex-wrap gap-4 px-2">
        <Legend color={accent} label={`${profileMetricLabel(metric)} (${unit})`} />
        <Legend dashed label="WHO 3rd–97th pct" muted />
      </View>
    </View>
  );
}

function profileMetricLabel(metric: GrowthMetric) {
  if (metric === 'weight') return 'Weight';
  if (metric === 'height') return 'Height';
  return 'Head circumference';
}

function Legend({
  color,
  label,
  dashed,
  muted,
}: {
  color?: string;
  label: string;
  dashed?: boolean;
  muted?: boolean;
}) {
  const [mutedColor] = useThemeColor(['muted']);
  return (
    <View className="flex-row items-center gap-1.5">
      <View
        style={{
          width: 16,
          height: 0,
          borderTopWidth: 2,
          borderColor: muted ? mutedColor : color,
          borderStyle: dashed ? 'dashed' : 'solid',
        }}
      />
      <Text className="text-muted text-[11px]">{label}</Text>
    </View>
  );
}
