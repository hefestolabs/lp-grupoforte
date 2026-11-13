'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { Field } from './Fields';

const hoje = () => new Date().toISOString().slice(0, 10);

export default function PainelApp({ storeMode, user, schema, initialContent, initialPosts, initialUsers }) {
  const [tab, setTab] = useState(user.mustChange ? 'senha' : 'inicio');
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(initialContent);
  const [posts, setPosts] = useState(initialPosts);
  const [users, setUsers] = useState(initialUsers);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const locked = user.mustChange;

  const section = schema.find((s) => s.id === tab);
  const dirty = section ? JSON.stringify(content[tab]) !== JSON.stringify(saved[tab]) : false;
  const notify = (text, kind = 'ok') => { setToast({ text, kind }); setTimeout(() => setToast(null), 4000); };

  // Avisa antes de sair com alterações não salvas.
  useEffect(() => {
    const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h); return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  function go(next) {
    if (locked) return;
    if (dirty && !window.confirm('Há alterações não salvas nesta tela. Sair sem salvar?')) return;
    if (dirty) setContent({ ...content, [tab]: saved[tab] });
    setTab(next); setMenu(false); window.scrollTo(0, 0);
  }
  async function saveSection() {
    setBusy(true);
    try {
      const out = await api('content', { method: 'PUT', data: { section: tab, data: content[tab] } });
      setContent({ ...content, [tab]: out.data }); setSaved({ ...saved, [tab]: out.data });
      notify('Alterações salvas. O site já foi atualizado.');
    } catch (e) { notify(e.message, 'erro'); }
    setBusy(false);
  }
  async function logout() { await api('logout', { method: 'POST' }).catch(() => {}); window.location.href = '/painel/login/'; }

  const nav = [['inicio', 'Visão geral'], ...schema.map((s) => [s.id, s.titulo]), ['noticias', 'Notícias'], ['acessos', 'Acessos'], ['senha', 'Minha senha']];

  return (
    <div className="p-app">
      <aside className={`p-side ${menu ? 'is-open' : ''}`}>
        <div className="p-side-top">
          <img src="/img/logo-branco.png" alt="Grupo Forte" width="150" height="43" />
          <button type="button" className="p-menu-btn" aria-expanded={menu} onClick={() => setMenu(!menu)}>Menu</button>
        </div>
        <nav aria-label="Seções do painel">
          {nav.map(([id, label]) => <button type="button" key={id} className={tab === id ? 'is-active' : ''} aria-current={tab === id ? 'page' : undefined} disabled={locked && id !== 'senha'} onClick={() => go(id)}>{label}</button>)}
        </nav>
        <div className="p-side-foot">
          <a href="/" target="_blank" rel="noopener">Ver o site ↗</a>
          <span>{user.name}</span>
          <button type="button" onClick={logout}>Sair</button>
        </div>
      </aside>

      <main className="p-main">
        {storeMode !== 'mysql' ? <p className="p-error p-aviso" role="alert">Atenção: o banco de dados não está conectado. As alterações ficam em um arquivo temporário e se perdem na próxima publicação do site. Avise o suporte.</p> : null}
        {tab === 'inicio' ? <Inicio go={go} posts={posts} schema={schema} user={user} /> : null}

        {section ? (
          <>
            <header className="p-head"><h1>{section.titulo}</h1><p className="p-muted">Altere o que precisar e clique em Salvar. O site atualiza na hora.</p></header>
            {section.grupos.map((g) => (
              <details className="p-card" key={g.titulo}>
                <summary>{g.titulo}</summary>
                <div className="p-card-body">
                  {g.campos.map((c) => <Field key={c.key} field={c} value={content[tab][c.key]} onChange={(v) => setContent({ ...content, [tab]: { ...content[tab], [c.key]: v } })} />)}
                </div>
              </details>
            ))}
            <div className={`p-savebar ${dirty ? 'is-dirty' : ''}`}>
              <span>{dirty ? 'Há alterações não salvas.' : 'Tudo salvo.'}</span>
              {dirty ? <button type="button" className="p-btn p-btn--ghost" onClick={() => setContent({ ...content, [tab]: saved[tab] })}>Descartar</button> : null}
              <button type="button" className="p-btn p-btn--primary" disabled={!dirty || busy} onClick={saveSection}>{busy ? 'Salvando…' : 'Salvar alterações'}</button>
            </div>
          </>
        ) : null}

        {tab === 'noticias' ? <Noticias posts={posts} setPosts={setPosts} notify={notify} /> : null}
        {tab === 'acessos' ? <Acessos users={users} setUsers={setUsers} me={user} notify={notify} /> : null}
        {tab === 'senha' ? <Senha locked={locked} notify={notify} /> : null}
      </main>

      {toast ? <div className={`p-toast p-toast--${toast.kind}`} role="status">{toast.text}</div> : null}
    </div>
  );
}

function Inicio({ go, posts, schema, user }) {
  const publicadas = posts.filter((p) => p.status === 'publicado').length;
  return (
    <>
      <header className="p-head"><h1>Olá, {user.name.split(' ')[0]}</h1><p className="p-muted">Escolha o que quer atualizar no site.</p></header>
      <div className="p-tiles">
        <button type="button" className="p-tile p-tile--destaque" onClick={() => go('noticias')}><b>Notícias</b><span>{publicadas} publicada{publicadas === 1 ? '' : 's'} · criar, editar e remover</span></button>
        {schema.map((s) => <button type="button" className="p-tile" key={s.id} onClick={() => go(s.id)}><b>{s.titulo}</b><span>{s.grupos.map((g) => g.titulo).join(' · ')}</span></button>)}
        <button type="button" className="p-tile" onClick={() => go('acessos')}><b>Acessos</b><span>Quem pode entrar no painel</span></button>
      </div>
    </>
  );
}

function Noticias({ posts, setPosts, notify }) {
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);
  const categorias = useMemo(() => [...new Set(posts.map((p) => p.categories[0]?.name).filter(Boolean))], [posts]);
  const novo = () => setEdit({ title: '', category: '', date: hoje(), image: '', imageAlt: '', excerpt: '', content: '', status: 'publicado', slug: '' });
  const abrir = (p) => setEdit({ id: p.id, title: p.title, category: p.categories[0]?.name || '', date: p.date.slice(0, 10), time: p.date.slice(11, 19), image: p.image?.src || '', imageAlt: p.image?.alt || '', excerpt: p.excerpt, content: p.content, status: p.status, slug: p.slug });
  const set = (k) => (v) => setEdit((e) => ({ ...e, [k]: v }));
  async function reload() { setPosts(await api('posts')); }
  async function salvar() {
    setBusy(true);
    try {
      const data = { ...edit, date: `${edit.date}T${edit.time || '12:00:00'}` };
      if (edit.id) await api(`posts/${edit.id}`, { method: 'PUT', data }); else await api('posts', { method: 'POST', data });
      await reload(); setEdit(null); notify(edit.status === 'publicado' ? 'Notícia salva e publicada no site.' : 'Rascunho salvo (não aparece no site).');
    } catch (e) { notify(e.message, 'erro'); }
    setBusy(false);
  }
  async function excluir() {
    if (!window.confirm(`Excluir a notícia "${edit.title}"? Não dá para desfazer.`)) return;
    setBusy(true);
    try { await api(`posts/${edit.id}`, { method: 'DELETE' }); await reload(); setEdit(null); notify('Notícia excluída.'); } catch (e) { notify(e.message, 'erro'); }
    setBusy(false);
  }

  if (edit) {
    const t = (label, key, extra = {}) => ({ field: { key, label, type: 'text', ...extra }, value: edit[key], onChange: set(key) });
    return (
      <>
        <header className="p-head p-head--row"><div><h1>{edit.id ? 'Editar notícia' : 'Nova notícia'}</h1></div><button type="button" className="p-btn p-btn--ghost" onClick={() => setEdit(null)}>← Voltar</button></header>
        <div className="p-card p-card--open"><div className="p-card-body">
          <Field {...t('Título', 'title')} />
          <div className="p-field"><label>Categoria<input list="p-cats" value={edit.category} onChange={(e) => set('category')(e.target.value)} placeholder="Ex.: Argaforte" /></label><datalist id="p-cats">{categorias.map((c) => <option key={c} value={c} />)}</datalist><p className="p-help">Escolha uma existente ou digite uma nova.</p></div>
          <div className="p-field"><label>Data<input type="date" value={edit.date} onChange={(e) => set('date')(e.target.value)} /></label></div>
          <Field {...t('Imagem de capa', 'image', { type: 'image', help: 'Horizontal (ex.: 1920×1080).' })} />
          <Field {...t('Descrição da imagem', 'imageAlt', { help: 'Para leitores de tela e buscadores.' })} />
          <Field {...t('Resumo', 'excerpt', { type: 'textarea', help: 'Opcional. Aparece nos buscadores.' })} />
          <Field {...t('Texto', 'content', { type: 'textarea', help: 'Linha em branco separa parágrafos. Use **assim** para negrito.' })} />
          <div className="p-field"><label>Situação<select value={edit.status} onChange={(e) => set('status')(e.target.value)}><option value="publicado">Publicada no site</option><option value="rascunho">Rascunho (não aparece)</option></select></label></div>
          {edit.id ? <Field {...t('Endereço da página', 'slug', { help: 'Mudar o endereço quebra links já compartilhados.' })} /> : null}
        </div></div>
        <div className="p-savebar is-dirty">
          {edit.id ? <button type="button" className="p-btn p-btn--danger" disabled={busy} onClick={excluir}>Excluir</button> : <span />}
          <button type="button" className="p-btn p-btn--primary" disabled={busy} onClick={salvar}>{busy ? 'Salvando…' : 'Salvar notícia'}</button>
        </div>
      </>
    );
  }
  return (
    <>
      <header className="p-head p-head--row"><div><h1>Notícias</h1><p className="p-muted">As 3 mais recentes aparecem na página inicial.</p></div><button type="button" className="p-btn p-btn--primary" onClick={novo}>+ Nova notícia</button></header>
      <div className="p-card p-card--open">
        {posts.length ? posts.map((p) => (
          <button type="button" className="p-row" key={p.id} onClick={() => abrir(p)}>
            <span className="p-row-thumb">{p.image ? <img src={p.image.src} alt="" /> : null}</span>
            <span className="p-row-main"><b>{p.title}</b><small>{new Date(p.date).toLocaleDateString('pt-BR')}{p.categories[0] ? ` · ${p.categories[0].name}` : ''}</small></span>
            <span className={`p-tag ${p.status === 'publicado' ? 'p-tag--ok' : ''}`}>{p.status === 'publicado' ? 'Publicada' : 'Rascunho'}</span>
          </button>
        )) : <p className="p-empty">Nenhuma notícia ainda. Clique em "Nova notícia".</p>}
      </div>
    </>
  );
}

function Acessos({ users, setUsers, me, notify }) {
  const [f, setF] = useState({ name: '', username: '', password: '' });
  const [busy, setBusy] = useState(false);
  async function criar(e) {
    e.preventDefault(); setBusy(true);
    try { await api('users', { method: 'POST', data: f }); setUsers(await api('users')); setF({ name: '', username: '', password: '' }); notify('Acesso criado. A pessoa troca a senha no primeiro login.'); } catch (err) { notify(err.message, 'erro'); }
    setBusy(false);
  }
  async function remover(u) {
    if (!window.confirm(`Remover o acesso de ${u.name}?`)) return;
    try { await api(`users/${u.id}`, { method: 'DELETE' }); setUsers(await api('users')); notify('Acesso removido.'); } catch (err) { notify(err.message, 'erro'); }
  }
  return (
    <>
      <header className="p-head"><h1>Acessos</h1><p className="p-muted">Cada pessoa entra com o próprio usuário e senha.</p></header>
      <div className="p-card p-card--open">
        {users.map((u) => (
          <div className="p-row p-row--static" key={u.id}>
            <span className="p-row-main"><b>{u.name}{u.id === me.id ? ' (você)' : ''}</b><small>{u.username}{u.mustChange ? ' · ainda com senha provisória' : ''}</small></span>
            {u.id !== me.id ? <button type="button" className="p-btn p-btn--ghost" onClick={() => remover(u)}>Remover</button> : null}
          </div>
        ))}
      </div>
      <form className="p-card p-card--open" onSubmit={criar}>
        <div className="p-card-body">
          <h2>Novo acesso</h2>
          <div className="p-field"><label>Nome<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></label></div>
          <div className="p-field"><label>Usuário<input value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} autoCapitalize="none" spellCheck={false} required /></label><p className="p-help">Letras minúsculas, números, ponto ou traço.</p></div>
          <div className="p-field"><label>Senha provisória<input value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="off" required /></label><p className="p-help">Pelo menos 10 caracteres, com letras e números. Passe para a pessoa; ela será obrigada a trocar ao entrar.</p></div>
          <button className="p-btn p-btn--primary" disabled={busy}>{busy ? 'Criando…' : 'Criar acesso'}</button>
        </div>
      </form>
    </>
  );
}

function Senha({ locked, notify }) {
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  async function trocar(e) {
    e.preventDefault();
    if (f.next !== f.confirm) return notify('As senhas novas não são iguais.', 'erro');
    setBusy(true);
    try { await api('password', { method: 'POST', data: f }); if (locked) { window.location.href = '/painel/'; return; } setF({ current: '', next: '', confirm: '' }); notify('Senha alterada.'); } catch (err) { notify(err.message, 'erro'); }
    setBusy(false);
  }
  return (
    <>
      <header className="p-head"><h1>{locked ? 'Crie a sua senha' : 'Minha senha'}</h1><p className="p-muted">{locked ? 'Você entrou com uma senha provisória. Troque-a para liberar o painel.' : 'Troque a senha quando quiser.'}</p></header>
      <form className="p-card p-card--open" onSubmit={trocar}>
        <div className="p-card-body">
          <div className="p-field"><label>Senha atual<input type="password" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} autoComplete="current-password" required /></label></div>
          <div className="p-field"><label>Nova senha<input type="password" value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} autoComplete="new-password" required /></label><p className="p-help">Pelo menos 10 caracteres, com letras e números.</p></div>
          <div className="p-field"><label>Repita a nova senha<input type="password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} autoComplete="new-password" required /></label></div>
          <button className="p-btn p-btn--primary" disabled={busy}>{busy ? 'Salvando…' : 'Trocar senha'}</button>
        </div>
      </form>
    </>
  );
}
