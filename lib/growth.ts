import type { Sex } from '@/lib/types';

export interface PercentilePoint {
  month: number;
  p3: number;
  p50: number;
  p97: number;
}

export type GrowthMetric = 'weight' | 'height';

/**
 * WHO Child Growth Standards (0–24 months), abbreviated to selected monthly
 * points with the 3rd, 50th and 97th percentile bands. Values are educational
 * reference estimates, not a substitute for a clinician's growth chart.
 */
const WEIGHT_BOY: PercentilePoint[] = [
  { month: 0, p3: 2.5, p50: 3.3, p97: 4.4 },
  { month: 2, p3: 4.3, p50: 5.6, p97: 7.1 },
  { month: 4, p3: 5.6, p50: 7.0, p97: 8.7 },
  { month: 6, p3: 6.4, p50: 7.9, p97: 9.8 },
  { month: 9, p3: 7.1, p50: 8.9, p97: 11.0 },
  { month: 12, p3: 7.7, p50: 9.6, p97: 12.0 },
  { month: 15, p3: 8.3, p50: 10.3, p97: 12.8 },
  { month: 18, p3: 8.8, p50: 10.9, p97: 13.7 },
  { month: 21, p3: 9.2, p50: 11.5, p97: 14.5 },
  { month: 24, p3: 9.7, p50: 12.2, p97: 15.3 },
];

const WEIGHT_GIRL: PercentilePoint[] = [
  { month: 0, p3: 2.4, p50: 3.2, p97: 4.2 },
  { month: 2, p3: 3.9, p50: 5.1, p97: 6.6 },
  { month: 4, p3: 5.0, p50: 6.4, p97: 8.2 },
  { month: 6, p3: 5.7, p50: 7.3, p97: 9.3 },
  { month: 9, p3: 6.5, p50: 8.2, p97: 10.5 },
  { month: 12, p3: 7.0, p50: 8.9, p97: 11.5 },
  { month: 15, p3: 7.6, p50: 9.6, p97: 12.4 },
  { month: 18, p3: 8.1, p50: 10.2, p97: 13.2 },
  { month: 21, p3: 8.6, p50: 10.9, p97: 14.0 },
  { month: 24, p3: 9.0, p50: 11.5, p97: 14.8 },
];

const HEIGHT_BOY: PercentilePoint[] = [
  { month: 0, p3: 46.1, p50: 49.9, p97: 53.7 },
  { month: 2, p3: 54.4, p50: 58.4, p97: 62.4 },
  { month: 4, p3: 59.7, p50: 63.9, p97: 68.0 },
  { month: 6, p3: 63.3, p50: 67.6, p97: 71.9 },
  { month: 9, p3: 67.5, p50: 72.0, p97: 76.5 },
  { month: 12, p3: 71.0, p50: 75.7, p97: 80.5 },
  { month: 15, p3: 74.1, p50: 79.1, p97: 84.2 },
  { month: 18, p3: 76.9, p50: 82.3, p97: 87.7 },
  { month: 21, p3: 79.4, p50: 85.1, p97: 90.9 },
  { month: 24, p3: 81.7, p50: 87.8, p97: 93.9 },
];

const HEIGHT_GIRL: PercentilePoint[] = [
  { month: 0, p3: 45.4, p50: 49.1, p97: 52.9 },
  { month: 2, p3: 53.0, p50: 57.1, p97: 61.1 },
  { month: 4, p3: 57.8, p50: 62.1, p97: 66.4 },
  { month: 6, p3: 61.2, p50: 65.7, p97: 70.3 },
  { month: 9, p3: 65.3, p50: 70.1, p97: 75.0 },
  { month: 12, p3: 68.9, p50: 74.0, p97: 79.2 },
  { month: 15, p3: 72.0, p50: 77.5, p97: 83.0 },
  { month: 18, p3: 74.9, p50: 80.7, p97: 86.5 },
  { month: 21, p3: 77.5, p50: 83.7, p97: 89.8 },
  { month: 24, p3: 80.0, p50: 86.4, p97: 92.9 },
];

export function getPercentileBands(metric: GrowthMetric, sex: Sex): PercentilePoint[] {
  if (metric === 'weight') return sex === 'boy' ? WEIGHT_BOY : WEIGHT_GIRL;
  return sex === 'boy' ? HEIGHT_BOY : HEIGHT_GIRL;
}

function interp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Linear interpolation of a percentile band value at an arbitrary month. */
export function valueAtMonth(
  bands: PercentilePoint[],
  month: number,
  key: 'p3' | 'p50' | 'p97',
): number {
  if (month <= bands[0].month) return bands[0][key];
  const last = bands[bands.length - 1];
  if (month >= last.month) return last[key];
  for (let i = 0; i < bands.length - 1; i++) {
    const lo = bands[i];
    const hi = bands[i + 1];
    if (month >= lo.month && month <= hi.month) {
      const t = (month - lo.month) / (hi.month - lo.month);
      return interp(lo[key], hi[key], t);
    }
  }
  return last[key];
}

/**
 * Rough percentile estimate for a measured value at a given age. Returns a
 * label band for parent-friendly interpretation.
 */
export function estimatePercentileBand(
  metric: GrowthMetric,
  sex: Sex,
  month: number,
  value: number,
): string {
  const bands = getPercentileBands(metric, sex);
  const p3 = valueAtMonth(bands, month, 'p3');
  const p50 = valueAtMonth(bands, month, 'p50');
  const p97 = valueAtMonth(bands, month, 'p97');
  if (value < p3) return 'Below typical range';
  if (value < p50) return 'Lower healthy range';
  if (value <= p97) return 'Upper healthy range';
  return 'Above typical range';
}

/**
 * Approximate numeric percentile (1–99) for a measured value at a given age,
 * interpolating between the WHO 3rd/50th/97th reference points. Educational
 * estimate only — not a clinical assessment.
 */
export function estimatePercentile(
  metric: GrowthMetric,
  sex: Sex,
  month: number,
  value: number,
): number {
  const bands = getPercentileBands(metric, sex);
  const p3 = valueAtMonth(bands, month, 'p3');
  const p50 = valueAtMonth(bands, month, 'p50');
  const p97 = valueAtMonth(bands, month, 'p97');

  let pct: number;
  if (value <= p3) {
    // Extrapolate below the 3rd percentile, clamped to 1.
    const span = p50 - p3 || 1;
    pct = 3 + ((value - p3) / span) * (50 - 3);
  } else if (value <= p50) {
    const t = (value - p3) / (p50 - p3 || 1);
    pct = interp(3, 50, t);
  } else if (value <= p97) {
    const t = (value - p50) / (p97 - p50 || 1);
    pct = interp(50, 97, t);
  } else {
    const span = p97 - p50 || 1;
    pct = 97 + ((value - p97) / span) * (99 - 97);
  }

  return Math.max(1, Math.min(99, Math.round(pct)));
}

/** Human-friendly ordinal suffix, e.g. 1 -> "1st", 23 -> "23rd". */
export function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
