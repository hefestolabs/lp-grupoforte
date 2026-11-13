'use client';
import { useState } from 'react';
import Icon from './Icon';

export default function Accordion({ items }) {
  const [open, setOpen] = useState({});
  return (
    <div className="accordion">
      {items.map((it, i) => (
        <div className={`accordion-item ${open[i] ? 'is-open' : ''}`} key={it.title}>
          <button type="button" aria-expanded={!!open[i]} aria-controls={`acc-${i}`} onClick={() => setOpen({ ...open, [i]: !open[i] })}>
            <span>{it.title}</span>
            <Icon name={open[i] ? 'arrow-down-right' : 'arrow-up-right'} size={23} />
          </button>
          <div id={`acc-${i}`} className="accordion-panel" hidden={!open[i]}>
            <p>{it.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
