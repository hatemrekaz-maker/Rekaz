import { utcToZonedTime } from 'date-fns-tz';
import { differenceInCalendarDays, addDays, format } from 'date-fns';
import type { RecordType } from './validators';

const MUSCAT_TZ = 'Asia/Muscat';

export function muscatNowRange(maxDays: number) {
  const end = new Date();
  const start = addDays(end, -maxDays);
  return { start: utcToZonedTime(start, MUSCAT_TZ), end: utcToZonedTime(end, MUSCAT_TZ) };
}

export function bucketResolution(startISO: string, endISO: string): 'day' | 'week' | 'month' {
  const span = differenceInCalendarDays(new Date(endISO), new Date(startISO));
  if (span <= 31) return 'day';
  if (span <= 120) return 'week';
  return 'month';
}

export function aggregateCompletedOverTime(records: RecordType[], startISO: string, endISO: string) {
  const res = bucketResolution(startISO, endISO);
  const out: { [k: string]: number } = {};
  const fmt = (d: Date) => {
    if (res === 'day') return format(d, 'yyyy-MM-dd');
    if (res === 'week') return format(d, 'YYYY-ww');
    return format(d, 'yyyy-MM');
  };
  for (const r of records) {
    if (r.refType === 'WO' && (r as any).status === 'Completed') {
      const d = utcToZonedTime(new Date((r as any).date), MUSCAT_TZ); out[fmt(d)] = (out[fmt(d)] || 0) + 1;
    }
    if (r.refType === 'WNSC' && (r as any).endDate) {
      const d = utcToZonedTime(new Date((r as any).endDate), MUSCAT_TZ); out[fmt(d)] = (out[fmt(d)] || 0) + 1;
    }
  }
  return Object.entries(out).sort(([a], [b]) => a.localeCompare(b)).map(([x, y]) => ({ x, y }));
}

export function woStatusBreakdown(records: RecordType[]) {
  const statuses = ['Open', 'WaitForApproval', 'Approved', 'Completed'] as const;
  const map: Record<string, number> = Object.fromEntries(statuses.map(s => [s, 0]));
  for (const r of records) if (r.refType === 'WO') map[(r as any).status] = (map[(r as any).status] || 0) + 1;
  return statuses.map(s => ({ status: s, count: map[s] || 0 }));
}

export function makeHistogram(values: number[]) {
  if (values.length === 0) return [];
  const max = Math.max(...values);
  const binSize = Math.max(1, Math.ceil(max / 8));
  const bins: { [key: string]: number } = {};
  for (const v of values) {
    const binStart = Math.floor(v / binSize) * binSize;
    const label = `${binStart}-${binStart + binSize - 1}`;
    bins[label] = (bins[label] || 0) + 1;
  }
  return Object.entries(bins).map(([bin, count]) => ({ bin, count }));
}
