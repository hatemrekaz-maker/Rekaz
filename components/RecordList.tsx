'use client';
import { useLiveRecords, db } from '@lib/db/dexie';
import { ConcaveBevelButton } from './ConcaveBevelButton';
import { StatusChip } from './StatusChip';

export function RecordList({ mode }: { mode: 'WO' | 'WNSC' }) {
  const { records } = useLiveRecords();
  const list = records.filter(r => r.refType === mode);
  return (
    <div className="concave" style={{ padding: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{mode === 'WO' ? 'WO Records' : 'WNSC Records'}</h3>
        <ConcaveBevelButton label="Delete All" onClick={() => db.deleteType(mode)} />
      </div>
      <hr />
      <div className="grid" style={{ gap: 8 }}>
        {list.map(r => (
          <div key={r.id} className="concave" style={{ padding: 10 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700 }}>
                {r.refNumber} {r.refType === 'WO' ? `· ${new Date(r.date).toLocaleDateString()}` : `· ${new Date(r.startDate).toLocaleDateString()}`}
              </div>
              <div>
                {r.refType === 'WO' ? <StatusChip status={r.status as any} /> : <StatusChip status={r.endDate ? 'Completed' : 'InProgress'} />}
              </div>
            </div>
            {r.description && <div style={{ opacity: .9 }}>{r.description}</div>}
            {r.notes && <div style={{ opacity: .9 }}>{r.notes}</div>}
            {r.refType === 'WNSC' && r.durationDays != null && <div className="badge">Duration: {r.durationDays} days</div>}
            <div className="row" style={{ marginTop: 8 }}>
              <ConcaveBevelButton label="Delete" onClick={() => db.deleteById(r.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
