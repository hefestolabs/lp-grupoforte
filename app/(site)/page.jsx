import Link from 'next/link';
import Icon from '@/components/Icon';
import Eyebrow from '@/components/Eyebrow';
import BrandCards from '@/components/BrandCards';
import Counter from '@/components/Counter';
import Accordion from '@/components/Accordion';
import Carousel from '@/components/Carousel';
import PostGrid from '@/components/PostGrid';
import HeroVideo from '@/components/HeroVideo';
import SmartLink from '@/components/SmartLink';
import { getPosts } from '@/lib/data';
import { getContent, youtubeId } from '@/lib/content';

export default async function Home() {
  const { home: h, contatos } = await getContent();
  // Se o banco estiver fora do ar, a home continua no ar (sem a grade de notícias).
  const { posts } = await getPosts({ perPage: 3 }).catch((e) => {
    console.error('Falha ao buscar notícias:', e.message);
    return { posts: [] };
  });
  const videoId = youtubeId(h.heroVideo);
  return (
    <>
      <section className="hero-wrap" data-edit="home:hero">
        <div className="hero">
          {videoId ? <HeroVideo id={videoId} start={h.heroVideoInicio} /> : null}
          <div className="hero-overlay" />
          {h.heroLogo ? <img src={h.heroLogo} alt="Grupo Forte — Tradição, Inovação e Qualidade no Setor da Construção" width="496" height="120" data-reveal /> : null}
        </div>
      </section>

      <section className="marcas">
        <div className="container marcas-inner">
          <div className="marcas-head" id="PRODUTOSANCORA" data-reveal data-edit="home:marcas">
            <Eyebrow>Nossas marcas</Eyebrow>
            {h.marcasTitulo ? <h1 className="h-display">{h.marcasTitulo}</h1> : null}
          </div>
          <BrandCards marcas={h.marcas} />
          <div className="unidades" data-reveal data-edit="home:unidades">
            {h.unidadesTitulo ? <h2>{h.unidadesTitulo}</h2> : null}
            <div className="unidades-grid">
              {h.unidades.map((u, i) => (
                <div className="unidade" key={i}>
                  <strong>{u.tipo}</strong>
                  <span className="unidade-local"><Icon name="e-fas-map-marker-alt" size={25} />{u.local}</span>
                  <ul><li>{u.texto}</li></ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="counters-wrap" data-edit="home:numeros">
        <div className="container">
          <div className="counters">
            {h.contadores.map((c, i) => <Counter key={i} title={c.titulo} end={c.valor} prefix={c.prefixo} suffix={c.sufixo} />)}
          </div>
        </div>
      </section>

      <section className="servicos">
        <div className="container servicos-inner">
          <div className="servicos-side" data-reveal data-edit="home:instagram">
            <div className="card-navy insta-card">
              {h.instagramTexto ? <h4>{h.instagramTexto}</h4> : null}
              {contatos.instagram && h.instagramBotao ? (
                <a className="btn btn-orange btn-bordered" href={contatos.instagram}>
                  <Icon name="e-fab-instagram" size={15} />
                  <span>{h.instagramBotao}</span>
                </a>
              ) : null}
            </div>
            {h.instagramArte ? (
              <div className="insta-arte" style={{ backgroundImage: `url(${h.instagramArte})` }}>
                {h.instagramPost ? <a href={h.instagramPost} aria-label="Ver publicação no Instagram"><Icon name="heart" size={25} /></a> : null}
              </div>
            ) : null}
          </div>
          <div className="servicos-main" data-edit="home:servicos">
            <div data-reveal>
              <Eyebrow>Outros serviços</Eyebrow>
              {h.servicosTitulo ? <h2 className="h-section">{h.servicosTitulo}</h2> : null}
            </div>
            <div className="servicos-grid">
              {h.servicos.map((s, i) => (
                <article className="servico" key={i} data-reveal style={{ '--d': `${i * 120}ms` }}>
                  <div className="servico-head">
                    <Icon name={s.icone} size={80} />
                    <h3>{s.titulo}</h3>
                  </div>
                  <p>{s.texto}</p>
                  {s.link ? <SmartLink className="btn btn-mini" href={s.link}><span>Saiba mais</span><Icon name="arrow-up-right" size={15} /></SmartLink> : null}
                </article>
              ))}
              {h.chamadaTexto || (h.chamadaLink && h.chamadaBotao) ? (
                <article className="card-navy servico-cta" data-reveal style={{ '--d': '360ms' }}>
                  {h.chamadaTexto ? <h4>{h.chamadaTexto}</h4> : null}
                  {h.chamadaLink && h.chamadaBotao ? <SmartLink className="btn btn-orange btn-bordered" href={h.chamadaLink}><span>{h.chamadaBotao}</span><Icon name="arrow-up-right" size={15} /></SmartLink> : null}
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="info-wrap" data-edit="home:info">
        <div className="info panel-navy">
          <div className="info-bg" />
          <div className="info-head" data-reveal>
            <Eyebrow className="eyebrow--light">Informações</Eyebrow>
            {h.infoTitulo ? <h2>{h.infoTitulo}</h2> : null}
          </div>
          <div className="info-body" data-reveal style={{ '--d': '150ms' }}>
            {h.infoTexto ? <p>{h.infoTexto}</p> : null}
            <div className="info-card">
              <Accordion items={h.infoItens.map((i) => ({ title: i.titulo, text: i.texto }))} />
            </div>
          </div>
        </div>
      </section>

      {h.parceiros.length ? (
        <section className="parceiros" data-edit="home:parceiros">
          <div className="container">
            <div data-reveal>
              <Eyebrow className="eyebrow--center">Parceiros</Eyebrow>
              <h2 className="h-light">Empresas que confiam no <b>GRUPOFORTE</b></h2>
            </div>
            <div className="parceiros-panel">
              <Carousel slides={h.parceiros.filter((p) => p.img).map((p) => ({ src: p.img, alt: p.nome }))} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="noticias" data-edit="home:noticias">
        <div className="container">
          <div className="noticias-head">
            <div data-reveal>
              <Eyebrow className="eyebrow--plain">Notícias e insights</Eyebrow>
              {h.noticiasTitulo ? <h2 className="h-light h-navy">{h.noticiasTitulo}</h2> : null}
            </div>
            <Link className="btn btn-cta btn-cta--hover" href="/noticias/"><span>Saiba mais</span><Icon name="arrow-up-right" size={16} /></Link>
          </div>
          <PostGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
