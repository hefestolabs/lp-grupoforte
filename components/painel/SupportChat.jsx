'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from './api';
import { RowsSkeleton } from './Skeleton';
import { usePresence } from './ui';

const OLA = 'Olá! Sou o assistente do painel. Posso tirar dúvidas de uso e, se for algo maior, abro uma demanda para a equipe. Como posso ajudar?';
const SUGESTOES = ['Como publico uma notícia?', 'Mudei um texto e não apareceu no site', 'Como troco uma imagem?'];

// Chat de suporte no canto inferior direito. Com a IA ligada, conversa e abre demandas quando precisa;
// sem ela (ou a qualquer momento), a pessoa abre a demanda por um formulário.
export default function SupportChat({ user, screen, admin, goSettings }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('chat'); // chat | form | list
  const [status, setStatus] = useState(null); // { ai, crm, tickets }
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', priority: 'normal' });
  const [sent, setSent] = useState(null); // última demanda aberta pelo formulário
  const end = useRef(null);
  const input = useRef(null);

  const load = () =>
    api('support/tickets')
      .then(setStatus)
      .catch(() => setStatus({ ai: false, crm: false, tickets: [] }));
  useEffect(() => {
    if (open && !status) load();
  }, [open]);
  useEffect(() => {
    if (status && !status.ai && mode === 'chat') setMode('form');
  }, [status]);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [msgs, busy, mode]);
  // Foca o campo principal ao abrir ou trocar de aba, sem tirar o cursor de um campo que a pessoa já está usando.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      if (!document.activeElement?.closest?.('.sc-panel input, .sc-panel textarea, .sc-panel select')) input.current?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [open, mode]);
  useEffect(() => {
    if (!open) return;
    const esc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);

  async function send(value) {
    const content = (value ?? text).trim();
    if (!content || busy) return;
    const next = [...msgs, { role: 'user', content }];
    setMsgs(next);
    setText('');
    setError('');
    setBusy(true);
    try {
      const out = await api('support/chat', { method: 'POST', data: { messages: next.filter((m) => m.role !== 'ticket'), tela: screen } });
      setMsgs([...next, { role: 'assistant', content: out.reply }, ...(out.ticket ? [{ role: 'ticket', ...out.ticket }] : [])]);
      if (out.ticket) load();
    } catch (e) {
      setError(e.message);
      setMsgs(next);
    }
    setBusy(false);
  }
  async function submitForm(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const transcript = msgs
        .filter((m) => m.role !== 'ticket')
        .map((m) => `${m.role === 'user' ? user.name : 'Assistente'}: ${m.content}`)
        .join('\n\n');
      const out = await api('support/ticket', { method: 'POST', data: { ...form, transcript } });
      setMsgs((m) => [...m, { role: 'ticket', id: out.id, crm: out.crm }]);
      setForm({ title: '', description: '', priority: 'normal' });
      setSent(out);
      load();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }
  const key = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
  const mine = status?.tickets || [];
  const [mounted, shown] = usePresence(open, 160);

  return (
    <div className="sc">
      {mounted ? (
        <section className="sc-panel" data-shown={shown} role="dialog" aria-label="Suporte do painel">
          <header className="sc-head">
            <span className="sc-dot" aria-hidden="true" />
            <div>
              <b>Suporte</b>
              <small>{status?.ai ? 'Assistente com IA · Hefesto Labs' : 'Hefesto Labs'}</small>
            </div>
            <button type="button" className="sc-x" aria-label="Fechar o suporte" onClick={() => setOpen(false)}>
              ✕
            </button>
          </header>
          <nav className="sc-tabs">
            {status?.ai ? (
              <button type="button" className={mode === 'chat' ? 'is-active' : ''} onClick={() => setMode('chat')}>
                Conversa
              </button>
            ) : null}
            <button type="button" className={mode === 'form' ? 'is-active' : ''} onClick={() => setMode('form')}>
              Abrir demanda
            </button>
            <button type="button" className={mode === 'list' ? 'is-active' : ''} onClick={() => setMode('list')}>
              {admin ? 'Demandas' : 'Minhas demandas'}
              {mine.length ? ` (${mine.length})` : ''}
            </button>
          </nav>

          {mode === 'chat' ? (
            <>
              <div className="sc-body" aria-live="polite">
                <p className="sc-msg sc-msg--bot">{OLA}</p>
                {!msgs.length ? (
                  <div className="sc-sug">
                    {SUGESTOES.map((s) => (
                      <button type="button" key={s} onClick={() => send(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}
                {msgs.map((m, i) =>
                  m.role === 'ticket' ? (
                    <p className="sc-ticket" key={i}>
                      <b>Demanda #{m.id} aberta</b>
                      {m.crm === 'enviado' ? 'Enviada para a equipe de suporte.' : 'Registrada. A equipe de suporte foi avisada.'}
                    </p>
                  ) : (
                    <p className={`sc-msg sc-msg--${m.role === 'user' ? 'me' : 'bot'}`} key={i}>
                      {m.content}
                    </p>
                  ),
                )}
                {busy ? (
                  <p className="sc-msg sc-msg--bot sc-typing" role="status" aria-label="Assistente escrevendo">
                    <i />
                    <i />
                    <i />
                  </p>
                ) : null}
                {error ? (
                  <p className="sc-error" role="alert">
                    {error}{' '}
                    <button type="button" onClick={() => setMode('form')}>
                      Abrir demanda
                    </button>
                  </p>
                ) : null}
                <span ref={end} />
              </div>
              <form
                className="sc-input"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <textarea
                  ref={input}
                  rows={1}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={key}
                  placeholder="Escreva a sua dúvida…"
                  aria-label="Mensagem para o suporte"
                  maxLength={4000}
                />
                <button type="submit" className="sc-send" disabled={busy || !text.trim()} aria-label="Enviar">
                  ➤
                </button>
              </form>
            </>
          ) : null}

          {mode === 'form' ? (
            <form className="sc-body sc-form" onSubmit={submitForm}>
              {sent ? (
                <p className="sc-ticket" role="status">
                  <b>Demanda #{sent.id} aberta</b>
                  {sent.crm === 'enviado' ? 'Enviada para a equipe de suporte.' : 'Registrada. A equipe de suporte dará retorno.'}
                </p>
              ) : null}
              {status && !status.ai ? (
                <p className="sc-note">
                  {admin ? (
                    <>
                      O assistente com IA ainda não está ligado.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          goSettings();
                        }}
                      >
                        Configurar agora
                      </button>
                    </>
                  ) : (
                    'Descreva o problema e a equipe de suporte dará retorno.'
                  )}
                </p>
              ) : (
                <p className="sc-note">A demanda vai direto para a equipe de suporte.</p>
              )}
              <label>
                Assunto
                <input ref={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} required />
              </label>
              <label>
                O que aconteceu?
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="O que você tentou fazer, em que tela e o que apareceu."
                  maxLength={4000}
                  required
                />
              </label>
              <label>
                Urgência
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="baixa">Baixa — melhoria ou sugestão</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta — algo importante não funciona</option>
                  <option value="urgente">Urgente — site fora do ar</option>
                </select>
              </label>
              {error ? (
                <p className="sc-error" role="alert">
                  {error}
                </p>
              ) : null}
              <button type="submit" className="p-btn p-btn--primary" disabled={busy} data-busy={busy || undefined}>
                {busy ? 'Enviando…' : sent ? 'Enviar outra demanda' : 'Enviar demanda'}
              </button>
              <span ref={end} />
            </form>
          ) : null}

          {mode === 'list' ? (
            <div className="sc-body sc-list">
              {!status ? (
                <RowsSkeleton rows={3} />
              ) : mine.length ? (
                mine.map((t) => (
                  <div className="sc-item" key={t.id}>
                    <b>
                      #{t.id} · {t.title}
                    </b>
                    <small>
                      {new Date(String(t.at).replace(' ', 'T')).toLocaleDateString('pt-BR')}
                      {admin ? ` · ${t.by}` : ''} · prioridade {t.priority}
                    </small>
                    <span className={`sc-crm sc-crm--${t.crm}`}>
                      {t.crm === 'enviado'
                        ? 'Enviada ao suporte'
                        : t.crm === 'erro'
                          ? admin
                            ? `Falha ao enviar ao CRM (${t.crmDetail})`
                            : 'Registrada'
                          : admin
                            ? 'Guardada no painel (CRM não configurado)'
                            : 'Registrada'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="sc-note">Nenhuma demanda aberta ainda.</p>
              )}
            </div>
          ) : null}
        </section>
      ) : null}
      <button type="button" className="sc-fab" aria-expanded={open} aria-label={open ? 'Fechar o suporte' : 'Abrir o suporte'} onClick={() => setOpen(!open)}>
        {open ? (
          <span aria-hidden="true">✕</span>
        ) : (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.7-5.2A8.5 8.5 0 1 1 21 12z" />
            <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
          </svg>
        )}
      </button>
    </div>
  );
}
