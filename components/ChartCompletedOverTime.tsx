'use client';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
export default function ChartCompletedOverTime({ data }: { data: { x: string; y: number }[] }) {
  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3c82ff" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#0b5fff" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
          <XAxis dataKey="x" tick={{ fill: '#cbd5ff', fontSize: 12 }} />
          <YAxis tick={{ fill: '#cbd5ff', fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#111521', border: '1px solid rgba(255,255,255,.1)' }} />
          <Area type="monotone" dataKey="y" stroke="#93b4ff" fill="url(#grad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
