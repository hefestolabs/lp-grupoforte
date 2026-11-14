import Icon from './Icon';

export default function BrandCards({ marcas, variant = 'home' }) {
  return (
    <div className={`brand-grid brand-grid--${variant}`} data-edit="home:marcas">
      {marcas.map((m, i) => (
        <article className="brand-card" key={m.nome} data-reveal style={{ '--d': `${i * 120}ms` }}>
          <div className="brand-card-img" role="img" aria-label={m.nome} style={{ backgroundImage: `url(${m.img})` }} />
          <div className="brand-card-body">
            <p>{m.texto}</p>
            <a className="btn btn-orange btn-block" href={m.link}>
              <span>Ver detalhes</span>
              <Icon name="arrow-up-right" size={15} />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
