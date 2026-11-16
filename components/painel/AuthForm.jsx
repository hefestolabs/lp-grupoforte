'use client';
import { useState } from 'react';
import { api } from './api';

// Telas sem login: entrar, primeiro acesso, pedir redefinição e criar nova senha.
export default function AuthForm({ mode, u, t }) {
  const [f, setF] = useState({ name: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const newPw = mode === 'setup' || mode === 'reset';

  async function submit(e) {
    e.preventDefault(); setError('');
    if (newPw && f.password !== f.confirm) return setError('As senhas não são iguais.');
    setBusy(true);
    try {
      if (mode === 'recover') { await api('recover', { method: 'POST', data: { email: f.username } }); setDone('Se esse e-mail tiver acesso ao painel, enviamos um link para criar uma nova senha. Ele vale por 30 minutos.'); setBusy(false); return; }
      if (mode === 'reset') { await api('reset', { method: 'POST', data: { u, t, password: f.password } }); setDone('Senha criada. Agora é só entrar.'); setBusy(false); return; }
      if (mode === 'setup') await api('setup', { method: 'POST', data: { name: f.name, username: f.username, password: f.password } });
      await api('login', { method: 'POST', data: { username: f.username, password: f.password } });
      // Cada login começa pela abertura: apaga a escolha de site e a marca de vinheta já vista nesta aba.
      try { sessionStorage.removeItem('gf-site'); sessionStorage.removeItem('gf-intro'); } catch {}
      window.location.href = '/painel/';
    } catch (err) { setError(err.message); setBusy(false); }
  }

  const titles = { login: ['Bem-vindo de volta', 'Entre para continuar.'], setup: ['Criar o primeiro acesso', 'Este acesso poderá criar os demais.'], recover: ['Esqueci minha senha', 'Informe o seu e-mail e enviaremos um link para criar uma nova senha.'], reset: ['Criar nova senha', 'Escolha a senha que você vai usar no painel.'] };
  const button = { login: 'Entrar', setup: 'Criar acesso e entrar', recover: 'Enviar link', reset: 'Salvar senha' }[mode];

  return (
    <main className="p-auth">
      <form className="p-auth-card" onSubmit={submit}>
        <img src="/img/logo-azul.png" alt="Grupo Forte" width="206" height="26" />
        <h1>{titles[mode][0]}</h1>
        <p className="p-muted">{titles[mode][1]}</p>
        {done ? (
          <><p className="p-ok" role="status">{done}</p><a className="p-btn p-btn--primary" href="/painel/login/">Ir para o login</a></>
        ) : (
          <>
            {mode === 'setup' ? <label><span className="sr-only">Nome</span><input value={f.name} onChange={set('name')} autoComplete="name" placeholder="Nome" required /></label> : null}
            {mode !== 'reset' ? <label><span className="sr-only">E-mail</span><input type={mode === 'login' ? 'text' : 'email'} inputMode="email" value={f.username} onChange={set('username')} autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="E-mail" required /></label> : null}
            {mode !== 'recover' ? <label><span className="sr-only">{newPw ? 'Nova senha' : 'Senha'}</span><input type="password" value={f.password} onChange={set('password')} autoComplete={newPw ? 'new-password' : 'current-password'} placeholder={newPw ? 'Nova senha' : 'Senha'} required /></label> : null}
            {newPw ? <label><span className="sr-only">Repita a senha</span><input type="password" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" placeholder="Repita a senha" required /></label> : null}
            {newPw ? <p className="p-help">Pelo menos 10 caracteres, com letras e números.</p> : null}
            {mode === 'login' ? <a className="p-auth-forgot" href="/painel/recuperar/">Esqueci a senha</a> : null}
            {error ? <p className="p-error" role="alert">{error}</p> : null}
            <button className="p-btn p-btn--primary" disabled={busy} data-busy={busy || undefined}>{busy ? 'Aguarde…' : button}</button>
            {mode === 'recover' || mode === 'reset' ? <a className="p-auth-link" href="/painel/login/">Voltar para o login</a> : null}
          </>
        )}
      </form>
    </main>
  );
}
