'use client';
import { useState } from 'react';
import { z } from 'zod';
import { ConcaveBevelButton } from './ConcaveBevelButton';
import { db } from '@lib/db/dexie';
import { WOModel, WNSCModel } from '@lib/validators';

export function RecordForm({ mode }: { mode: 'WO' | 'WNSC' }) {
  const [form, setForm] = useState<any>({});
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'WO') { const parsed = WOModel.parse(form); await db.addWo(parsed); }
      else { const parsed = WNSCModel.parse(form); await db.addWnsc(parsed); }
      setForm({}); alert('Saved locally (offline-ready).');
    } catch (err: any) { alert(err?.message || 'Validation error'); }
  };
  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target?.value ?? e }));
  return (
    <form className="concave" style={{ padding: 12 }} onSubmit={onSubmit}>
      <h3 style={{ marginTop: 0 }}>{mode === 'WO' ? 'New WO' : 'New WNSC'}</h3>
      {mode === 'WO' ? (
        <div className="grid" style={{ gap: 10 }}>
          <div className="field"><label>WO Number*</label><input value={form.refNumber || ''} onChange={set('refNumber')} placeholder="e.g., WO-2025-001" /></div>
          <div className="field"><label>Date*</label><input type="date" value={form.date || ''} onChange={set('date')} /></div>
          <div className="field"><label>Status*</label>
            <select value={form.status || 'Open'} onChange={set('status')}>
              <option>Open</option><option>WaitForApproval</option><option>Approved</option><option>Completed</option>
            </select>
          </div>
          <div className="field"><label>Description</label><textarea value={form.description || ''} onChange={set('description')} rows={3} /></div>
          <div className="row"><ConcaveBevelButton type="submit" label="Save WO" /></div>
        </div>
      ) : (
        <div className="grid" style={{ gap: 10 }}>
          <div className="field"><label>WNSC Number*</label><input value={form.refNumber || ''} onChange={set('refNumber')} placeholder="e.g., WNSC-2025-001" /></div>
          <div className="field"><label>Start Date*</label><input type="date" value={form.startDate || ''} onChange={set('startDate')} /></div>
          <div className="field"><label>End Date</label><input type="date" value={form.endDate || ''} onChange={set('endDate')} /></div>
          <div className="field"><label>Notes</label><textarea value={form.notes || ''} onChange={set('notes')} rows={3} /></div>
          <div className="row"><ConcaveBevelButton type="submit" label="Save WNSC" /></div>
        </div>
      )}
    </form>
  );
}
