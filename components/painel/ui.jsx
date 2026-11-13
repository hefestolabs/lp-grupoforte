'use client';
import { useEffect, useRef, useState } from 'react';

const PATHS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  news: 'M5 4h11v16H5zM16 8h3v10a2 2 0 0 1-2 2M8 8h5M8 12h5M8 16h5',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M17 11a3 3 0 1 0-1-5.8M17.5 14a5.5 5.5 0 0 1 4 6',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  tag: 'M3 12V4h8l10 10-8 8zM7.5 8.5h.01',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  chevron: 'M6 9l6 6 6-6',
};
export function Ico({ name, size = 18 }) {
  return <svg className="p-ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={PATHS[name]} /></svg>;
}

export const initials = (name) => String(name || '?').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
export function Avatar({ name, size = 40, tone = 'navy' }) {
  return <span className={`p-avatar p-avatar--${tone}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }} aria-hidden="true">{initials(name)}</span>;
}
export const roleName = (u) => (u.admin ? 'Administrador' : 'Editor');

// Círculo de perfil com menu: mostra quem está usando o gerenciador.
export function ProfileMenu({ user, items, onLogout, dark = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div className={`p-profile ${dark ? 'p-profile--dark' : ''}`} ref={ref}>
      <button type="button" className="p-profile-btn" aria-haspopup="menu" aria-expanded={open} aria-label={`Perfil de ${user.name}`} onClick={() => setOpen(!open)}>
        <Avatar name={user.name} size={38} tone={dark ? 'orange' : 'navy'} />
        <span className="p-profile-who"><b>{user.name}</b><small>{roleName(user)}</small></span>
        <Ico name="chevron" size={16} />
      </button>
      {open ? (
        <div className="p-profile-menu" role="menu">
          <div className="p-profile-head">
            <Avatar name={user.name} size={46} />
            <div><b>{user.name}</b><small>{user.email || user.username}</small><span className={`p-badge ${user.admin ? 'p-badge--admin' : ''}`}>{roleName(user)}</span></div>
          </div>
          {items.map(([label, action]) => <button type="button" role="menuitem" key={label} onClick={() => { setOpen(false); action(); }}>{label}</button>)}
          <a role="menuitem" href="/" target="_blank" rel="noopener">Ver o site ↗</a>
          <button type="button" role="menuitem" className="p-profile-out" onClick={onLogout}>Sair</button>
        </div>
      ) : null}
    </div>
  );
}
