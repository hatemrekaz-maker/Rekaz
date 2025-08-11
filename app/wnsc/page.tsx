'use client';
import { RecordForm } from '@components/RecordForm';
import { RecordList } from '@components/RecordList';
export default function WNSCPage() {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <h1>NAMA — WNSC</h1>
      <RecordForm mode="WNSC" />
      <RecordList mode="WNSC" />
    </div>
  );
}
