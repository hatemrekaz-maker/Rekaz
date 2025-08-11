'use client';
export function HeroOil() {
  const prefersReduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion)').matches;
  return (
    <div className="concave" style={{ padding: 14, background: 'linear-gradient(135deg, #0b5fff, #3c82ff)', minWidth: 260, flex: 1, transform: prefersReduced ? '' : 'translateZ(0)' }}>
      <div style={{ fontWeight: 700 }}>Oman Oil</div>
      <div style={{ opacity: .85, fontSize: 12 }}>Blue theme · subtle oil ripple</div>
    </div>
  );
}
