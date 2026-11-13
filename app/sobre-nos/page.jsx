import Icon from '@/components/Icon';
import Eyebrow from '@/components/Eyebrow';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Sobre nós',
  description: 'O Grupo Forte é uma holding com mais de duas décadas de atuação no setor da construção civil.',
};

const MVV = [
  { titulo: 'MISSÃO', img: '/img/missao.png', corpo: <p>Fazer a diferença no mundo da construção, proporcionando <b>soluções de qualidade</b> para quem constrói sonhos.</p> },
  { titulo: 'VISÃO', img: '/img/visao.png', corpo: <p>Ser protagonista na construção civil, crescendo com as pessoas e construindo um legado de confiança.</p> },
  { titulo: 'VALORES', img: '/img/valores.png', corpo: <p>• Excelência<br />• Protagonismo<br />• Inovação<br />• Integridade e Respeito<br />• Cooperação</p> },
];

export default function SobreNos() {
  return (
    <>
      <PageHero title="Sobre nós" image="/img/sobre-capa.jpg" overlay={0.7} />

      <section className="sobre">
        <div className="container">
          <a className="sobre-banner" data-reveal href="https://www.youtube.com/watch?v=H81ntpJpAkE" aria-label="Assistir ao vídeo institucional no YouTube" />
          <div className="sobre-cols">
            <div className="sobre-texto">
              <div data-reveal>
                <Eyebrow className="eyebrow--plain eyebrow--small">Sobre nós</Eyebrow>
              </div>
              <h2 data-reveal>O GRUPO FORTE é uma Holding com mais de duas décadas de atuação no setor da construção civil.</h2>
              <p data-reveal style={{ "--d": "150ms" }}>Reunimos marcas que entregam qualidade, inovação e confiança para diferentes etapas da obra. Com produção própria, logística integrada e foco em eficiência, oferecemos soluções que vão da base ao acabamento, incluindo argamassas, massas prontas, tintas, impermeabilizantes, complementos e revestimentos para construção.</p>
              <p data-reveal style={{ "--d": "300ms" }}>Mais do que fornecer soluções, trabalhamos para fortalecer o setor da construção, apoiar nossos parceiros e contribuir para que cada projeto seja realizado com produtos desenvolvidos para gerar desempenho, segurança e resultado.</p>
              <div className="sobre-boxes">
                <div className="sobre-box sobre-box--fill" data-reveal>
                  <Icon name="city" size={60} />
                  <h3>Produção Própria</h3>
                  <p>Tecnologia, controle e precisão fazem parte do nosso processo. Com laboratório interno, garantimos qualidade em cada etapa para oferecer mais segurança e desempenho à sua obra.</p>
                </div>
                <div className="sobre-box" data-reveal style={{ "--d": "200ms" }}>
                  <Icon name="award" size={60} />
                  <h3>Suporte ao Cliente</h3>
                  <p>Contamos com laboratório interno para oferecer suporte técnico, análise de produtos e orientação especializada em cada etapa da obra.</p>
                </div>
              </div>
            </div>
            <div className="sobre-foto" data-reveal style={{ "--d": "200ms" }} role="img" aria-label="Unidade industrial da Argaforte em Cacoal" />
          </div>
        </div>
      </section>

      <section className="mvv">
        <div className="mvv-grid">
          {MVV.map((m, i) => (
            <article className="mvv-card" key={m.titulo} data-reveal style={{ "--d": `${i * 200}ms` }}>
              <h2>{m.titulo}</h2>
              <img src={m.img} alt="" width="150" height="150" loading="lazy" />
              {m.corpo}
            </article>
          ))}
        </div>
      </section>

      <section className="sobre-logos">
        <div className="container">
          <div className="sobre-logos-row">
            <img data-reveal src="/img/logo-dacor.png" alt="Dacor" width="186" height="67" loading="lazy" />
            <img data-reveal style={{ "--d": "300ms" }} src="/img/logo-argaforte.png" alt="Argaforte" width="186" height="67" loading="lazy" />
            <img data-reveal style={{ "--d": "600ms" }} src="/img/logo-np.png" alt="NP" width="186" height="67" loading="lazy" />
            <img data-reveal style={{ "--d": "900ms" }} src="/img/logo-realce.png" alt="Realce Tintas" width="186" height="67" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="lideres">
        <div className="container">
          <Eyebrow className="eyebrow--center eyebrow--plain eyebrow--small">Líderes</Eyebrow>
          <div className="lideres-grid">
            <a className="lider-video" data-reveal href="https://youtu.be/toX-37jjs94" aria-label="Assistir ao vídeo de May Bianchini no YouTube">
              <img src="/img/video-capa.jpg" alt="May Bianchini, presidente do Grupo Forte" loading="lazy" />
              <span className="lider-play"><Icon name="e-eicon-play" size={24} /></span>
            </a>
            <figure className="depoimento" data-reveal style={{ "--d": "200ms" }}>
              <blockquote>"Nossa missão sempre foi desenvolver soluções que gerem confiança, desempenho e resultado, fortalecendo a construção civil e as pessoas que constroem o futuro todos os dias."</blockquote>
              <figcaption>
                <img src="/img/lider-may.png" alt="" width="60" height="60" loading="lazy" />
                <span><b>May Bianchini</b>Presidente</span>
              </figcaption>
            </figure>
            <figure className="depoimento" data-reveal style={{ "--d": "200ms" }}>
              <blockquote>"Acreditamos que excelência se constrói diariamente, por meio de pessoas comprometidas, inovação constante e respeito aos nossos parceiros."</blockquote>
              <figcaption>
                <img src="/img/lider-simone.png" alt="" width="60" height="60" loading="lazy" />
                <span><b>Simone Bianchini</b>CEO</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
