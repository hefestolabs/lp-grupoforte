'use client';
import { useEffect } from 'react';

// Só existe dentro da prévia do editor: deixa as partes do site clicáveis e avisa o painel qual foi escolhida.
export default function EditBridge() {
  useEffect(() => {
    document.documentElement.classList.remove('js-reveal'); // sem efeitos de entrada na prévia: tudo visível
    document.documentElement.classList.add('gf-editing');
    const tell = (msg) => window.parent?.postMessage({ source: 'gf-previa', ...msg }, window.location.origin);
    const onClick = (e) => {
      e.preventDefault(); e.stopPropagation();
      const el = e.target.closest('[data-edit]');
      if (el) { mark(el.getAttribute('data-edit')); tell({ type: 'select', id: el.getAttribute('data-edit') }); }
    };
    const mark = (id) => document.querySelectorAll('[data-edit]').forEach((n) => n.classList.toggle('gf-selected', n.getAttribute('data-edit') === id));
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.data?.source !== 'gf-painel') return;
      if (e.data.type === 'focus') {
        mark(e.data.id);
        const el = document.querySelector(`[data-edit="${e.data.id}"]`);
        if (el && e.data.scroll) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      if (e.data.type === 'scroll') window.scrollTo(0, e.data.y);
    };
    const onScroll = () => tell({ type: 'scroll', y: window.scrollY });
    document.addEventListener('click', onClick, true);
    window.addEventListener('message', onMessage);
    window.addEventListener('scroll', onScroll, { passive: true });
    tell({ type: 'ready', path: window.location.pathname });
    return () => { document.removeEventListener('click', onClick, true); window.removeEventListener('message', onMessage); window.removeEventListener('scroll', onScroll); };
  }, []);
  return null;
}
