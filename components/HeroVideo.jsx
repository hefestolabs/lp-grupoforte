'use client';
import { useEffect, useRef, useState } from 'react';

// Vídeo de fundo do hero (YouTube, mudo e em loop), como no site original.
// O iframe já vem no HTML para começar a carregar o quanto antes; enquanto isso aparece a capa do
// vídeo, e o vídeo entra assim que o YouTube avisa que começou a tocar.
export default function HeroVideo({ id, start = 1 }) {
  const frame = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const listen = () => {
      // Pede ao player para avisar as mudanças de estado (protocolo da API de iframe do YouTube).
      el.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*');
    };
    const onMessage = (e) => {
      if (e.source !== el.contentWindow || typeof e.data !== 'string') return;
      try {
        const data = JSON.parse(e.data);
        if (data.info?.playerState === 1) setPlaying(true);
      } catch {}
    };
    window.addEventListener('message', onMessage);
    el.addEventListener('load', listen);
    listen();
    const poll = setInterval(listen, 400);
    // Rede lenta ou player que não avisa: mostra de qualquer forma depois de 4s.
    const fallback = setTimeout(() => setPlaying(true), 4000);
    return () => { window.removeEventListener('message', onMessage); el.removeEventListener('load', listen); clearInterval(poll); clearTimeout(fallback); };
  }, []);

  useEffect(() => { if (playing) frame.current?.classList.add('is-ready'); }, [playing]);

  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&start=${start}&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1`;
  return (
    <div className="hero-video" aria-hidden="true">
      <div className="hero-poster" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/maxresdefault.jpg), url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }} />
      <iframe
        ref={frame}
        src={src}
        title="Vídeo de fundo"
        tabIndex={-1}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
