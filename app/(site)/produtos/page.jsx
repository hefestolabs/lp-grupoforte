import Eyebrow from '@/components/Eyebrow';
import PageHero from '@/components/PageHero';
import BrandCards from '@/components/BrandCards';
import SmartLink from '@/components/SmartLink';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Produtos',
  description: 'Argaforte, Reboforte, Dacor e Realce Tintas: marcas fortes que entregam valor da base ao acabamento.',
};

export default async function Produtos() {
  const { home, paginas: p } = await getContent();
  return (
    <>
      <PageHero title="Produtos" image={p.produtosCapa} />
      <section className="produtos">
        <div className="container">
          <div className="produtos-head">
            <div className="marcas-head" data-reveal>
              <Eyebrow>Nossas marcas</Eyebrow>
              <h1 className="h-display">{home.marcasTitulo}</h1>
            </div>
            {p.produtosBotaoLink ? <SmartLink className="btn btn-saiba" href={p.produtosBotaoLink}>Saiba mais</SmartLink> : null}
          </div>
          <BrandCards marcas={home.marcas} variant="produtos" />
        </div>
      </section>
      <section className="catalogo">
        <div className="catalogo-box" data-reveal>
          <img src="/img/pdf.png" alt="" width="150" height="150" loading="lazy" />
          <div>
            <p>{p.catalogoTexto}</p>
            {p.catalogoLink ? <SmartLink className="btn btn-accent" href={p.catalogoLink}>{p.catalogoBotao}</SmartLink> : null}
          </div>
        </div>
      </section>
    </>
  );
}
