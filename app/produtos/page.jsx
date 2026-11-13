import Eyebrow from '@/components/Eyebrow';
import PageHero from '@/components/PageHero';
import BrandCards from '@/components/BrandCards';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Produtos',
  description: 'Argaforte, Reboforte, Dacor e Realce Tintas: marcas fortes que entregam valor da base ao acabamento.',
};

export default function Produtos() {
  return (
    <>
      <PageHero title="Produtos" image="/img/produtos-capa.jpg" />
      <section className="produtos">
        <div className="container">
          <div className="produtos-head">
            <div className="marcas-head">
              <Eyebrow>Nossas marcas</Eyebrow>
              <h1 className="h-display">Marcas fortes que entregam valor.</h1>
            </div>
            <a className="btn btn-saiba" href={SITE.whatsapp}>Saiba mais</a>
          </div>
          <BrandCards variant="produtos" />
        </div>
      </section>
      <section className="catalogo">
        <div className="catalogo-box">
          <img src="/img/pdf.png" alt="" width="150" height="150" loading="lazy" />
          <div>
            <p>Conheça nossa linha completa de soluções e especificações de produto.</p>
            <a className="btn btn-accent" href={SITE.whatsapp}>Clique e faça o download</a>
          </div>
        </div>
      </section>
    </>
  );
}
