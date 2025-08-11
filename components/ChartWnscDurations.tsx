'use client';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
export default function ChartWnscDurations({ data }: { data: { bin: string; count: number }[] }) {
  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
          <XAxis dataKey="bin" tick={{ fill: '#cbd5ff', fontSize: 12 }} />
          <YAxis tick={{ fill: '#cbd5ff', fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#111521', border: '1px solid rgba(255,255,255,.1)' }} />
          <Bar dataKey="count" stroke="#ff9aa6" fill="#ff3b53" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
