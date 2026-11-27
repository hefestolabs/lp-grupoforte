'use client';
import { useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';

export default function Header({ nav, whatsapp }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <Link href="/" className="header-logo" aria-label="Grupo Forte — página inicial">
        <img src="/img/logo-azul.png" alt="Grupo Forte" width="206" height="26" />
      </Link>
      <div className="header-right">
        <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Menu principal">
          <ul>
            {nav.map((n) => (
              <li key={n.label}>
                {n.external ? (
                  <a href={n.href} data-page={n.page}>{n.label}</a>
                ) : (
                  <Link href={n.href} data-page={n.page} onClick={() => setOpen(false)}>{n.label}</Link>
                )}
              </li>
            ))}
            <li className="nav-cta">
              {whatsapp ? (
                <a className="btn btn-cta" href={whatsapp}>
                  <span>Entre em contato</span>
                  <Icon name="e-fas-phone-square-alt" size={16} />
                </a>
              ) : null}
            </li>
          </ul>
        </nav>
        <button className="nav-toggle" type="button" aria-expanded={open} aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen(!open)}>
          <Icon name={open ? 'bar-sort-right' : 'bars'} size={24} />
        </button>
        {whatsapp ? (
          <a className="btn btn-cta header-cta" href={whatsapp}>
            <span>Entre em contato</span>
            <Icon name="e-fas-phone-square-alt" size={16} />
          </a>
        ) : null}
      </div>
    </header>
  );
}
