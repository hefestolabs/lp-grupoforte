'use client';
import { useEffect, useRef, useState } from 'react';

// Contador animado (0 → valor final) quando entra na tela.
export default function Counter({ end, prefix = '', suffix = '', title, duration = 2000 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(end);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setValue(0);
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        setValue(Math.round(end * p));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [end, duration]);
  return (
    <div className="counter" ref={ref}>
      <div className="counter-title">{title}</div>
      <div className="counter-number">{prefix}{value}{suffix}</div>
    </div>
  );
}
