'use client';
import { useRef, useState } from 'react';

const PAGINAS = [['Página inicial', '/'], ['Sobre nós', '/sobre-nos/'], ['Produtos', '/produtos/'], ['Trabalhe conosco', '/trabalhe-conosco/'], ['Notícias', '/noticias/']];
const nota = (s) => (s <= 2.5 ? ['Rápido', 'ok'] : s <= 4.5 ? ['Razoável', 'meio'] : ['Lento', 'ruim']);
const mb = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
const seg = (ms) => `${(ms / 1000).toFixed(1).replace('.', ',')} s`;

// Carrega a página de verdade em uma moldura invisível, neste navegador e nesta conexão, e lê os tempos que
// o próprio navegador registra. O HTML é sempre pedido de novo; imagens e scripts já baixados podem vir do cache.
function medir(path, holder) {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true'); frame.tabIndex = -1;
    frame.style.cssText = 'position:absolute;left:-9999px;top:0;width:1366px;height:768px;border:0;visibility:hidden';
    let done = false;
    const finish = (result) => { if (done) return; done = true; clearTimeout(timer); frame.remove(); resolve(result); };
    const timer = setTimeout(() => finish({ erro: 'Demorou mais de 30 segundos' }), 30000);
    frame.onload = () => setTimeout(() => {
      try {
        const perf = frame.contentWindow.performance;
        const nav = perf.getEntriesByType('navigation')[0];
        if (!nav || !nav.loadEventEnd) return finish({ erro: 'Não foi possível medir' });
        const recursos = perf.getEntriesByType('resource');
        const proprios = recursos.filter((r) => r.name.startsWith(window.location.origin));
        const peso = (nav.transferSize || nav.encodedBodySize || 0) + proprios.reduce((t, r) => t + (r.transferSize || r.encodedBodySize || 0), 0);
        const imagens = proprios.filter((r) => r.initiatorType === 'img' || r.initiatorType === 'css' && /\.(png|jpe?g|webp|gif)(\?|$)/i.test(r.name));
        const maior = imagens.sort((a, b) => (b.encodedBodySize || 0) - (a.encodedBodySize || 0))[0];
        finish({ carga: nav.loadEventEnd - nav.startTime, servidor: nav.responseStart - nav.requestStart, peso, pedidos: recursos.length + 1, maior: maior && maior.encodedBodySize > 300 * 1024 ? { nome: decodeURIComponent(maior.name.split('/').pop().split('?')[0]), bytes: maior.encodedBodySize } : null });
      } catch { finish({ erro: 'Não foi possível medir' }); }
    }, 400);
    frame.onerror = () => finish({ erro: 'A página não abriu' });
    frame.src = `${path}?velocidade=${Date.now()}`;
    holder.appendChild(frame);
  });
}

export default function SpeedTest() {
  const [rows, setRows] = useState([]);
  const [running, setRunning] = useState('');
  const [when, setWhen] = useState('');
  const holder = useRef(null);

  async function testar() {
    setRows([]); setWhen('');
    const out = [];
    for (const [nome, path] of PAGINAS) {
      setRunning(nome);
      out.push({ nome, path, ...(await medir(path, holder.current)) });
      setRows([...out]);
    }
    setRunning(''); setWhen(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  }

  const ok = rows.filter((r) => !r.erro);
  const media = ok.length ? ok.reduce((t, r) => t + r.carga, 0) / ok.length : 0;
  const [veredito, tom] = nota(media / 1000);
  const pesada = ok.filter((r) => r.maior).sort((a, b) => b.maior.bytes - a.maior.bytes)[0];
  const psi = typeof window === 'undefined' ? '#' : `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(window.location.origin + '/')}`;

  return (
    <section className="d-card d-span3 d-speed">
      <div className="d-card-head">
        <h2>Velocidade do site</h2>
        <button type="button" className="p-btn p-btn--primary" disabled={Boolean(running)} data-busy={running ? true : undefined} onClick={testar}>{running ? 'Testando…' : rows.length ? 'Testar de novo' : 'Testar a velocidade'}</button>
      </div>
      <div ref={holder} />
      {!rows.length && !running ? <p className="d-empty">Abre cada página do site neste navegador e mede quanto tempo leva para carregar por completo. Leva cerca de meio minuto.</p> : null}
      {running ? <p className="d-speed-status" role="status">Medindo: {running}…</p> : null}
      {!running && ok.length ? (
        <p className={`d-speed-sum d-speed--${tom}`} role="status"><b>{veredito}</b> — as páginas carregam em média em {seg(media)} na sua conexão{when ? ` (teste das ${when})` : ''}.</p>
      ) : null}
      {rows.length ? (
        <div className="d-speed-table" role="table" aria-label="Resultado do teste de velocidade">
          <div className="d-speed-row d-speed-head" role="row"><span role="columnheader">Página</span><span role="columnheader">Carregamento</span><span role="columnheader">Resposta do servidor</span><span role="columnheader">Peso</span><span role="columnheader">Arquivos</span><span role="columnheader">Avaliação</span></div>
          {rows.map((r) => r.erro ? (
            <div className="d-speed-row" role="row" key={r.path}><span role="cell"><b>{r.nome}</b></span><span role="cell" className="d-speed-err">{r.erro}</span></div>
          ) : (
            <div className="d-speed-row" role="row" key={r.path}>
              <span role="cell"><b>{r.nome}</b></span><span role="cell">{seg(r.carga)}</span><span role="cell">{Math.round(r.servidor)} ms</span><span role="cell">{mb(r.peso)}</span><span role="cell">{r.pedidos}</span>
              <span role="cell"><i className={`d-speed-tag d-speed--${nota(r.carga / 1000)[1]}`}>{nota(r.carga / 1000)[0]}</i></span>
            </div>
          ))}
        </div>
      ) : null}
      {!running && pesada ? <p className="p-help">Dica: a imagem mais pesada é <b>{pesada.maior.nome}</b> ({mb(pesada.maior.bytes)}), em {pesada.nome}. Imagens abaixo de 300 KB deixam a página mais leve.</p> : null}
      {!running && rows.length ? <p className="p-help">O resultado depende da sua internet e do seu aparelho. Para a avaliação oficial do Google, com nota de 0 a 100 para celular e computador, <a className="d-link" href={psi} target="_blank" rel="noopener">abra o PageSpeed Insights ↗</a>.</p> : null}
    </section>
  );
}
