// Conteúdo editável do site. DEFAULTS é o conteúdo original; o painel grava por cima, seção por seção.
import crypto from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { kvDelete, kvGet, kvSet } from './store';

export const DEFAULTS = {
  contatos: {
    whatsapp: 'https://wa.me/6920180545',
    telefone: '(69) 2018-0545',
    email: 'contato@argaforte.com.br',
    endereco: 'Rodovia BR 364, Km 233, Setor Prosperidade. Cacoal/RO',
    instagram: 'https://www.instagram.com/grupoforteoficial/',
    facebook: 'https://www.facebook.com/p/GrupoForte-100089550009681/',
    youtube: 'https://www.youtube.com/@grupoforteoficial',
    vagas: 'https://argaforte.vagas.solides.com.br/',
    slogan: 'O forte da construção!',
    copyright: 'Copyright 2025 Todos Direitos Reservados / GrupoForte Argaforte Indústria e Comércio de Argamassa Ltda CNPJ: 04.334.842/0001-30 | Inscrição Estadual: 00000000904082 Rodovia BR-364, Km 233, s/n, Zona Rural CEP 76960-970 — Cacoal – RO',
  },
  home: {
    heroVideo: 'https://youtu.be/20N43pv_Dzk',
    heroVideoInicio: 1,
    heroLogo: '/img/hero-logo.png',
    marcasTitulo: 'Marcas fortes que entregam valor.',
    marcas: [
      { nome: 'Argaforte', img: '/img/marca-argaforte.webp', texto: 'Qualidade e resistência em argamassas e rejuntes que garantem segurança e durabilidade para sua obra.', link: 'https://www.instagram.com/argaforte.oficial/' },
      { nome: 'Reboforte', img: '/img/marca-reboforte.jpg', texto: 'Impermeabilizante versátil e eficiente que une proteção duradoura, alto desempenho e excelente custo-benefício.', link: 'https://www.instagram.com/grupoforteoficial/' },
      { nome: 'Dacor', img: '/img/marca-dacor.webp', texto: 'Cores vibrantes, acabamento impecável e tecnologia premium para transformar ambientes com proteção.', link: 'https://www.instagram.com/dacortintas/' },
      { nome: 'Realce Tintas', img: '/img/marca-realce.webp', texto: 'Tintas versáteis e práticas que unem beleza, cobertura uniforme e excelente custo-benefício.', link: 'https://www.instagram.com/grupoforteoficial/' },
    ],
    unidadesTitulo: 'Estrutura sólida para atender diferentes mercados.',
    unidades: [
      { tipo: 'Unidade Industrial', local: 'Cacoal, Rondônia', texto: 'Produção moderna, com rigoroso controle de qualidade.' },
      { tipo: 'P&L', local: 'Porto Velho, Rondônia', texto: 'Logística integrada e ágil para garantir eficiência nas entregas.' },
      { tipo: 'P&L', local: 'Rio Branco, Acre', texto: 'Logística integrada e ágil para garantir eficiência nas entregas.' },
    ],
    contadores: [
      { titulo: 'Anos', valor: 25, prefixo: '', sufixo: '' },
      { titulo: 'Market Share RO', valor: 60, prefixo: '+', sufixo: '%' },
      { titulo: 'Toneladas Produtos / Ano', valor: 2000, prefixo: '+', sufixo: '' },
      { titulo: 'Parceiros Ativos', valor: 1100, prefixo: '+', sufixo: '' },
    ],
    instagramTexto: 'Acompanhe o Grupo Forte no Instagram e fique por dentro das novidades, lançamentos e bastidores.',
    instagramBotao: 'Siga no instagram',
    instagramArte: '/img/instagram-arte.jpg',
    instagramPost: 'https://www.instagram.com/p/DcQf5exjcZZ/',
    servicosTitulo: 'Soluções completas para cada etapa da construção.',
    servicos: [
      { icone: 'industries', titulo: 'Produção Industrial', texto: 'Produtos desenvolvidos com alto padrão de qualidade para garantir desempenho, segurança e confiança em cada etapa da obra.', link: '/sobre-nos/' },
      { icone: 'truck', titulo: 'Distribuição Estratégica', texto: 'Com frota própria e logística integrada, entregamos agilidade, controle e pontualidade para manter sua obra em movimento.', link: '/sobre-nos/' },
      { icone: 'headphone', titulo: 'Atendimento Especializado', texto: 'Representantes e colaboradores preparados para entender a necessidade de cada cliente e oferecer suporte próximo, técnico e estratégico.', link: 'https://wa.me/6920180545' },
    ],
    chamadaTexto: 'Da base ao acabamento, entregamos soluções que fortalecem obras, negócios e realizam sonhos.',
    chamadaBotao: 'Produtos',
    chamadaLink: '#PRODUTOSANCORA',
    infoTitulo: 'Do início ao acabamento, o Grupo Forte entrega soluções completas.',
    infoTexto: 'Construímos mais do que produtos: entregamos confiança, inovação e resultados. Com marcas consolidadas e processos integrados, o Grupo Forte fortalece cada projeto e impulsiona o futuro da construção civil.',
    infoItens: [
      { titulo: 'Produção Industrial', texto: 'Argamassas, tintas e impermeabilizantes fabricados com alto padrão de qualidade.' },
      { titulo: 'Logística Integrada', texto: 'Centros de distribuição estratégicos que garantem agilidade e eficiência.' },
      { titulo: 'Atendimento Especializado', texto: 'Suporte próximo para construtoras, parceiros e clientes finais.' },
    ],
    parceiros: [1, 2, 3, 4, 5, 6, 7].map((n) => ({ nome: `Parceiro ${n}`, img: `/img/parceiro-${n}.png` })),
    noticiasTitulo: 'Fique por dentro das novidades, lançamentos e tendências...',
  },
  sobre: {
    capa: '/img/sobre-capa.jpg',
    banner: '/img/sobre-fabrica.jpg',
    bannerLink: 'https://www.youtube.com/watch?v=H81ntpJpAkE',
    titulo: 'O GRUPO FORTE é uma Holding com mais de duas décadas de atuação no setor da construção civil.',
    texto: 'Reunimos marcas que entregam qualidade, inovação e confiança para diferentes etapas da obra. Com produção própria, logística integrada e foco em eficiência, oferecemos soluções que vão da base ao acabamento, incluindo argamassas, massas prontas, tintas, impermeabilizantes, complementos e revestimentos para construção.\n\nMais do que fornecer soluções, trabalhamos para fortalecer o setor da construção, apoiar nossos parceiros e contribuir para que cada projeto seja realizado com produtos desenvolvidos para gerar desempenho, segurança e resultado.',
    destaques: [
      { icone: 'city', titulo: 'Produção Própria', texto: 'Tecnologia, controle e precisão fazem parte do nosso processo. Com laboratório interno, garantimos qualidade em cada etapa para oferecer mais segurança e desempenho à sua obra.' },
      { icone: 'award', titulo: 'Suporte ao Cliente', texto: 'Contamos com laboratório interno para oferecer suporte técnico, análise de produtos e orientação especializada em cada etapa da obra.' },
    ],
    foto: '/img/unidade-cacoal.jpg',
    valores: [
      { titulo: 'MISSÃO', img: '/img/missao.png', texto: 'Fazer a diferença no mundo da construção, proporcionando **soluções de qualidade** para quem constrói sonhos.' },
      { titulo: 'VISÃO', img: '/img/visao.png', texto: 'Ser protagonista na construção civil, crescendo com as pessoas e construindo um legado de confiança.' },
      { titulo: 'VALORES', img: '/img/valores.png', texto: '• Excelência\n• Protagonismo\n• Inovação\n• Integridade e Respeito\n• Cooperação' },
    ],
    logos: [
      { nome: 'Dacor', img: '/img/logo-dacor.png' },
      { nome: 'Argaforte', img: '/img/logo-argaforte.png' },
      { nome: 'NP', img: '/img/logo-np.png' },
      { nome: 'Realce Tintas', img: '/img/logo-realce.png' },
    ],
    lideres: [
      { nome: 'May Bianchini', cargo: 'Presidente', frase: '"Nossa missão sempre foi desenvolver soluções que gerem confiança, desempenho e resultado, fortalecendo a construção civil e as pessoas que constroem o futuro todos os dias."', foto: '/img/lider-may.png', video: 'https://youtu.be/toX-37jjs94', capa: '/img/video-capa.jpg' },
      { nome: 'Simone Bianchini', cargo: 'CEO', frase: '"Acreditamos que excelência se constrói diariamente, por meio de pessoas comprometidas, inovação constante e respeito aos nossos parceiros."', foto: '/img/lider-simone.png', video: '', capa: '' },
    ],
  },
  paginas: {
    produtosCapa: '/img/produtos-capa.jpg',
    produtosBotaoLink: 'https://wa.me/6920180545',
    catalogoTexto: 'Conheça nossa linha completa de soluções e especificações de produto.',
    catalogoBotao: 'Clique e faça o download',
    catalogoLink: 'https://wa.me/6920180545',
    trabalheCapa: '/img/trabalhe-capa.jpg',
    unidadeTitulo: 'Unidade Industrial | Cacoal (RO)',
    unidadeEndereco: 'BR-364, s/n - Km 233 - St. Prosperidade, Cacoal - RO, 78975-000',
    unidadeTexto: 'Produção moderna, com rigoroso controle de qualidade.',
    unidadeFoto: '/img/unidade-cacoal.jpg',
    mapaBusca: 'BR-364, Km 233 - Setor Prosperidade, Cacoal - RO, 78975-000',
    trabalheBotaoLink: 'https://argaforte.vagas.solides.com.br/',
  },
};

const merge = (saved) => { const value = {}; for (const section of Object.keys(DEFAULTS)) value[section] = { ...DEFAULTS[section], ...(saved?.[section] || {}) }; return value; };

// ---- Prévia do editor ----
// O editor mostra o site real dentro de uma moldura. Só nessa moldura (e só para quem tem o cookie
// assinado da prévia) o site é montado com o rascunho ainda não publicado.
const PREVIEW_COOKIE = 'gf_previa';
async function previewKey() { let s = await kvGet('session_secret'); if (!s) { s = crypto.randomBytes(48).toString('hex'); await kvSet('session_secret', s); } return 'previa:' + s; }
const previewSig = async (id) => crypto.createHmac('sha256', await previewKey()).update(String(id)).digest('base64url');
export async function previewUserId() {
  try {
    const h = await headers();
    if (h.get('sec-fetch-dest') !== 'iframe') return null;
    const raw = (await cookies()).get(PREVIEW_COOKIE)?.value || '';
    const [id, sig] = raw.split('.');
    if (!/^\d+$/.test(id || '') || !sig) return null;
    const good = await previewSig(id);
    return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good)) ? Number(id) : null;
  } catch { return null; }
}
export async function saveDraft(userId, data) {
  const draft = {};
  for (const section of Object.keys(DEFAULTS)) if (data?.[section]) draft[section] = clean(data[section], DEFAULTS[section]);
  await kvSet(`draft:${userId}`, draft);
  (await cookies()).set(PREVIEW_COOKIE, `${userId}.${await previewSig(userId)}`, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 12 });
}
export async function clearDraft(userId) { await kvDelete(`draft:${userId}`); (await cookies()).set(PREVIEW_COOKIE, '', { path: '/', maxAge: 0 }); }

let cache = { at: 0, value: null };
export async function getContent() {
  const previewer = await previewUserId();
  if (previewer) {
    const draft = await kvGet(`draft:${previewer}`).catch(() => null);
    const saved = await kvGet('content').catch(() => null);
    if (draft) return merge({ ...(saved || {}), ...draft });
  }
  return getPublished();
}
export async function getPublished() {
  if (cache.value && Date.now() - cache.at < 15000) return cache.value;
  let saved = null;
  try { saved = await kvGet('content'); } catch (e) { console.error('Conteúdo: falha ao ler o banco, usando o padrão:', e.message); }
  const value = merge(saved);
  cache = { at: Date.now(), value };
  return value;
}

const okUrl = (v) => typeof v === 'string' && /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(v.trim());
// Limpa o que vem do painel: só chaves conhecidas, textos limitados, links e imagens com endereço válido.
function clean(value, model, key = '') {
  if (Array.isArray(model)) {
    if (!Array.isArray(value)) return model;
    return value.slice(0, 40).map((item) => clean(item, model[0] ?? {}, key));
  }
  if (model && typeof model === 'object') {
    const out = {};
    for (const k of Object.keys(model)) out[k] = clean(value?.[k], model[k], k);
    return out;
  }
  if (typeof model === 'number') { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.round(n)) : model; }
  const s = typeof value === 'string' ? value.slice(0, 4000).trim() : '';
  const isLink = /(link|whatsapp|instagram|facebook|youtube|vagas|video|post)$/i.test(key) && !/texto|botao|titulo/i.test(key);
  const isImage = /(img|foto|capa|arte|logo|banner)$/i.test(key);
  if (isLink || isImage) return s === '' || okUrl(s) ? s : '';
  return s;
}

export async function saveSection(section, data) {
  if (!DEFAULTS[section]) throw new Error('Seção desconhecida');
  const saved = (await kvGet('content')) || {};
  saved[section] = clean(data, DEFAULTS[section]);
  await kvSet('content', saved);
  cache = { at: 0, value: null };
  return saved[section];
}

// Extrai o código do vídeo de um link do YouTube (youtu.be/ID, watch?v=ID, shorts/ID, embed/ID).
export function youtubeId(url) {
  const m = String(url || '').match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(String(url || '')) ? url : '';
}
