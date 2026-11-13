import Icon from '@/components/Icon';
import PageHero from '@/components/PageHero';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Trabalhe conosco',
  description: 'Faça parte do Grupo Forte. Conheça nossa unidade industrial em Cacoal (RO) e fale com a gente.',
};

const MAPA = 'https://www.google.com/maps?q=Argaforte%20BR-364%20Km%20233%20Cacoal%20RO';

export default function TrabalheConosco() {
  return (
    <>
      <PageHero title="Trabalhe conosco" image="/img/trabalhe-capa.jpg" />
      <section className="trabalhe">
        <div className="container">
          <iframe className="trabalhe-mapa" title="Mapa: unidade industrial do Grupo Forte em Cacoal (RO)" src={`${MAPA}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <article className="unidade-card">
            <img src="/img/unidade-cacoal.jpg" alt="Fachada da unidade industrial em Cacoal" width="176" height="176" loading="lazy" />
            <div className="unidade-card-body">
              <h4>Unidade Industrial | Cacoal (RO)</h4>
              <p className="unidade-card-end"><Icon name="e-fas-map-marker-alt" size={20} />BR-364, s/n - Km 233 - St. Prosperidade, Cacoal - RO, 78975-000</p>
              <ul><li>Produção moderna, com rigoroso controle de qualidade.</li></ul>
            </div>
            <div className="unidade-card-foot">
              <ul className="round-icons">
                <li><a href="tel:+556920180545" aria-label="Telefone"><Icon name="e-fas-phone-alt" size={15} /></a></li>
                <li><a href="/" aria-label="Site"><Icon name="e-fas-globe" size={15} /></a></li>
                <li><a href={MAPA} aria-label="Mapa"><Icon name="e-fas-map" size={15} /></a></li>
              </ul>
              <a className="btn btn-navy" href={SITE.vagas}><span>Entrar em contato</span><Icon name="arrow-up-right" size={15} /></a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
