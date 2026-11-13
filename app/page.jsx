import Link from 'next/link';
import Icon from '@/components/Icon';
import Eyebrow from '@/components/Eyebrow';
import BrandCards from '@/components/BrandCards';
import Counter from '@/components/Counter';
import Accordion from '@/components/Accordion';
import Carousel from '@/components/Carousel';
import PostGrid from '@/components/PostGrid';
import { getPosts } from '@/lib/data';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic'; // busca as notícias a cada acesso (com cache de 60s no fetch)

const UNIDADES = [
  { tipo: 'Unidade Industrial', local: 'Cacoal, Rondônia', texto: 'Produção moderna, com rigoroso controle de qualidade.' },
  { tipo: 'P&L', local: 'Porto Velho, Rondônia', texto: 'Logística integrada e ágil para garantir eficiência nas entregas.' },
  { tipo: 'P&L', local: 'Rio Branco, Acre', texto: 'Logística integrada e ágil para garantir eficiência nas entregas.' },
];

const SERVICOS = [
  { icon: 'industries', titulo: 'Produção Industrial', texto: 'Produtos desenvolvidos com alto padrão de qualidade para garantir desempenho, segurança e confiança em cada etapa da obra.', href: '/sobre-nos/' },
  { icon: 'truck', titulo: 'Distribuição Estratégica', texto: 'Com frota própria e logística integrada, entregamos agilidade, controle e pontualidade para manter sua obra em movimento.', href: '/sobre-nos/' },
  { icon: 'headphone', titulo: 'Atendimento Especializado', texto: 'Representantes e colaboradores preparados para entender a necessidade de cada cliente e oferecer suporte próximo, técnico e estratégico.', href: SITE.whatsapp },
];

const INFO = [
  { title: 'Produção Industrial', text: 'Argamassas, tintas e impermeabilizantes fabricados com alto padrão de qualidade.' },
  { title: 'Logística Integrada', text: 'Centros de distribuição estratégicos que garantem agilidade e eficiência.' },
  { title: 'Atendimento Especializado', text: 'Suporte próximo para construtoras, parceiros e clientes finais.' },
];

const PARCEIROS = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ src: `/img/parceiro-${n}.png`, alt: `Parceiro ${n} do Grupo Forte` }));

export default async function Home() {
  // Se o WordPress estiver fora do ar, a home continua no ar (sem a grade de notícias).
  const { posts } = await getPosts({ perPage: 3 }).catch((e) => {
    console.error('Falha ao buscar notícias:', e.message);
    return { posts: [] };
  });
  return (
    <>
      <section className="hero-wrap">
        <div className="hero">
          <img src="/img/hero-logo.png" alt="Grupo Forte — Tradição, Inovação e Qualidade no Setor da Construção" width="496" height="120" data-reveal />
        </div>
      </section>

      <section className="marcas">
        <div className="container marcas-inner">
          <div className="marcas-head" id="PRODUTOSANCORA" data-reveal>
            <Eyebrow>Nossas marcas</Eyebrow>
            <h1 className="h-display">Marcas fortes que entregam valor.</h1>
          </div>
          <BrandCards />
          <div className="unidades" data-reveal>
            <h2>Estrutura sólida para atender diferentes mercados.</h2>
            <div className="unidades-grid">
              {UNIDADES.map((u, i) => (
                <div className="unidade" key={u.local}>
                  <strong>{u.tipo}</strong>
                  <span className="unidade-local"><Icon name="e-fas-map-marker-alt" size={25} />{u.local}</span>
                  <ul><li>{u.texto}</li></ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="counters-wrap">
        <div className="container">
          <div className="counters">
            <Counter title="Anos" end={25} />
            <Counter title="Market Share RO" end={60} prefix="+" suffix="%" />
            <Counter title="Toneladas Produtos / Ano" end={2000} prefix="+" />
            <Counter title="Parceiros Ativos" end={1100} prefix="+" />
          </div>
        </div>
      </section>

      <section className="servicos">
        <div className="container servicos-inner">
          <div className="servicos-side" data-reveal>
            <div className="card-navy insta-card">
              <h4>Acompanhe o Grupo Forte no Instagram e fique por dentro das novidades, lançamentos e bastidores.</h4>
              <a className="btn btn-orange btn-bordered" href={SITE.instagram}>
                <Icon name="e-fab-instagram" size={15} />
                <span>Siga no instagram</span>
              </a>
            </div>
            <div className="insta-arte">
              <a href={SITE.instagramPost} aria-label="Ver publicação no Instagram"><Icon name="heart" size={25} /></a>
            </div>
          </div>
          <div className="servicos-main">
            <div data-reveal>
              <Eyebrow>Outros serviços</Eyebrow>
              <h2 className="h-section">Soluções completas para cada etapa da construção.</h2>
            </div>
            <div className="servicos-grid">
              {SERVICOS.map((s, i) => (
                <article className="servico" key={s.titulo} data-reveal style={{ "--d": `${i * 120}ms` }}>
                  <div className="servico-head">
                    <Icon name={s.icon} size={80} />
                    <h3>{s.titulo}</h3>
                  </div>
                  <p>{s.texto}</p>
                  {s.href.startsWith('/') ? (
                    <Link className="btn btn-mini" href={s.href}><span>Saiba mais</span><Icon name="arrow-up-right" size={15} /></Link>
                  ) : (
                    <a className="btn btn-mini" href={s.href}><span>Saiba mais</span><Icon name="arrow-up-right" size={15} /></a>
                  )}
                </article>
              ))}
              <article className="card-navy servico-cta" data-reveal style={{ "--d": "360ms" }}>
                <h4>Da base ao acabamento, entregamos soluções que fortalecem obras, negócios e realizam sonhos.</h4>
                <a className="btn btn-orange btn-bordered" href="#PRODUTOSANCORA"><span>Produtos</span><Icon name="arrow-up-right" size={15} /></a>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="info-wrap">
        <div className="info panel-navy">
          <div className="info-bg" />
          <div className="info-head" data-reveal>
            <Eyebrow className="eyebrow--light">Informações</Eyebrow>
            <h2>Do início ao acabamento, o Grupo Forte entrega soluções completas.</h2>
          </div>
          <div className="info-body" data-reveal style={{ "--d": "150ms" }}>
            <p>Construímos mais do que produtos: entregamos confiança, inovação e resultados. Com marcas consolidadas e processos integrados, o Grupo Forte fortalece cada projeto e impulsiona o futuro da construção civil.</p>
            <div className="info-card">
              <Accordion items={INFO} />
            </div>
          </div>
        </div>
      </section>

      <section className="parceiros">
        <div className="container">
          <div data-reveal>
            <Eyebrow className="eyebrow--center">Parceiros</Eyebrow>
            <h2 className="h-light">Empresas que confiam no <b>GRUPOFORTE</b></h2>
          </div>
          <div className="parceiros-panel">
            <Carousel slides={PARCEIROS} />
          </div>
        </div>
      </section>

      <section className="noticias">
        <div className="container">
          <div className="noticias-head">
            <div data-reveal>
              <Eyebrow className="eyebrow--plain">Notícias e insights</Eyebrow>
              <h2 className="h-light h-navy">Fique por dentro das novidades, lançamentos e tendências...</h2>
            </div>
            <Link className="btn btn-cta btn-cta--hover" href="/noticias/"><span>Saiba mais</span><Icon name="arrow-up-right" size={16} /></Link>
          </div>
          <PostGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
