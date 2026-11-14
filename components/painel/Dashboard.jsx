'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { CardSkeleton } from './Skeleton';
import { Avatar, Ico, Img, roleName } from './ui';

// O teste de velocidade só é baixado quando o Início aparece.
const SpeedTest = dynamic(() => import('./SpeedTest'), { ssr: false, loading: () => <CardSkeleton fields={1} /> });

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const CORES = ['#003b6e', '#ee7302', '#1a7f5a', '#7a4fd1', '#c2410c', '#0e7490'];

function Ring({ pct, color, label, count }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="d-ring">
      <svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label={`${label}: ${pct}%`}>
        <circle cx="42" cy="42" r={r} fill="none" stroke="#e6eaef" strokeWidth="8" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform="rotate(-90 42 42)"
        />
        <text x="42" y="47" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1d2733">
          {pct}%
        </text>
      </svg>
      <b>{label}</b>
      <small>
        {count} notícia{count === 1 ? '' : 's'}
      </small>
    </div>
  );
}

function Mini({ p, onOpen }) {
  return (
    <button type="button" className="d-mini" onClick={() => onOpen(p)}>
      <span className="d-mini-thumb">{p.image ? <Img src={p.image.src} /> : null}</span>
      <span>
        <b>{p.title}</b>
        <small>
          {p.categories[0]?.name ? `${p.categories[0].name} · ` : ''}
          {new Date(p.date).toLocaleDateString('pt-BR')}
        </small>
      </span>
    </button>
  );
}

export default function Dashboard({ user, posts, users, go, openPost }) {
  const now = new Date();
  const [month, setMonth] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const publicadas = posts.filter((p) => p.status === 'publicado');
  const rascunhos = posts.filter((p) => p.status !== 'publicado');
  const naHome = publicadas.slice(0, 3);
  const outras = publicadas.slice(3);
  const temas = useMemo(() => {
    const m = new Map();
    for (const p of publicadas) {
      const t = p.categories[0]?.name || 'Sem tema';
      m.set(t, (m.get(t) || 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);
  const hora = now.getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const data = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  const first = new Date(month.y, month.m, 1);
  const days = new Date(month.y, month.m + 1, 0).getDate();
  const doMes = posts.filter((p) => {
    const d = new Date(p.date);
    return d.getFullYear() === month.y && d.getMonth() === month.m;
  });
  const porDia = new Map();
  for (const p of doMes) {
    const d = new Date(p.date).getDate();
    porDia.set(d, [...(porDia.get(d) || []), p]);
  }
  const shift = (n) => {
    const d = new Date(month.y, month.m + n, 1);
    setMonth({ y: d.getFullYear(), m: d.getMonth() });
  };
  const cells = [...Array(first.getDay()).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  const stats = [
    ['check', 'green', publicadas.length, publicadas.length === 1 ? 'Notícia publicada' : 'Notícias publicadas'],
    ['edit', 'orange', rascunhos.length, rascunhos.length === 1 ? 'Rascunho' : 'Rascunhos'],
    ['tag', 'blue', temas.filter(([t]) => t !== 'Sem tema').length, 'Temas'],
    user.admin ? ['users', 'navy', users.length, users.length === 1 ? 'Pessoa com acesso' : 'Pessoas com acesso'] : ['news', 'navy', 4, 'Páginas do site'],
  ];
  const paginas = [
    ['home', 'Página inicial', 'Banner, marcas, números e destaques'],
    ['sobre', 'Sobre nós', 'História, valores e líderes'],
    ['produtos', 'Produtos', 'Marcas e catálogo'],
    ['trabalhe', 'Trabalhe conosco', 'Unidade, mapa e contato'],
  ];

  return (
    <div className="d">
      <header className="d-hello">
        <div>
          <small>{data}</small>
          <h1>
            {saudacao}, {user.name.split(' ')[0]}
          </h1>
          <p className="p-muted">Veja como está o site e escolha o que atualizar.</p>
        </div>
        <button type="button" className="p-btn p-btn--primary" onClick={() => go('editor')}>
          <Ico name="edit" size={16} />
          Editar o site
        </button>
      </header>

      <div className="d-stats">
        {stats.map(([icon, tone, n, label]) => (
          <div className="d-stat" key={label}>
            <span className={`d-stat-ico d-tone-${tone}`}>
              <Ico name={icon} size={20} />
            </span>
            <div>
              <b>{n}</b>
              <small>{label}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="d-grid">
        <section className="d-card d-span2">
          <div className="d-card-head">
            <h2>Notícias</h2>
            <button type="button" className="d-link" onClick={() => go('noticias')}>
              Ver todas
            </button>
          </div>
          <div className="d-board">
            {[
              ['Rascunhos', rascunhos, 'gray', 'Nenhum rascunho.'],
              ['Na página inicial', naHome, 'orange', 'Nenhuma notícia publicada.'],
              ['Outras publicadas', outras, 'navy', 'As 3 mais recentes ficam na página inicial.'],
            ].map(([t, list, tone, vazio]) => (
              <div className={`d-col d-col--${tone}`} key={t}>
                <div className="d-col-head">
                  <span>{t}</span>
                  <i>{list.length}</i>
                </div>
                {list.length ? list.slice(0, 4).map((p) => <Mini key={p.id} p={p} onOpen={openPost} />) : <p className="d-empty">{vazio}</p>}
                {list.length > 4 ? (
                  <button type="button" className="d-link" onClick={() => go('noticias')}>
                    + {list.length - 4} outra{list.length - 4 === 1 ? '' : 's'}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="d-card">
          <div className="d-card-head">
            <h2>Calendário de notícias</h2>
          </div>
          <div className="d-cal-nav">
            <button type="button" aria-label="Mês anterior" onClick={() => shift(-1)}>
              <Ico name="back" size={16} />
            </button>
            <b>
              {MESES[month.m]} {month.y}
            </b>
            <button type="button" aria-label="Próximo mês" onClick={() => shift(1)}>
              <Ico name="arrow" size={16} />
            </button>
          </div>
          <div className="d-cal" role="grid" aria-label={`${MESES[month.m]} ${month.y}`}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
              <span className="d-cal-w" key={i}>
                {d}
              </span>
            ))}
            {cells.map((d, i) =>
              d === null ? (
                <span key={i} />
              ) : (
                <span
                  key={i}
                  className={`d-cal-d ${porDia.has(d) ? 'has-post' : ''} ${d === now.getDate() && month.m === now.getMonth() && month.y === now.getFullYear() ? 'is-today' : ''}`}
                  title={
                    porDia.has(d)
                      ? porDia
                          .get(d)
                          .map((p) => p.title)
                          .join(' · ')
                      : undefined
                  }
                >
                  {d}
                </span>
              ),
            )}
          </div>
          <div className="d-cal-list">
            {doMes.length ? (
              doMes.map((p) => (
                <button type="button" key={p.id} onClick={() => openPost(p)}>
                  <i />
                  {String(new Date(p.date).getDate()).padStart(2, '0')} · {p.title}
                </button>
              ))
            ) : (
              <p className="d-empty">
                <i />
                Nenhuma notícia neste mês
              </p>
            )}
          </div>
        </section>

        <section className="d-card">
          <div className="d-card-head">
            <h2>Notícias por tema</h2>
          </div>
          {temas.length ? (
            <div className="d-rings">
              {temas.slice(0, 4).map(([t, n], i) => (
                <Ring key={t} label={t} count={n} color={CORES[i % CORES.length]} pct={Math.round((n / publicadas.length) * 100)} />
              ))}
            </div>
          ) : (
            <p className="d-empty">Publique notícias para ver os temas.</p>
          )}
        </section>

        <section className="d-card">
          <div className="d-card-head">
            <h2>Páginas do site</h2>
            <a className="d-link" href="/" target="_blank" rel="noopener">
              Ver o site ↗
            </a>
          </div>
          <div className="d-pages">
            {paginas.map(([id, nome, desc]) => (
              <button type="button" key={id} onClick={() => go(`editor:${id}`)}>
                <span>
                  <b>{nome}</b>
                  <small>{desc}</small>
                </span>
                <em>
                  Editar <Ico name="arrow" size={14} />
                </em>
              </button>
            ))}
          </div>
        </section>

        <section className="d-card">
          <div className="d-card-head">
            <h2>{user.admin ? 'Equipe' : 'Seu acesso'}</h2>
            {user.admin ? (
              <button type="button" className="d-link" onClick={() => go('acessos')}>
                Gerenciar
              </button>
            ) : null}
          </div>
          <div className="d-team">
            {(user.admin ? users : [{ ...user, id: user.id }]).map((u) => (
              <div key={u.id}>
                <Avatar name={u.name} size={40} tone={u.id === user.id ? 'orange' : 'navy'} />
                <span>
                  <b>
                    {u.name}
                    {u.id === user.id ? ' (você)' : ''}
                  </b>
                  <small>{u.email || u.username}</small>
                </span>
                <span className={`p-badge ${u.admin ? 'p-badge--admin' : ''}`}>{roleName(u)}</span>
              </div>
            ))}
          </div>
        </section>

        <SpeedTest />
      </div>
    </div>
  );
}
