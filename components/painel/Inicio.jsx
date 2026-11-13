'use client';
import { useEffect, useMemo, useState } from 'react';
import { Avatar, papel } from './Perfil';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const CORES = ['#003b6e', '#ee7302', '#1f9d61', '#3a8fd9'];
const PAGINAS = [['home', 'Página inicial', 'Banner, marcas, números e destaques'], ['sobre', 'Sobre nós', 'História, liderança e valores'], ['produtos', 'Produtos', 'Marcas e catálogo'], ['trabalhe', 'Trabalhe conosco', 'Texto e formulário de vagas']];
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dataCurta = (iso) => { const [a, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}/${a}`; };

const ICONES = {
  ok: 'M5 12.5l4.5 4.5L19 7.5',
  rascunho: 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',
  tema: 'M4 4h7l9 9-7 7-9-9V4zM8 8h.01',
  pessoas: 'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1.5a3.5 3.5 0 0 0-2.5-3.3M15.5 4.2a3 3 0 0 1 0 5.6',
  casa: 'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-8z',
};
const Ico = ({ n }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONES[n]} /></svg>;

function Anel({ pct, cor }) {
  const r = 30; const c = 2 * Math.PI * r;
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
      <circle cx="38" cy="38" r={r} fill="none" stroke="#e6eaef" strokeWidth="7" />
      <circle cx="38" cy="38" r={r} fill="none" stroke={cor} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(c * pct) / 100} ${c}`} transform="rotate(-90 38 38)" />
      <text x="38" y="43" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1d2733">{pct}%</text>
    </svg>
  );
}

function Calendario({ hoje, posts }) {
  const [mes, setMes] = useState(() => new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const porDia = useMemo(() => { const m = {}; for (const p of posts) { const k = p.date.slice(0, 10); (m[k] = m[k] || []).push(p); } return m; }, [posts]);
  const dias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const celulas = [...Array(mes.getDay()).fill(null), ...Array.from({ length: dias }, (_, i) => i + 1)];
  const prefixo = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, '0')}`;
  const noMes = posts.filter((p) => p.date.startsWith(prefixo)).length;
  const mover = (n) => setMes(new Date(mes.getFullYear(), mes.getMonth() + n, 1));
  return (
    <>
      <div className="d-cal-head">
        <button type="button" className="p-icon-btn" aria-label="Mês anterior" onClick={() => mover(-1)}>←</button>
        <b>{MESES[mes.getMonth()]} {mes.getFullYear()}</b>
        <button type="button" className="p-icon-btn" aria-label="Próximo mês" onClick={() => mover(1)}>→</button>
      </div>
      <div className="d-cal" role="grid" aria-label={`Notícias em ${MESES[mes.getMonth()]}`}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <span key={`h${i}`} className="d-cal-dow">{d}</span>)}
        {celulas.map((d, i) => {
          if (!d) return <span key={`v${i}`} />;
          const k = `${prefixo}-${String(d).padStart(2, '0')}`; const lista = porDia[k];
          return <span key={k} className={`d-cal-day ${lista ? 'has-post' : ''} ${k === ymd(hoje) ? 'is-today' : ''}`} title={lista ? lista.map((p) => p.title).join(' · ') : undefined}>{d}</span>;
        })}
      </div>
      <p className="d-foot"><i className="d-dot" /> {noMes === 0 ? 'Nenhuma notícia neste mês' : noMes === 1 ? '1 notícia neste mês' : `${noMes} notícias neste mês`}</p>
    </>
  );
}

function Cartao({ p, abrir }) {
  return (
    <button type="button" className="d-kcard" onClick={() => abrir(p)}>
      <span className="d-kthumb">{p.image ? <img src={p.image.src} alt="" /> : null}</span>
      <span className="d-kmain"><b>{p.title}</b><small>{p.categories[0]?.name || 'Sem tema'} · {dataCurta(p.date)}</small></span>
    </button>
  );
}

export default function Inicio({ user, posts, users, go, abrirEditor, novaNoticia, abrirNoticia }) {
  // A data vem do navegador (depois de montar) para não divergir do servidor.
  const [hoje, setHoje] = useState(null);
  useEffect(() => { setHoje(new Date()); }, []);

  const publicadas = posts.filter((p) => p.status === 'publicado');
  const rascunhos = posts.filter((p) => p.status !== 'publicado');
  const naHome = publicadas.slice(0, 3);
  const outras = publicadas.slice(3);
  const temas = useMemo(() => {
    const m = {}; for (const p of publicadas) { const n = p.categories[0]?.name || 'Sem tema'; m[n] = (m[n] || 0) + 1; }
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const hora = hoje ? hoje.getHours() : 12;
  const saudacao = !hoje ? 'Olá' : hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const stats = [
    ['ok', 'Notícias publicadas', publicadas.length, 'verde'],
    ['rascunho', 'Rascunhos', rascunhos.length, 'laranja'],
    ['tema', 'Temas', temas.filter(([n]) => n !== 'Sem tema').length, 'azul'],
    user.admin ? ['pessoas', 'Pessoas com acesso', users.length, 'navy'] : ['casa', 'Na página inicial', naHome.length, 'navy'],
  ];
  const colunas = [['Rascunhos', rascunhos.slice(0, 4), rascunhos.length, 'Nenhum rascunho.'], ['Na página inicial', naHome, naHome.length, 'Nenhuma notícia publicada.'], ['Outras publicadas', outras.slice(0, 4), outras.length, 'As 3 mais recentes ficam na página inicial.']];

  return (
    <div className="d">
      <header className="d-hello">
        <div>
          <p className="d-eyebrow">{hoje ? hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : ' '}</p>
          <h1>{saudacao}, {user.name.split(' ')[0]}</h1>
          <p className="p-muted">Veja como está o site e escolha o que atualizar.</p>
        </div>
        <div className="d-actions">
          <button type="button" className="p-btn" onClick={() => abrirEditor('home')}>Editar o site</button>
          <button type="button" className="p-btn p-btn--primary" onClick={novaNoticia}>+ Nova notícia</button>
        </div>
      </header>

      <section className="d-stats" aria-label="Resumo">
        {stats.map(([ico, rotulo, valor, tom]) => (
          <div className="d-stat" key={rotulo}>
            <span className={`d-stat-ico d-tom--${tom}`}><Ico n={ico} /></span>
            <span><b>{valor}</b><small>{rotulo}</small></span>
          </div>
        ))}
      </section>

      <div className="d-grid">
        <section className="d-card d-span2">
          <div className="d-card-head"><h2>Notícias</h2><button type="button" className="p-linklike" onClick={() => go('noticias')}>Ver todas</button></div>
          <div className="d-kanban">
            {colunas.map(([titulo, lista, total, vazio]) => (
              <div className="d-kcol" key={titulo}>
                <div className="d-kcol-head"><b>{titulo}</b><span>{total}</span></div>
                {lista.length ? lista.map((p) => <Cartao key={p.id} p={p} abrir={abrirNoticia} />) : <p className="d-kempty">{vazio}</p>}
                {total > lista.length ? <button type="button" className="p-linklike d-kmore" onClick={() => go('noticias')}>+ {total - lista.length} em Notícias</button> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="d-card">
          <div className="d-card-head"><h2>Calendário de notícias</h2></div>
          {hoje ? <Calendario hoje={hoje} posts={posts} /> : <div className="d-cal-vazio" />}
        </section>

        <section className="d-card">
          <div className="d-card-head"><h2>Notícias por tema</h2></div>
          {temas.length ? (
            <div className="d-rings">
              {temas.slice(0, 4).map(([nome, n], i) => (
                <div className="d-ring" key={nome}><Anel pct={Math.round((n / publicadas.length) * 100)} cor={CORES[i]} /><b>{nome}</b><small>{n} notícia{n === 1 ? '' : 's'}</small></div>
              ))}
            </div>
          ) : <p className="d-kempty">Publique uma notícia para ver os temas aqui.</p>}
        </section>

        <section className="d-card">
          <div className="d-card-head"><h2>Páginas do site</h2><a className="p-linklike" href="/" target="_blank" rel="noopener">Ver o site ↗</a></div>
          <div className="d-list">
            {PAGINAS.map(([id, nome, desc]) => (
              <button type="button" className="d-item" key={id} onClick={() => abrirEditor(id)}>
                <span className="d-item-main"><b>{nome}</b><small>{desc}</small></span><span className="d-item-go">Editar →</span>
              </button>
            ))}
          </div>
        </section>

        <section className="d-card">
          {user.admin ? (
            <>
              <div className="d-card-head"><h2>Equipe</h2><button type="button" className="p-linklike" onClick={() => go('acessos')}>Gerenciar</button></div>
              <div className="d-list">
                {users.map((u) => (
                  <div className="d-item d-item--static" key={u.id}>
                    <Avatar name={u.name} size={38} tone={u.id === user.id ? 'orange' : 'soft'} />
                    <span className="d-item-main"><b>{u.name}{u.id === user.id ? ' (você)' : ''}</b><small>{u.email || u.username}</small></span>
                    <span className={`p-tag ${u.mustChange ? '' : 'p-tag--ok'}`}>{u.mustChange ? 'Senha provisória' : papel(u)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="d-card-head"><h2>Sua conta</h2><button type="button" className="p-linklike" onClick={() => go('senha')}>Editar</button></div>
              <div className="d-item d-item--static"><Avatar name={user.name} size={44} tone="orange" /><span className="d-item-main"><b>{user.name}</b><small>{user.email || user.username}</small></span><span className="p-tag p-tag--ok">{papel(user)}</span></div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
