'use client';
import { useEffect, useState } from 'react';
import { ConcaveBevelButton } from '@components/ConcaveBevelButton';
import { db } from '@lib/db/dexie';
import { useI18n } from '@lib/i18n';

export default function SettingsPage() {
  const { locale, setLocale, dir, setDir } = useI18n();
  const [mono, setMono] = useState<boolean>(() => localStorage.getItem('useSemanticStatusColors') === 'false');

  useEffect(() => { localStorage.setItem('useSemanticStatusColors', String(!mono)); }, [mono]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <h1>Settings</h1>
      <div className="concave" style={{ padding: 12 }}>
        <div className="row">
          <div className="field">
            <label>Language</label>
            <select value={locale} onChange={(e) => setLocale(e.target.value as 'ar' | 'en')}>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="field">
            <label>Direction</label>
            <select value={dir} onChange={(e) => setDir(e.target.value as 'rtl' | 'ltr')}>
              <option value="rtl">RTL</option>
              <option value="ltr">LTR</option>
            </select>
          </div>
          <div className="field">
            <label>Status Colors Mode</label>
            <select value={mono ? 'monochrome' : 'semantic'} onChange={(e) => setMono(e.target.value === 'monochrome')}>
              <option value="semantic">Semantic</option>
              <option value="monochrome">Monochrome Blues</option>
            </select>
          </div>
        </div>
      </div>

      <div className="concave" style={{ padding: 12 }}>
        <div className="row" style={{ gap: 8 }}>
          <ConcaveBevelButton label="Import Seed" onClick={() => db.importSeed()} />
          <ConcaveBevelButton label="Export JSON" onClick={() => db.exportJson()} />
          <ConcaveBevelButton label="Clear DB" onClick={() => db.clearAll()} />
        </div>
      </div>
    </div>
  );
}
