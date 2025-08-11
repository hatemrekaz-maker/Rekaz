import type { RecordType } from '@lib/validators';

export function saveCsv(rows: RecordType[]) {
  const header = ['id','company','refType','refNumber','date','status','description','startDate','endDate','durationDays','notes','tags','createdAt','updatedAt'];
  const lines = [
    header.join(','),
    ...rows.map(r => [
      (r as any).id, (r as any).company, (r as any).refType, (r as any).refNumber,
      (r as any).date ?? '',
      (r as any).status ?? '',
      (r as any).description ?? '',
      (r as any).startDate ?? '',
      (r as any).endDate ?? '',
      (r as any).durationDays ?? '',
      (r as any).notes ?? '',
      ((r as any).tags ?? []).join('|'),
      (r as any).createdAt ?? '', (r as any).updatedAt ?? ''
    ].map(csvEscape).join(','))
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  trigger(url, 'export.csv');
}

export function csvEscape(v: any) {
  const s = String(v ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function trigger(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
