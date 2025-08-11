'use client';
import clsx from 'classnames';

export function StatusChip({ status }: { status: 'Open' | 'WaitForApproval' | 'Approved' | 'Completed' | 'InProgress' }) {
  const useSemantic = (localStorage.getItem('useSemanticStatusColors') ?? 'true') === 'true';
  const base = 'pill badge';

  if (!useSemantic) {
    return <span className={clsx(base)} style={{ color: '#cfe0ff', borderColor: '#4779ff' }}>🔹 {status}</span>;
  }

  const map: Record<string, { text: string; bg: string; color?: string; solid?: boolean; icon: string }> = {
    Open: { text: 'Open', bg: 'var(--blue-500)', icon: '🟦' },
    WaitForApproval: { text: 'Wait', bg: 'var(--amber)', icon: '⏳' },
    Approved: { text: 'Approved', bg: 'transparent', color: '#20c997', icon: '🟢' },
    Completed: { text: 'Completed', bg: 'var(--success)', icon: '✅', solid: true },
    InProgress: { text: 'In Progress', bg: 'var(--blue-300)', icon: '🔧' }
  };

  const m = map[status];
  const style = m.solid
    ? { background: m.bg, color: '#061019', border: '1px solid rgba(0,0,0,.2)' }
    : { border: '1px solid rgba(255,255,255,.1)', color: m.color ?? '#e9eefc' };

  return <span className={base} style={style}>{m.icon} {m.text}</span>;
}
