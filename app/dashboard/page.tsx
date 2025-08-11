'use client';
import { useEffect, useMemo, useState } from 'react';
import { db, useLiveRecords } from '@lib/db/dexie';
import { aggregateCompletedOverTime, makeHistogram, muscatNowRange, woStatusBreakdown } from '@lib/chart-helpers';
import dynamic from 'next/dynamic';
import { KpiCard } from '@components/KpiCard';
import { ConcaveBevelButton } from '@components/ConcaveBevelButton';
import { HeroOil } from '@components/HeroOil';
import { HeroWater } from '@components/HeroWater';

const ChartCompletedOverTime = dynamic(() => import('@components/ChartCompletedOverTime'), { ssr: false });
const ChartStatusBreakdown = dynamic(() => import('@components/ChartStatusBreakdown'), { ssr: false });
const ChartWnscDurations = dynamic(() => import('@components/ChartWnscDurations'), { ssr: false });

type CompanyFilter = 'ALL' | 'OMAN_OIL' | 'NAMA';
type StatusFilter = 'ALL' | 'Open' | 'WaitForApproval' | 'Approved' | 'Completed' | 'InProgress';

export default function Dashboard() {
  const { records } = useLiveRecords();
  const [company, setCompany] = useState<CompanyFilter>(() => (localStorage.getItem('flt_company') as CompanyFilter) || 'ALL');
  const [status, setStatus] = useState<StatusFilter>(() => (localStorage.getItem('flt_status') as StatusFilter) || 'ALL');
  const [search, setSearch] = useState<string>(() => localStorage.getItem('flt_search') || '');
  const [range, setRange] = useState<{ start: string; end: string }>(() => {
    const { start, end } = muscatNowRange(120);
    return { start: start.toISOString(), end: end.toISOString() };
  });

  useEffect(() => {
    localStorage.setItem('flt_company', company);
    localStorage.setItem('flt_status', status);
    localStorage.setItem('flt_search', search);
  }, [company, status, search]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const start = new Date(range.start).getTime();
    const end = new Date(range.end).getTime();
    return records.filter(r => {
      if (company !== 'ALL' && r.company !== company) return false;
      if (status !== 'ALL') {
        if (r.refType === 'WO') {
          if (status === 'InProgress') return false;
          if (r.status !== status) return false;
        } else {
          const derived = r.endDate ? 'Completed' : 'InProgress';
          if (derived !== status) return false;
        }
      }
      if (r.refType === 'WO') {
        const t = new Date(r.date).getTime();
        if (t < start || t > end) return false;
      } else {
        const t = new Date(r.startDate).getTime();
        if (t < start || t > end) return false;
      }
      if (!s) return true;
      const hay = `${r.refNumber} ${'description' in r ? (r.description || '') : ''} ${r.notes || ''} ${(r.tags || []).join(' ')}`.toLowerCase();
      
      return hay.includes(s);
    });
  }, [company, status, search, range, records]);

  const total = filtered.length;
  const woCompleted = filtered.filter(r => r.refType === 'WO' && r.status === 'Completed').length;
  const wnscCompleted = filtered.filter(r => r.refType === 'WNSC' && r.endDate).length;
  const avgWnscDuration = (() => {
    const durs = filtered.filter(r => r.refType === 'WNSC' && r.durationDays != null).map(r => r.durationDays!);
    return durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : 0;
  })();

  const completedSeries = aggregateCompletedOverTime(filtered, range.start, range.end);
  const woBreakdown = woStatusBreakdown(filtered);
  const wnscHistogram = makeHistogram(filtered.filter(r => r.refType === 'WNSC' && r.durationDays != null).map(r => r.durationDays!));

  return (
    <div id="dashboard" className="grid" style={{ gap: 18 }}>
      <section className="grid" style={{ gap: 12 }}>
        <div className="row" style={{ gap: 10 }}>
          <HeroOil />
          <HeroWater />
        </div>

        <div className="concave" style={{ padding: 12 }}>
          <div className="row" style={{ gap: 12, alignItems: 'end', justifyContent: 'space-between' }}>
            <div className="row" style={{ gap: 12 }}>
              <div className="field">
                <label>Company</label>
                <select value={company} onChange={e => setCompany(e.target.value as CompanyFilter)}>
                  <option value="ALL">All</option>
                  <option value="OMAN_OIL">Oman Oil</option>
                  <option value="NAMA">NAMA</option>
                </select>
              </div>

              <div className="field">
                <label>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as StatusFilter)}>
                  <option value="ALL">All</option>
                  <option value="Open">Open</option>
                  <option value="WaitForApproval">WaitForApproval</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="InProgress">In Progress</option>
                </select>
              </div>

              <div className="field">
                <label>Search</label>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ref, text, tags" />
              </div>
            </div>

            <div className="row" style={{ gap: 8 }}>
              <div className="field">
                <label>From</label>
                <input type="date" value={range.start.slice(0, 10)} onChange={e => setRange(r => ({ ...r, start: new Date(e.target.value).toISOString() }))} />
              </div>
              <div className="field">
                <label>To</label>
                <input type="date" value={range.end.slice(0, 10)} onChange={e => setRange(r => ({ ...r, end: new Date(e.target.value).toISOString() }))} />
              </div>
              <ConcaveBevelButton onClick={() => db.exportToCsv()} label="Export CSV" />
              <ConcaveBevelButton onClick={() => db.exportToPdf()} label="Export PDF" />
              <ConcaveBevelButton onClick={() => db.exportToPng('dashboard')} label="Export PNG" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-3">
        <KpiCard title="Total Records" value={total} />
        <KpiCard title="WO Completed" value={woCompleted} />
        <KpiCard title="WNSC Completed" value={wnscCompleted} extra={`${avgWnscDuration} avg days`} />
      </section>

      <section className="grid grid-3">
        <div className="concave" style={{ padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Completed Over Time</h3>
          <ChartCompletedOverTime data={completedSeries} />
        </div>
        <div className="concave" style={{ padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>WO Status Breakdown</h3>
          <ChartStatusBreakdown data={woBreakdown} />
        </div>
        <div className="concave" style={{ padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>WNSC Duration Distribution</h3>
          <ChartWnscDurations data={wnscHistogram} />
        </div>
      </section>
    </div>
  );
}
