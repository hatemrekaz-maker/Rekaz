import jsPDF from 'jspdf';
import type { RecordType } from '@lib/validators';
export function savePdf(rows: RecordType[]) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('WO/WNSC Export', 14, 18);
  doc.setFontSize(10);
  const lines = rows.slice(0, 40).map((r: any, i: number) => `${i + 1}. ${r.refType} ${r.refNumber} — ${r.company}`);
  doc.text(lines, 14, 28);
  doc.save('export.pdf');
}
