'use client';
export function HeroWater() {
  const prefersReduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion)').matches;
  return (
    <div className="concave" style={{ padding: 14, background: 'linear-gradient(135deg, #e1003c, #ff3b53)', minWidth: 260, flex: 1, transform: prefersReduced ? '' : 'translateZ(0)' }}>
      <div style={{ fontWeight: 700 }}>NAMA</div>
      <div style={{ opacity: .85, fontSize: 12 }}>Red theme · subtle water drip</div>
    </div>
  );
}
