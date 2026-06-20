import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { Text, useThemeColor } from 'heroui-native';
import { format } from 'date-fns';

import type { NutritionSeries, NutritionRange } from '@/lib/nutrition';

interface NutritionChartProps {
  series: NutritionSeries;
  range: NutritionRange;
  unit: string;
  /** tailwind-resolved bar fill color */
  barColor: string;
  width: number;
}

const HEIGHT = 220;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 28;

export function NutritionChart({ series, range, unit, barColor, width }: NutritionChartProps) {
  const [muted, border, success] = useThemeColor(['muted', 'border', 'success']);

  const { points, target } = series;

  const yMax = useMemo(() => {
    const maxVal = Math.max(target, ...points.map((p) => p.value));
    return maxVal * 1.15 || 1;
  }, [points, target]);

  const plotW = width - PAD_L - PAD_R;
  const plotH = HEIGHT - PAD_T - PAD_B;

  const n = points.length;
  const slot = plotW / n;
  const barW = Math.max(2, slot * (range === 'week' ? 0.55 : 0.7));

  const yFor = (v: number) => PAD_T + (1 - v / yMax) * plotH;
  const xFor = (i: number) => PAD_L + slot * i + (slot - barW) / 2;

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = yMax / 4;
    for (let i = 0; i <= 4; i++) ticks.push(step * i);
    return ticks;
  }, [yMax]);

  // For month view, label every ~5th day; for week, label each day.
  const labelEvery = range === 'week' ? 1 : 5;

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

        {/* bars */}
        {points.map((p, i) => {
          const h = Math.max(0, plotH - (yFor(p.value) - PAD_T));
          return (
            <Rect
              key={p.date}
              x={xFor(i)}
              y={yFor(p.value)}
              width={barW}
              height={h}
              rx={2}
              fill={barColor}
              opacity={p.value > 0 ? 0.9 : 0}
            />
          );
        })}

        {/* target reference line */}
        {target > 0 ? (
          <Line
            x1={PAD_L}
            y1={yFor(target)}
            x2={width - PAD_R}
            y2={yFor(target)}
            stroke={success}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        ) : null}

        {/* x labels */}
        {points.map((p, i) =>
          i % labelEvery === 0 || i === n - 1 ? (
            <SvgText
              key={`xl${p.date}`}
              x={xFor(i) + barW / 2}
              y={HEIGHT - 8}
              fontSize={9}
              fill={muted}
              textAnchor="middle"
            >
              {format(new Date(p.date), range === 'week' ? 'EEEEE' : 'd')}
            </SvgText>
          ) : null,
        )}
      </Svg>
      <View className="flex-row flex-wrap gap-4 px-2">
        <Legend color={barColor} label={`Daily intake (${unit})`} />
        <Legend dashed success label={`Daily target (${Math.round(target)} ${unit})`} />
      </View>
    </View>
  );
}

function Legend({
  color,
  label,
  dashed,
  success,
}: {
  color?: string;
  label: string;
  dashed?: boolean;
  success?: boolean;
}) {
  const [successColor] = useThemeColor(['success']);
  return (
    <View className="flex-row items-center gap-1.5">
      <View
        style={{
          width: 16,
          height: 0,
          borderTopWidth: 2,
          borderColor: success ? successColor : color,
          borderStyle: dashed ? 'dashed' : 'solid',
        }}
      />
      <Text className="text-muted text-[11px]">{label}</Text>
    </View>
  );
}
