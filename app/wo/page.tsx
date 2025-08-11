'use client';
import { RecordForm } from '@components/RecordForm';
import { RecordList } from '@components/RecordList';
export default function WOPage() {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <h1>Oman Oil — Work Orders (WO)</h1>
      <RecordForm mode="WO" />
      <RecordList mode="WO" />
    </div>
  );
}
