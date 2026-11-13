'use client';
import { useEffect, useRef, useState } from 'react';

export const iniciais = (nome) => {
  const p = String(nome || '').trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] || '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase() || '?';
};
export const papel = (u) => (u.admin ? 'Administrador' : 'Editor');

// Círculo com as iniciais de quem está usando o painel.
export function Avatar({ name, size = 40, tone = 'navy' }) {
  return <span className={`pf-avatar pf-avatar--${tone}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }} aria-hidden="true">{iniciais(name)}</span>;
}

// Círculo de perfil com menu: mostra quem está acessando e os atalhos da conta.
// items: [{ label, onClick?, href?, disabled? }]
export function ProfileMenu({ user, items = [], logout, compact = false, dark = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const out = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', out); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div className={`pf ${dark ? 'pf--dark' : ''} ${compact ? 'pf--compact' : ''}`} ref={ref}>
      <button type="button" className="pf-btn" aria-haspopup="menu" aria-expanded={open} aria-label={`Conta de ${user.name}`} title={`${user.name} · ${papel(user)}`} onClick={() => setOpen(!open)}>
        <Avatar name={user.name} tone={dark ? 'orange' : 'navy'} />
        {compact ? null : <span className="pf-who"><b>{user.name}</b><small>{papel(user)}</small></span>}
        {compact ? null : <svg className="pf-caret" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </button>
      {open ? (
        <div className="pf-menu" role="menu">
          <div className="pf-menu-head">
            <Avatar name={user.name} size={44} />
            <span className="pf-who"><b>{user.name}</b><small>{user.email || user.username}</small><em>{papel(user)}</em></span>
          </div>
          {items.map((it) => it.href
            ? <a key={it.label} role="menuitem" href={it.href} target="_blank" rel="noopener" onClick={() => setOpen(false)}>{it.label}</a>
            : <button key={it.label} type="button" role="menuitem" disabled={it.disabled} onClick={() => { setOpen(false); it.onClick(); }}>{it.label}</button>)}
          <button type="button" role="menuitem" className="pf-out" onClick={logout}>Sair</button>
        </div>
      ) : null}
    </div>
  );
}
