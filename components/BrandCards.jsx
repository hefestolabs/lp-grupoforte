import Icon from './Icon';
import { MARCAS } from '@/lib/site';

export default function BrandCards({ variant = 'home' }) {
  return (
    <div className={`brand-grid brand-grid--${variant}`}>
      {MARCAS.map((m, i) => (
        <article className="brand-card" key={m.nome} data-reveal style={{ "--d": `${i * 120}ms` }}>
          <div className="brand-card-img" role="img" aria-label={m.nome} style={{ backgroundImage: `url(${m.img})` }} />
          <div className="brand-card-body">
            <p>{variant === 'produtos' && m.textoProdutos ? m.textoProdutos : m.texto}</p>
            <a className="btn btn-orange btn-block" href={m.href}>
              <span>Ver detalhes</span>
              <Icon name="arrow-up-right" size={15} />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
