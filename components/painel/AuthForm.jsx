'use client';
import { useState } from 'react';
import { api } from './api';

export default function AuthForm({ mode }) {
  const setup = mode === 'setup';
  const [f, setF] = useState({ name: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setError('');
    if (setup && f.password !== f.confirm) return setError('As senhas não são iguais.');
    setBusy(true);
    try {
      if (setup) await api('setup', { method: 'POST', data: { name: f.name, username: f.username, password: f.password } });
      await api('login', { method: 'POST', data: { username: f.username, password: f.password } });
      window.location.href = '/painel/';
    } catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <main className="p-auth">
      <form className="p-auth-card" onSubmit={submit}>
        <img src="/img/logo-azul.png" alt="Grupo Forte" width="206" height="26" />
        <h1>{setup ? 'Criar o primeiro acesso' : 'Painel do site'}</h1>
        <p className="p-muted">{setup ? 'Este acesso poderá criar os demais.' : 'Entre para atualizar o conteúdo do site.'}</p>
        {setup ? <label>Nome<input value={f.name} onChange={set('name')} autoComplete="name" required /></label> : null}
        <label>Usuário<input value={f.username} onChange={set('username')} autoComplete="username" autoCapitalize="none" spellCheck={false} required /></label>
        <label>Senha<input type="password" value={f.password} onChange={set('password')} autoComplete={setup ? 'new-password' : 'current-password'} required /></label>
        {setup ? <label>Repita a senha<input type="password" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" required /></label> : null}
        {setup ? <p className="p-help">Pelo menos 10 caracteres, com letras e números.</p> : null}
        {error ? <p className="p-error" role="alert">{error}</p> : null}
        <button className="p-btn p-btn--primary" disabled={busy}>{busy ? 'Aguarde…' : setup ? 'Criar acesso e entrar' : 'Entrar'}</button>
      </form>
    </main>
  );
}
