'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

// Carrossel infinito de logotipos: 5 por vez no desktop, 1 no celular.
export default function Carousel({ slides }) {
  const n = slides.length;
  const [i, setI] = useState(n); // começa no bloco do meio (3 cópias)
  const [anim, setAnim] = useState(true);
  const paused = useRef(false);
  const all = [...slides, ...slides, ...slides];

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setI((v) => v + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const onEnd = () => {
    if (i >= 2 * n || i < n) {
      setAnim(false);
      setI((v) => (v >= 2 * n ? v - n : v + n));
      requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
    }
  };

  return (
    <div className="carousel" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <button type="button" className="carousel-arrow prev" aria-label="Anterior" onClick={() => setI((v) => v - 1)}>
        <Icon name="e-eicon-chevron-left" size={25} />
      </button>
      <div className="carousel-viewport">
        <ul
          className="carousel-track"
          style={{ transform: `translateX(calc(var(--slide) * ${-i}))`, transition: anim ? 'transform .5s ease' : 'none' }}
          onTransitionEnd={onEnd}
        >
          {all.map((s, k) => (
            <li key={k} aria-hidden={k < n || k >= 2 * n}>
              <img src={s.src} alt={s.alt} width="168" height="168" loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
      <button type="button" className="carousel-arrow next" aria-label="Próximo" onClick={() => setI((v) => v + 1)}>
        <Icon name="e-eicon-chevron-right" size={25} />
      </button>
    </div>
  );
}
