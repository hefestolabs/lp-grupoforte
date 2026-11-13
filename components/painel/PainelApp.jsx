'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { Field } from './Fields';
import Editor from './Editor';

const hoje = () => new Date().toISOString().slice(0, 10);

export default function PainelApp({ storeMode, user, schema, initialContent, initialPosts, initialUsers }) {
  const [tab, setTab] = useState(user.mustChange ? 'senha' : 'editor');
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(initialContent);
  const [posts, setPosts] = useState(initialPosts);
  const [users, setUsers] = useState(initialUsers);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const [startNew, setStartNew] = useState(0); // abre Notícias já no formulário de nova notícia
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

  const nav = [['editor', 'Editar o site'], ['noticias', 'Notícias'], ...(user.admin ? [['acessos', 'Acessos'], ['email', 'E-mail (Resend)']] : []), ['senha', 'Minha conta']];

  if (tab === 'editor') {
    return (
      <>
        <Editor schema={schema} content={content} setContent={setContent} saved={saved} setSaved={setSaved} notify={notify} user={user} goTab={(t) => { const [name, mode] = t.split(':'); setStartNew(mode === 'nova' ? Date.now() : 0); setTab(name); window.scrollTo(0, 0); }} logout={logout} />
        {storeMode !== 'mysql' ? <p className="p-error p-aviso ed-aviso" role="alert">Atenção: o banco de dados não está conectado. As alterações se perdem na próxima publicação do site.</p> : null}
        {toast ? <div className={`p-toast p-toast--${toast.kind}`} role="status">{toast.text}</div> : null}
      </>
    );
  }

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

        {tab === 'noticias' ? <Noticias posts={posts} setPosts={setPosts} notify={notify} startNew={startNew} /> : null}
        {user.admin && tab === 'acessos' ? <Acessos users={users} setUsers={setUsers} me={user} notify={notify} go={go} /> : null}
        {user.admin && tab === 'email' ? <Email me={user} notify={notify} go={go} /> : null}
        {tab === 'senha' ? <Conta me={user} locked={locked} notify={notify} /> : null}
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
        {user.admin ? <button type="button" className="p-tile" onClick={() => go('acessos')}><b>Acessos</b><span>Quem pode entrar no painel</span></button> : null}
      </div>
    </>
  );
}

function Noticias({ posts, setPosts, notify, startNew }) {
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);
  const categorias = useMemo(() => [...new Set(posts.map((p) => p.categories[0]?.name).filter(Boolean))], [posts]);
  const novo = () => setEdit({ title: '', category: '', date: hoje(), image: '', imageAlt: '', excerpt: '', content: '', status: 'publicado', slug: '' });
  const abrir = (p) => setEdit({ id: p.id, title: p.title, category: p.categories[0]?.name || '', date: p.date.slice(0, 10), time: p.date.slice(11, 19), image: p.image?.src || '', imageAlt: p.image?.alt || '', excerpt: p.excerpt, content: p.content, status: p.status, slug: p.slug });
  const set = (k) => (v) => setEdit((e) => ({ ...e, [k]: v }));
  useEffect(() => { if (startNew) novo(); }, [startNew]);
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
        <div className="p-post">
          <div className="p-post-main">
            <div className="p-card p-card--open"><div className="p-card-body">
              <div className="p-field p-field--title"><label>Título<input value={edit.title} onChange={(e) => set('title')(e.target.value)} placeholder="Digite o título da notícia" /></label></div>
              <Field {...t('Texto', 'content', { type: 'textarea', help: 'Linha em branco separa parágrafos. Use **assim** para negrito.' })} />
              <Field {...t('Resumo', 'excerpt', { type: 'textarea', help: 'Opcional. Uma ou duas frases; aparece nos buscadores.' })} />
            </div></div>
          </div>
          <aside className="p-post-side">
            <div className="p-card p-card--open"><div className="p-card-body">
              <h2>Publicação</h2>
              <div className="p-field"><label>Situação<select value={edit.status} onChange={(e) => set('status')(e.target.value)}><option value="publicado">Publicada no site</option><option value="rascunho">Rascunho (não aparece)</option></select></label></div>
              <div className="p-field"><label>Data<input type="date" value={edit.date} onChange={(e) => set('date')(e.target.value)} /></label></div>
            </div></div>
            <div className="p-card p-card--open"><div className="p-card-body">
              <h2>Tema</h2>
              <div className="p-field"><label>Tema (categoria)<input list="p-cats" value={edit.category} onChange={(e) => set('category')(e.target.value)} placeholder="Ex.: Argaforte" /></label><datalist id="p-cats">{categorias.map((c) => <option key={c} value={c} />)}</datalist><p className="p-help">Escolha um existente ou digite um novo.</p></div>
              {categorias.length ? <div className="p-chips">{categorias.map((c) => <button type="button" key={c} className={edit.category === c ? 'is-active' : ''} onClick={() => set('category')(c)}>{c}</button>)}</div> : null}
            </div></div>
            <div className="p-card p-card--open"><div className="p-card-body">
              <h2>Imagem de capa</h2>
              <Field {...t('Imagem', 'image', { type: 'image', help: 'Horizontal (ex.: 1920×1080).' })} />
              <Field {...t('Descrição da imagem', 'imageAlt', { help: 'Para leitores de tela e buscadores.' })} />
            </div></div>
            {edit.id ? <div className="p-card p-card--open"><div className="p-card-body"><Field {...t('Endereço da página', 'slug', { help: 'Mudar o endereço quebra links já compartilhados.' })} /></div></div> : null}
          </aside>
        </div>
        <div className="p-savebar is-dirty">
          {edit.id ? <button type="button" className="p-btn p-btn--danger" disabled={busy} onClick={excluir}>Excluir</button> : <span />}
          <button type="button" className="p-btn p-btn--primary" disabled={busy} onClick={salvar}>{busy ? 'Salvando…' : edit.status === 'publicado' ? (edit.id ? 'Atualizar notícia' : 'Publicar notícia') : 'Salvar rascunho'}</button>
        </div>
      </>
    );
  }
  return (
    <>
      <header className="p-head p-head--row"><div><h1>Notícias</h1><p className="p-muted">Notícias e insights do site. As 3 mais recentes aparecem na página inicial.</p></div><button type="button" className="p-btn p-btn--primary" onClick={novo}>+ Nova notícia</button></header>
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

function Acessos({ users, setUsers, me, notify, go }) {
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [mail, setMail] = useState(null);
  useEffect(() => { api('mail').then(setMail).catch(() => setMail({ ready: false })); }, []);
  async function criar(e) {
    e.preventDefault(); setBusy(true);
    try {
      const out = await api('users', { method: 'POST', data: f }); setUsers(await api('users')); setF({ name: '', email: '', password: '' });
      notify(out.invited ? 'Acesso criado. Enviamos um e-mail para a pessoa criar a senha.' : 'Acesso criado. A pessoa troca a senha no primeiro login.');
    } catch (err) { notify(err.message, 'erro'); }
    setBusy(false);
  }
  async function remover(u) {
    if (!window.confirm(`Remover o acesso de ${u.name}?`)) return;
    try { await api(`users/${u.id}`, { method: 'DELETE' }); setUsers(await api('users')); notify('Acesso removido.'); } catch (err) { notify(err.message, 'erro'); }
  }
  return (
    <>
      <header className="p-head"><h1>Acessos</h1><p className="p-muted">Cada pessoa entra com o próprio e-mail e senha. Os acessos criados aqui só editam o conteúdo: não veem esta tela nem a de E-mail (Resend).</p></header>
      <div className="p-card p-card--open">
        {users.map((u) => (
          <div className="p-row p-row--static" key={u.id}>
            <span className="p-row-main"><b>{u.name}{u.id === me.id ? ' (você)' : ''}{u.admin ? ' · administrador' : ''}</b><small>{u.email || `${u.username} · sem e-mail cadastrado`}{u.mustChange ? ' · ainda com senha provisória' : ''}</small></span>
            {u.id !== me.id ? <button type="button" className="p-btn p-btn--ghost" onClick={() => remover(u)}>Remover</button> : null}
          </div>
        ))}
      </div>
      <form className="p-card p-card--open" onSubmit={criar}>
        <div className="p-card-body">
          <h2>Novo acesso</h2>
          <div className="p-field"><label>Nome<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></label></div>
          <div className="p-field"><label>E-mail<input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoCapitalize="none" spellCheck={false} required /></label></div>
          {mail?.ready ? <p className="p-help">A pessoa recebe um e-mail com um link para criar a própria senha (vale 48 horas).</p> : (
            <>
              <div className="p-field"><label>Senha provisória<input value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="off" required /></label><p className="p-help">Pelo menos 10 caracteres, com letras e números. Passe para a pessoa; ela será obrigada a trocar ao entrar.</p></div>
              <p className="p-help">Para convidar por e-mail em vez de combinar uma senha, <button type="button" className="p-linklike" onClick={() => go('email')}>configure o envio de e-mails</button>.</p>
            </>
          )}
          <button className="p-btn p-btn--primary" disabled={busy}>{busy ? 'Criando…' : mail?.ready ? 'Criar acesso e enviar convite' : 'Criar acesso'}</button>
        </div>
      </form>
    </>
  );
}

function Email({ me, notify, go }) {
  const [cfg, setCfg] = useState(null);
  const [f, setF] = useState({ apiKey: '', from: '', siteUrl: '' });
  const [busy, setBusy] = useState(false);
  useEffect(() => { api('mail').then((c) => { setCfg(c); setF({ apiKey: '', from: c.from, siteUrl: c.siteUrl }); }).catch((e) => notify(e.message, 'erro')); }, []);
  async function salvar(e) {
    e.preventDefault(); setBusy(true);
    try { const c = await api('mail', { method: 'PUT', data: f }); setCfg(c); setF({ apiKey: '', from: c.from, siteUrl: c.siteUrl }); notify('Configuração de e-mail salva.'); } catch (err) { notify(err.message, 'erro'); }
    setBusy(false);
  }
  async function remover() {
    if (!window.confirm('Remover a chave do Resend? A recuperação de senha por e-mail deixa de funcionar.')) return;
    try { const c = await api('mail', { method: 'PUT', data: { removeKey: true } }); setCfg(c); notify('Chave removida.'); } catch (err) { notify(err.message, 'erro'); }
  }
  async function testar() {
    setBusy(true);
    try { const out = await api('mail-test', { method: 'POST' }); notify(`E-mail de teste enviado para ${out.to}.`); } catch (err) { notify(err.message, 'erro'); }
    setBusy(false);
  }
  if (!cfg) return <header className="p-head"><h1>E-mail (Resend)</h1><p className="p-muted">Carregando…</p></header>;
  return (
    <>
      <header className="p-head"><h1>E-mail (Resend)</h1><p className="p-muted">Usado para recuperar senha e convidar novos acessos.</p></header>
      <p className={`p-status ${cfg.ready ? 'p-status--ok' : ''}`}>{cfg.ready ? 'Envio de e-mails ativo.' : cfg.hasKey ? 'Falta informar o remetente.' : 'Envio de e-mails desativado: falta a chave do Resend.'}</p>
      <form className="p-card p-card--open" onSubmit={salvar}>
        <div className="p-card-body">
          <div className="p-field">
            <label>Chave de API do Resend<input type="password" value={f.apiKey} onChange={(e) => setF({ ...f, apiKey: e.target.value })} autoComplete="off" spellCheck={false} placeholder={cfg.hasKey ? `Chave salva (${cfg.keyHint}). Deixe vazio para manter.` : 're_…'} /></label>
            <p className="p-help">A chave vai direto do seu navegador para o servidor do site, fica cifrada no banco e nunca mais é exibida. Crie uma em resend.com → API Keys, com permissão só de envio ("Sending access").</p>
            {cfg.hasKey ? <button type="button" className="p-btn p-btn--danger" onClick={remover}>Remover a chave salva</button> : null}
          </div>
          <div className="p-field"><label>Remetente<input value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} placeholder="Grupo Forte <painel@seudominio.com.br>" spellCheck={false} /></label><p className="p-help">O domínio do endereço precisa estar verificado no Resend (resend.com → Domains).</p></div>
          <div className="p-field"><label>Endereço do site<input value={f.siteUrl} onChange={(e) => setF({ ...f, siteUrl: e.target.value })} spellCheck={false} /></label><p className="p-help">Usado nos links dos e-mails. Atualize quando o site ganhar o domínio definitivo.</p></div>
          <button className="p-btn p-btn--primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
        </div>
      </form>
      <div className="p-card p-card--open"><div className="p-card-body">
        <h2>Testar o envio</h2>
        {me.email ? <p className="p-muted">Envia um e-mail de teste para {me.email}.</p> : <p className="p-muted">Cadastre o seu e-mail em <button type="button" className="p-linklike" onClick={() => go('senha')}>Minha conta</button> para receber o teste.</p>}
        <button type="button" className="p-btn" disabled={busy || !cfg.ready || !me.email} onClick={testar}>Enviar e-mail de teste</button>
      </div></div>
    </>
  );
}

function Conta({ me, locked, notify }) {
  const [a, setA] = useState({ name: me.name, email: me.email, current: '' });
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  async function salvarConta(e) {
    e.preventDefault(); setBusy(true);
    try { await api('account', { method: 'PUT', data: a }); notify('Dados da conta salvos.'); setTimeout(() => window.location.reload(), 800); } catch (err) { notify(err.message, 'erro'); }
    setBusy(false);
  }
  async function trocar(e) {
    e.preventDefault();
    if (f.next !== f.confirm) return notify('As senhas novas não são iguais.', 'erro');
    setBusy(true);
    try { await api('password', { method: 'POST', data: f }); if (locked) { window.location.href = '/painel/'; return; } setF({ current: '', next: '', confirm: '' }); notify('Senha alterada.'); } catch (err) { notify(err.message, 'erro'); }
    setBusy(false);
  }
  return (
    <>
      <header className="p-head"><h1>{locked ? 'Crie a sua senha' : 'Minha conta'}</h1><p className="p-muted">{locked ? 'Você entrou com uma senha provisória. Troque-a para liberar o painel.' : 'Seu e-mail é o seu login e é para onde vai o link de recuperação de senha.'}</p></header>
      {!locked ? (
        <form className="p-card p-card--open" onSubmit={salvarConta}>
          <div className="p-card-body">
            <h2>Nome e e-mail</h2>
            <div className="p-field"><label>Nome<input value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} required /></label></div>
            <div className="p-field"><label>E-mail<input type="email" value={a.email} onChange={(e) => setA({ ...a, email: e.target.value })} autoCapitalize="none" spellCheck={false} required /></label></div>
            <div className="p-field"><label>Senha atual (para confirmar)<input type="password" value={a.current} onChange={(e) => setA({ ...a, current: e.target.value })} autoComplete="current-password" required /></label></div>
            <button className="p-btn p-btn--primary" disabled={busy}>Salvar dados</button>
          </div>
        </form>
      ) : null}
      <form className="p-card p-card--open" onSubmit={trocar}>
        <div className="p-card-body">
          <h2>Senha</h2>
          <div className="p-field"><label>Senha atual<input type="password" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} autoComplete="current-password" required /></label></div>
          <div className="p-field"><label>Nova senha<input type="password" value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} autoComplete="new-password" required /></label><p className="p-help">Pelo menos 10 caracteres, com letras e números.</p></div>
          <div className="p-field"><label>Repita a nova senha<input type="password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} autoComplete="new-password" required /></label></div>
          <button className="p-btn p-btn--primary" disabled={busy}>{busy ? 'Salvando…' : 'Trocar senha'}</button>
        </div>
      </form>
    </>
  );
}
