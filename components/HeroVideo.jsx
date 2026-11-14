'use client';
import { useEffect, useRef } from 'react';

// Vídeo de fundo do hero (YouTube, mudo e em loop), como no site original.
// O player nunca fica visível com botões: ele só aparece enquanto está de fato tocando; parado,
// carregando ou bloqueado, quem aparece é a capa. A moldura é ampliada para cortar título e logo
// do YouTube, e o loop é feito voltando o vídeo ao início um pouco antes do fim (sem tela de fim).
export default function HeroVideo({ id, start = 1 }) {
  const frame = useRef(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let showTimer;
    const send = (msg) => el.contentWindow?.postMessage(JSON.stringify(msg), '*');
    const command = (func, args = []) => send({ event: 'command', func, args });
    const listen = () => send({ event: 'listening', id: 1, channel: 'widget' });
    const show = (on) => {
      clearTimeout(showTimer);
      // Pequena espera ao entrar, para o título inicial do YouTube já ter sumido.
      if (on) showTimer = setTimeout(() => el.classList.add('is-ready'), 350);
      else el.classList.remove('is-ready');
    };
    const onMessage = (e) => {
      if (e.source !== el.contentWindow || typeof e.data !== 'string') return;
      let data;
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }
      const info = data.info;
      if (!info) return;
      if (data.event === 'onReady' || data.event === 'initialDelivery') {
        command('mute');
        command('playVideo');
      }
      if (typeof info.playerState === 'number') {
        if (info.playerState === 1) show(true);
        else if (info.playerState !== 3) show(false); // 3 = carregando um trecho: mantém como está
        if (info.playerState === 0) {
          command('seekTo', [start, true]);
          command('playVideo');
        }
      }
      if (typeof info.currentTime === 'number' && typeof info.duration === 'number' && info.duration > 2 && info.currentTime >= info.duration - 0.6) {
        command('seekTo', [start, true]);
      }
    };
    window.addEventListener('message', onMessage);
    el.addEventListener('load', listen);
    listen();
    const poll = setInterval(listen, 500);
    return () => {
      window.removeEventListener('message', onMessage);
      el.removeEventListener('load', listen);
      clearInterval(poll);
      clearTimeout(showTimer);
    };
  }, [start]);

  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&start=${start}&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&enablejsapi=1`;
  return (
    <div className="hero-video" aria-hidden="true">
      <div
        className="hero-poster"
        style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/maxresdefault.jpg), url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}
      />
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
