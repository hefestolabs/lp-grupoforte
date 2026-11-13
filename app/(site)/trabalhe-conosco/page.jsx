import Icon from '@/components/Icon';
import PageHero from '@/components/PageHero';
import SmartLink from '@/components/SmartLink';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Trabalhe conosco',
  description: 'Faça parte do Grupo Forte. Conheça nossa unidade industrial em Cacoal (RO) e fale com a gente.',
};

export default async function TrabalheConosco() {
  const { paginas: p, contatos } = await getContent();
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(p.mapaBusca)}`;
  const tel = contatos.telefone.replace(/\D/g, '');
  return (
    <>
      <PageHero title="Trabalhe conosco" image={p.trabalheCapa} />
      <section className="trabalhe">
        <div className="container">
          <iframe className="trabalhe-mapa" title="Mapa da unidade industrial do Grupo Forte" src={`${mapa}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <article className="unidade-card" data-reveal>
            {p.unidadeFoto ? <img src={p.unidadeFoto} alt="Fachada da unidade industrial" width="176" height="176" loading="lazy" /> : null}
            <div className="unidade-card-body">
              <h4>{p.unidadeTitulo}</h4>
              <p className="unidade-card-end"><Icon name="e-fas-map-marker-alt" size={20} />{p.unidadeEndereco}</p>
              <ul><li>{p.unidadeTexto}</li></ul>
            </div>
            <div className="unidade-card-foot">
              <ul className="round-icons">
                <li><a href={`tel:+55${tel}`} aria-label="Telefone"><Icon name="e-fas-phone-alt" size={15} /></a></li>
                <li><a href="/" aria-label="Site"><Icon name="e-fas-globe" size={15} /></a></li>
                <li><a href={mapa} aria-label="Mapa"><Icon name="e-fas-map" size={15} /></a></li>
              </ul>
              {p.trabalheBotaoLink ? <SmartLink className="btn btn-navy" href={p.trabalheBotaoLink}><span>Entrar em contato</span><Icon name="arrow-up-right" size={15} /></SmartLink> : null}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
