'use client';
export function KpiCard({ title, value, extra }: { title: string; value: number | string; extra?: string }) {
  return (
    <div className="concave" style={{ padding: 16 }}>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
      {extra && <div className="badge" style={{ color: 'var(--muted)' }}>{extra}</div>}
    </div>
  );
}
