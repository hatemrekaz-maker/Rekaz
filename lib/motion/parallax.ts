export function attachParallax(el: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion)').matches;
  if (reduced) return () => {};
  const handler = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${relX * -4}deg) rotateX(${relY * 4}deg) translateZ(0)`;
  };
  const reset = () => (el.style.transform = '');
  el.addEventListener('pointermove', handler);
  el.addEventListener('pointerleave', reset);
  return () => {
    el.removeEventListener('pointermove', handler);
    el.removeEventListener('pointerleave', reset);
  };
}
