export function attachPress(el: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion)').matches;
  if (reduced) return () => {};
  const down = () => { el.style.transform = `scale(var(--press-scale)) rotate(2deg)`; };
  const up = () => { el.style.transform = ''; };
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointerleave', up);
  return () => {
    el.removeEventListener('pointerdown', down);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointerleave', up);
  };
}
