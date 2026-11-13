'use client';
import { useEffect, useState } from 'react';

// Vídeo de fundo do hero (YouTube, mudo e em loop), como no site original.
// Só carrega depois da página pronta; com "reduzir movimento" ou economia de dados fica só a imagem.
export default function HeroVideo({ id, start = 1 }) {
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    if (!reduce && !saveData) setShow(true);
  }, []);
  if (!show) return null;
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&start=${start}&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3`;
  return (
    <div className="hero-video" aria-hidden="true">
      <iframe
        className={ready ? 'is-ready' : ''}
        src={src}
        title="Vídeo de fundo"
        tabIndex={-1}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setTimeout(() => setReady(true), 1500)}
      />
    </div>
  );
}
