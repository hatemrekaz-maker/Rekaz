import Dexie, { liveQuery } from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import { WOModel, WNSCModel, type RecordType } from '@lib/validators';
import { saveCsv } from '@lib/export/csv';
import { savePdf } from '@lib/export/pdf';
import { savePng } from '@lib/export/png';

export interface PhotoAsset {
  id: string;
  recordId: string;
  kind: 'before' | 'after';
  blob: Blob;
}

class AppDB extends Dexie {
  records!: Dexie.Table<RecordType, string>;
  photoAssets!: Dexie.Table<PhotoAsset, string>;

  constructor() {
    super('wo-wnsc-db');
    this.version(1).stores({
      records: 'id, refNumber, company, refType, status, date, startDate, endDate, createdAt, updatedAt',
      photoAssets: 'id, recordId, kind'
    });
  }

  async importSeed() {
    const existing = await this.records.count();
    if (existing > 0) return existing;
    const now = new Date().toISOString();
    try {
      const res = await fetch('/seed.json', { cache: 'no-store' });
      const seed = await res.json();
      const toPut: RecordType[] = seed.map((r: any) => ({ ...r, id: uuidv4(), createdAt: now, updatedAt: now })) as any[];
      await this.records.bulkPut(toPut);
      // compute durationDays for WNSC where endDate exists
      const toUpdate = toPut.filter(r => r.refType === 'WNSC' && (r as any).endDate);
      for (const r of toUpdate) {
        const start = new Date((r as any).startDate).getTime();
        const end = new Date((r as any).endDate).getTime();
        const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        await this.records.update(r.id!, { durationDays });
      }
      return toPut.length;
    } catch {
      // fallback small seed
      const sample: any[] = [
        { company:'OMAN_OIL', refType:'WO', refNumber:'WO-EX-1', date:'2025-07-01', status:'Completed' },
        { company:'NAMA', refType:'WNSC', refNumber:'WNSC-EX-1', startDate:'2025-07-02', endDate:'2025-07-05' }
      ];
      const toPut: RecordType[] = sample.map((r: any) => ({ ...r, id: uuidv4(), createdAt: now, updatedAt: now })) as any[];
      await this.records.bulkPut(toPut);
      return toPut.length;
    }
  }

  async addWo(_input: any) {
    const now = new Date().toISOString();
    const data = WOModel.parse({ ..._input, refType: 'WO', company: 'OMAN_OIL' });
    const id = uuidv4();
    await this.records.put({ ...data, id, createdAt: now, updatedAt: now } as any);
  }

  async addWnsc(_input: any) {
    const now = new Date().toISOString();
    const data = WNSCModel.parse({ ..._input, refType: 'WNSC', company: 'NAMA' });
    const durationDays = data.endDate ? Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)) : undefined;
    const id = uuidv4();
    await this.records.put({ ...data, id, durationDays, createdAt: now, updatedAt: now } as any);
  }

  async deleteById(id: string) { await this.records.delete(id); }
  async deleteType(refType: 'WO' | 'WNSC') {
    const ids = (await this.records.where({ refType }).primaryKeys()) as string[];
    await this.records.bulkDelete(ids);
  }

  async exportJson() {
    const rows = await this.records.toArray();
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    download(url, 'export.json');
  }

  async exportToCsv() { const rows = await this.records.toArray(); saveCsv(rows); }
  async exportToPdf() { const rows = await this.records.toArray(); savePdf(rows); }
  async exportToPng(elementId: string) { savePng(elementId); }

  async clearAll() {
    await this.transaction('rw', this.records, this.photoAssets, async () => {
      await this.photoAssets.clear();
      await this.records.clear();
    });
  }
}

export const db = new AppDB();

import { useEffect, useState } from 'react';
export function useLiveRecords() {
  const [records, setRecords] = useState<RecordType[]>([]);
  useEffect(() => {
    const sub = liveQuery(() => db.records.toArray()).subscribe({
      next: (rows) => setRecords(rows as RecordType[]),
      error: (err) => console.error(err)
    });
    db.importSeed().catch(() => {});
    return () => sub.unsubscribe();
  }, []);
  return { records };
}

function download(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
