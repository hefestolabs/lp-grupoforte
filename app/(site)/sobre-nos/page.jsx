import Icon from '@/components/Icon';
import Eyebrow from '@/components/Eyebrow';
import PageHero from '@/components/PageHero';
import { getContent } from '@/lib/content';
import { rich } from '@/lib/data';

export const metadata = {
  title: 'Sobre nós',
  description: 'O Grupo Forte é uma holding com mais de duas décadas de atuação no setor da construção civil.',
};

export default async function SobreNos() {
  const { sobre: s } = await getContent();
  return (
    <>
      <PageHero title="Sobre nós" image={s.capa} overlay={0.7} edit="sobre:topo" />

      <section className="sobre">
        <div className="container">
          <a className="sobre-banner" data-edit="sobre:topo" style={{ backgroundImage: `url(${s.banner})` }} href={s.bannerLink || undefined} aria-label="Assistir ao vídeo institucional" data-reveal />
          <div className="sobre-cols" data-edit="sobre:texto">
            <div className="sobre-texto">
              <Eyebrow className="eyebrow--plain eyebrow--small">Sobre nós</Eyebrow>
              <h2 data-reveal>{s.titulo}</h2>
              <div className="sobre-paragrafos" dangerouslySetInnerHTML={{ __html: rich(s.texto) }} />
              <div className="sobre-boxes">
                {s.destaques.map((d, i) => (
                  <div className={`sobre-box ${i === 0 ? 'sobre-box--fill' : ''}`} key={i} data-reveal style={{ '--d': `${i * 120}ms` }}>
                    <Icon name={d.icone} size={60} />
                    <h3>{d.titulo}</h3>
                    <p>{d.texto}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="sobre-foto" style={{ backgroundImage: `url(${s.foto})` }} data-reveal role="img" aria-label="Unidade industrial do Grupo Forte" />
          </div>
        </div>
      </section>

      <section className="mvv" data-edit="sobre:valores">
        <div className="mvv-grid">
          {s.valores.map((m, i) => (
            <article className="mvv-card" key={i} data-reveal style={{ '--d': `${i * 120}ms` }}>
              <h2>{m.titulo}</h2>
              {m.img ? <img src={m.img} alt="" width="150" height="150" loading="lazy" /> : null}
              <div dangerouslySetInnerHTML={{ __html: rich(m.texto) }} />
            </article>
          ))}
        </div>
      </section>

      {s.logos.length ? (
        <section className="sobre-logos" data-edit="sobre:logos">
          <div className="container">
            <div className="sobre-logos-row">
              {s.logos.filter((l) => l.img).map((l, i) => <img key={i} data-reveal style={{ '--d': `${i * 120}ms` }} src={l.img} alt={l.nome} width="186" height="67" loading="lazy" />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="lideres" data-edit="sobre:lideres">
        <div className="container">
          <Eyebrow className="eyebrow--center eyebrow--plain eyebrow--small">Líderes</Eyebrow>
          <div className="lideres-lista">
            {s.lideres.map((l, i) => (
              <div className={`lider ${i % 2 ? 'lider--inverso' : ''}`} key={i}>
                {l.video ? (
                  <a className="lider-video" href={l.video} aria-label={`Assistir ao vídeo de ${l.nome}`} data-reveal>
                    {l.capa ? <img src={l.capa} alt={`${l.nome}, ${l.cargo} do Grupo Forte`} loading="lazy" /> : null}
                    <span className="lider-play"><Icon name="e-eicon-play" size={24} /></span>
                  </a>
                ) : (
                  <div className="lider-video lider-video--exemplo" data-reveal role="img" aria-label={`Vídeo de ${l.nome} (em breve)`}>
                    {l.foto ? <img className="lider-exemplo-foto" src={l.foto} alt="" loading="lazy" /> : null}
                    <span className="lider-play"><Icon name="e-eicon-play" size={24} /></span>
                    <span className="lider-exemplo-legenda"><b>{l.nome}</b>Vídeo em breve</span>
                  </div>
                )}
                <figure className="depoimento" data-reveal>
                  <blockquote>{l.frase}</blockquote>
                  <figcaption>
                    {l.foto ? <img src={l.foto} alt="" width="60" height="60" loading="lazy" /> : null}
                    <span><b>{l.nome}</b>{l.cargo}</span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
