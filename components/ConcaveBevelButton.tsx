'use client';
import { CSSProperties } from 'react';

export function ConcaveBevelButton({ label, onClick, type = 'button' }: { label: string; onClick?: () => void; type?: 'button' | 'submit' }) {
  const style: CSSProperties = {
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,.08)',
    background: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(0,0,0,.35))',
    boxShadow: 'var(--bevel-inner), var(--bevel-outline)',
    transformOrigin: 'center',
    transition: `transform var(--press-duration) var(--press-ease), filter var(--press-duration) var(--press-ease)`
  };
  return (
    <button
      type={type}
      onClick={onClick}
      style={style}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = `scale(var(--press-scale)) rotate(1.5deg)`;
        (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(.96)';
      }}
      onPointerUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = '';
        (e.currentTarget as HTMLButtonElement).style.filter = '';
      }}
    >
      {label}
    </button>
  );
}
