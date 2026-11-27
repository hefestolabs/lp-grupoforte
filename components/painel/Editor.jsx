'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PreviewSkeleton } from './Skeleton';
import { api } from './api';
import { Field } from './Fields';
import { ProfileMenu } from './ui';

const DEVICES = [['desktop', 'Computador', '100%'], ['tablet', 'Tablet', '820px'], ['celular', 'Celular', '390px']];

// Editor visual: prévia do site real à direita, campos da parte escolhida à esquerda.
export default function Editor({ siteMenu, schema, content, setContent, saved, setSaved, notify, user, goTab, logout, startPage = 'home' }) {
  const pages = useMemo(() => [
    { id: 'home', label: 'Página inicial', short: 'Home', path: '/', section: 'home' },
    { id: 'sobre', label: 'Sobre nós', short: 'Sobre nós', path: '/sobre-nos/', section: 'sobre' },
    { id: 'produtos', label: 'Produtos', short: 'Produtos', path: '/produtos/', section: 'paginas', only: ['produtos'], extra: [['home', 'marcas']] },
    { id: 'trabalhe', label: 'Trabalhe conosco', short: 'Trabalhe conosco', path: '/trabalhe-conosco/', section: 'paginas', only: ['trabalhe'] },
  ], []);
  const [pageId, setPageId] = useState(startPage);
  const [sel, setSel] = useState(null); // "seção:grupo"
  const [device, setDevice] = useState('desktop');
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState('pronto'); // pronto | atualizando
  const [loaded, setLoaded] = useState(false); // a prévia já apareceu ao menos uma vez nesta página
  const [step, setStep] = useState(0); // seções já publicadas, para a barra de progresso
  const [showPreview, setShowPreview] = useState(false); // só no celular
  const frame = useRef(null);
  const box = useRef(null);
  const [scale, setScale] = useState(1); // em "Computador" a prévia é montada a 1440px e reduzida para caber
  const scrollY = useRef(0);
  const first = useRef(true);
  const page = pages.find((p) => p.id === pageId);

  const dirtySections = Object.keys(content).filter((k) => JSON.stringify(content[k]) !== JSON.stringify(saved[k]));
  const dirty = dirtySections.length > 0;

  // Partes editáveis da página atual (+ contatos/rodapé, que aparecem em todas).
  const groups = useMemo(() => {
    const list = [];
    const sec = schema.find((s) => s.id === page.section);
    for (const g of sec.grupos) if (!page.only || page.only.includes(g.id)) list.push({ key: `${sec.id}:${g.id}`, section: sec.id, group: g });
    for (const [sid, gid] of page.extra || []) { const g = schema.find((s) => s.id === sid).grupos.find((x) => x.id === gid); list.push({ key: `${sid}:${gid}`, section: sid, group: g }); }
    for (const g of schema.find((s) => s.id === 'contatos').grupos) list.push({ key: `contatos:${g.id}`, section: 'contatos', group: g });
    return list;
  }, [schema, page]);
  const current = groups.find((g) => g.key === sel);

  const post = (msg) => frame.current?.contentWindow?.postMessage({ source: 'gf-painel', ...msg }, window.location.origin);
  const reload = () => { if (frame.current) { setState('atualizando'); frame.current.src = `${page.path}?previa=${Date.now()}`; } };

  // Cada alteração vira rascunho no servidor e a prévia é recarregada (com pequena espera ao digitar).
  useEffect(() => {
    if (first.current) { first.current = false; api('draft', { method: 'PUT', data: { content } }).then(reload).catch(() => {}); return; }
    setState('atualizando');
    const t = setTimeout(() => { api('draft', { method: 'PUT', data: { content } }).then(reload).catch((e) => { notify(e.message, 'erro'); setState('pronto'); }); }, 700);
    return () => clearTimeout(t);
  }, [content]);
  useEffect(() => { scrollY.current = 0; setSel(null); setLoaded(false); reload(); }, [pageId]);

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.data?.source !== 'gf-previa') return;
      if (e.data.type === 'select') { setSel(e.data.id); setShowPreview(false); }
      if (e.data.type === 'page' && pages.some((x) => x.id === e.data.id)) setPageId(e.data.id);
      if (e.data.type === 'scroll') scrollY.current = e.data.y;
      if (e.data.type === 'ready') { setState('pronto'); setLoaded(true); post({ type: 'scroll', y: scrollY.current }); if (sel) post({ type: 'focus', id: sel, scroll: false }); }
    };
    window.addEventListener('message', onMessage); return () => window.removeEventListener('message', onMessage);
  }, [sel]);
  useEffect(() => { const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', h); return () => window.removeEventListener('beforeunload', h); }, [dirty]);

  useEffect(() => {
    const el = box.current; if (!el) return;
    const fit = () => setScale(device === 'desktop' ? Math.min(1, el.clientWidth / 1440) : 1);
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, [device]);

  const choose = (key) => { setSel(key); post({ type: 'focus', id: key, scroll: true }); };
  const change = (section, key, value) => setContent({ ...content, [section]: { ...content[section], [key]: value } });

  async function publish() {
    setBusy(true); setStep(0);
    try {
      const next = { ...saved };
      for (const section of dirtySections) { next[section] = (await api('content', { method: 'PUT', data: { section, data: content[section] } })).data; setStep((n) => n + 1); }
      setSaved(next); setContent(next);
      notify('Publicado. O site já está atualizado.');
    } catch (e) { notify(e.message, 'erro'); }
    setBusy(false);
  }
  function discard() { if (window.confirm('Descartar tudo o que você mudou e ainda não publicou?')) setContent(saved); }
  function leave(tab) { if (dirty && !window.confirm('Há alterações não publicadas. Sair do editor mesmo assim? Elas serão perdidas.')) return; if (dirty) setContent(saved); goTab(tab); }

  return (
    <div className={`ed ${showPreview ? 'ed--preview' : ''}`}>
      <header className="ed-bar">
        <button type="button" className="ed-home" onClick={() => leave('inicio')} aria-label="Voltar ao início do painel">← Início</button>
        <nav className="ed-tabs" aria-label="Página que está sendo editada">
          {pages.map((p) => <button type="button" key={p.id} className={pageId === p.id ? 'is-active' : ''} aria-current={pageId === p.id ? 'page' : undefined} onClick={() => setPageId(p.id)}>{p.short}</button>)}
        </nav>
        <span className="ed-sep" aria-hidden="true" />
        <button type="button" className="ed-tablike" onClick={() => leave('noticias')}>Notícias</button>
        <button type="button" className="ed-btn ed-btn--new" onClick={() => leave('noticias:nova')}>+ Nova notícia</button>
        <label className="ed-page"><span className="sr-only">Página</span>
          <select value={pageId} onChange={(e) => setPageId(e.target.value)}>{pages.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
        </label>
        <span className="ed-grow" />
        <span className={`ed-state ${dirty ? 'is-dirty' : ''}`}>{state === 'atualizando' ? 'Atualizando a prévia…' : dirty ? 'Alterações não publicadas' : 'Tudo publicado'}</span>
        {dirty ? <button type="button" className="ed-btn" onClick={discard}>Descartar</button> : null}
        <button type="button" className="ed-btn ed-btn--primary" disabled={!dirty || busy} data-busy={busy || undefined} onClick={publish}>{busy ? `Publicando ${Math.min(step + 1, dirtySections.length || 1)}/${dirtySections.length || 1}…` : 'Publicar'}</button>
        <ProfileMenu dark user={user} onLogout={logout} {...siteMenu} items={[['Início', () => leave('inicio')], ['Notícias', () => leave('noticias')], ...(user.admin ? [['Acessos', () => leave('acessos')], ['E-mail (Resend)', () => leave('email')]] : []), ['Minha conta', () => leave('senha')]]} />
      </header>

      <aside className="ed-panel">
        {current ? (
          <>
            <button type="button" className="ed-back" onClick={() => setSel(null)}>← Todas as partes</button>
            <h2>{current.group.titulo}</h2>
            <div className="ed-fields">
              {current.group.campos.map((c) => <Field key={c.key} field={c} hidden={(content[current.section]._ocultos || []).includes(c.key)} onToggleHidden={() => { const h = content[current.section]._ocultos || []; setContent({ ...content, [current.section]: { ...content[current.section], _ocultos: h.includes(c.key) ? h.filter((k) => k !== c.key) : [...h, c.key] } }); }} value={content[current.section][c.key]} onChange={(v) => change(current.section, c.key, v)} />)}
            </div>
            {current.key === 'home:noticias' ? (
              <div className="ed-news">
                <p className="ed-hint">As 3 notícias mais recentes aparecem aqui na página inicial.</p>
                <button type="button" className="p-btn p-btn--primary" onClick={() => leave('noticias:nova')}>+ Nova notícia</button>
                <button type="button" className="p-btn" onClick={() => leave('noticias')}>Ver e editar as notícias</button>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <h2>{page.label}</h2>
            <p className="ed-hint">Clique em uma parte do site ao lado para editar, ou escolha aqui. Para mudar de página, use as abas no topo ou o menu do próprio site.</p>
            <div className="ed-list">
              {groups.map((g) => <button type="button" key={g.key} onClick={() => choose(g.key)}><span>{g.group.titulo}</span><small>{g.section === 'contatos' ? 'Rodapé e contatos' : g.group.campos.length === 1 ? '1 campo' : `${g.group.campos.length} campos`}</small></button>)}
            </div>
          </>
        )}
        <button type="button" className="ed-btn ed-toggle" onClick={() => setShowPreview(true)}>Ver a prévia</button>
      </aside>

      <main className="ed-stage">
        <button type="button" className="ed-btn ed-toggle ed-toggle--back" onClick={() => setShowPreview(false)}>← Voltar aos campos</button>
        <div className="ed-devices" role="group" aria-label="Tamanho da prévia">
          {DEVICES.map(([id, label]) => <button type="button" key={id} className={device === id ? 'is-active' : ''} aria-pressed={device === id} onClick={() => setDevice(id)}>{label}</button>)}
        </div>

        <div ref={box} data-busy={state === 'atualizando' && loaded ? true : undefined} className={`ed-frame ed-frame--${device}`} style={{ width: DEVICES.find((d) => d[0] === device)[2] }}>
          <iframe ref={frame} title="Prévia do site" style={scale < 1 ? { width: 1440, height: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: '0 0' } : undefined} onLoad={(e) => { if (e.currentTarget.getAttribute('src')) setLoaded(true); }} />
          <div className={`ed-skel ${loaded ? 'is-out' : ''}`}><PreviewSkeleton /></div>
        </div>
      </main>
    </div>
  );
}
