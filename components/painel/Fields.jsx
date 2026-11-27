'use client';
import { useRef, useState } from 'react';
import { upload } from './api';
import { Img, Progress } from './ui';

function ImageField({ value, onChange }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pct, setPct] = useState(0);
  async function pick(e) {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    setBusy(true); setError(''); setPct(0);
    try { onChange(await upload(file, setPct)); } catch (err) { setError(err.message); }
    setBusy(false);
  }
  return (
    <div className="p-image">
      <div className="p-image-thumb">{value ? <Img src={value} /> : <span>Sem imagem</span>}</div>
      <div className="p-image-actions">
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={pick} />
        <button type="button" className="p-btn" disabled={busy} data-busy={busy || undefined} onClick={() => input.current.click()}>{busy ? `Enviando… ${Math.round(pct * 100)}%` : value ? 'Trocar imagem' : 'Enviar imagem'}</button>
        {value ? <button type="button" className="p-btn p-btn--ghost" onClick={() => onChange('')}>Remover</button> : null}
        {busy ? <Progress value={pct} label="Envio da imagem" /> : null}
        {error ? <p className="p-error" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}

function ListField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState(-1);
  const blank = () => Object.fromEntries(field.campos.map((c) => [c.key, c.type === 'number' ? 0 : c.type === 'select' ? c.opcoes[0][0] : '']));
  const move = (i, d) => { const n = [...items]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; onChange(n); setOpen(open === i ? j : open); };
  return (
    <div className="p-list">
      {items.map((item, i) => (
        <div className={`p-list-item ${open === i ? 'is-open' : ''}`} key={i}>
          <div className="p-list-head">
            <button type="button" className="p-list-title" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              {item.img ? <Img src={item.img} /> : null}
              <span>{item[field.rotulo] || `${field.nomeItem} ${i + 1}`}</span>
            </button>
            <button type="button" className="p-icon-btn" aria-label="Subir" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
            <button type="button" className="p-icon-btn" aria-label="Descer" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</button>
            <button type="button" className="p-icon-btn p-danger" aria-label={`Remover ${field.nomeItem}`} onClick={() => { if (window.confirm(`Remover este ${field.nomeItem}?`)) { onChange(items.filter((_, k) => k !== i)); setOpen(-1); } }}>✕</button>
          </div>
          {open === i ? (
            <div className="p-list-body">
              {field.campos.map((c) => <Field key={c.key} field={c} value={item[c.key]} onChange={(v) => onChange(items.map((x, k) => (k === i ? { ...x, [c.key]: v } : x)))} />)}
            </div>
          ) : null}
        </div>
      ))}
      <button type="button" className="p-btn" onClick={() => { onChange([...items, blank()]); setOpen(items.length); }}>+ Adicionar {field.nomeItem}</button>
    </div>
  );
}

// `hidden` e `onToggleHidden` (opcionais): botão para ocultar a informação no site sem apagar o valor.
export function Field({ field, value, onChange, hidden = false, onToggleHidden }) {
  let control;
  if (field.type === 'image') control = <ImageField value={value || ''} onChange={onChange} />;
  else if (field.type === 'list') control = <ListField field={field} value={value} onChange={onChange} />;
  else if (field.type === 'textarea') control = <textarea rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  else if (field.type === 'select') control = <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>{field.opcoes.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>;
  else if (field.type === 'number') control = <input type="number" min="0" value={value ?? 0} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />;
  else control = <input type={field.type === 'url' ? 'text' : 'text'} inputMode={field.type === 'url' ? 'url' : undefined} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.type === 'url' ? 'https://…' : undefined} />;
  const simple = field.type !== 'image' && field.type !== 'list';
  return (
    <div className={`p-field p-field--${field.type} ${hidden ? 'is-hidden' : ''}`}>
      {onToggleHidden && field.type !== 'number' ? (
        <button type="button" className="p-hide" aria-pressed={hidden} onClick={onToggleHidden} title={hidden ? 'Voltar a mostrar no site' : 'Deixar de mostrar no site, sem apagar'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {hidden ? <><path d="M3 3l18 18" /><path d="M10.6 5.1A10 10 0 0 1 12 5c5.5 0 9 7 9 7a16 16 0 0 1-2.6 3.4M6.6 6.6C4.1 8.3 3 12 3 12s3.5 7 9 7a9.6 9.6 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></> : <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>}
          </svg>
          {hidden ? 'Oculto no site · Mostrar' : 'Ocultar no site'}
        </button>
      ) : null}
      {simple ? <label>{field.label}{control}</label> : <><span className="p-label">{field.label}</span>{control}</>}
      {hidden ? <p className="p-hidden-note">Esta informação não aparece no site. O conteúdo continua salvo.</p> : null}
      {field.help ? <p className="p-help">{field.help}</p> : null}
    </div>
  );
}
