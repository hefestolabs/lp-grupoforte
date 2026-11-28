// Notícias: lidas do banco do painel. Na primeira execução, entram as 3 notícias do site original.
import { kvGet, kvSet, postsList, postSave } from './store';
import { slugify } from './slug';

const SEED = [
  { slug: 'melhor-tinta-standard', title: 'Melhor tinta standard!!!', content: 'Realce Tintas: beleza, cobertura uniforme e excelente custo-benefício.', category: 'Realce Tintas', image: '/img/post-melhor-tinta-standard.jpg', image_alt: 'Lata de tinta Realce sobre piso de madeira', published_at: '2025-09-25 09:30:09' },
  { slug: 'novo-produto-reboforte', title: 'Impermeabilizante Reboforte', content: 'Conheça o impermeabilizante Reboforte: proteção duradoura, alto desempenho e excelente custo-benefício.', category: 'Argaforte', image: '/img/post-impermeabilizante-reboforte.webp', image_alt: 'Balde do impermeabilizante Reboforte', published_at: '2025-09-25 09:28:31' },
  { slug: 'dia-do-consumidor-argaforte', title: 'Dia do Consumidor ArgaForte', content: 'Feliz Dia do Cliente! Juntos, somos mais fortes.', category: 'Datas Comemorativas', image: '/img/post-dia-do-consumidor.jpg', image_alt: 'Feliz Dia do Cliente: juntos, somos mais fortes', published_at: '2025-09-22 08:45:29' },
];

let seeding;
export async function ensureSeed() {
  if (!seeding) {
    seeding = (async () => {
      if (await kvGet('posts_seeded')) return;
      for (const p of SEED) { try { await postSave({ ...p, excerpt: '', status: 'publicado' }); } catch (e) { if (e.code !== 'ER_DUP_ENTRY') throw e; } }
      await kvSet('posts_seeded', true);
    })().catch((e) => { seeding = null; throw e; });
  }
  return seeding;
}

export { slugify };

function mapPost(p) {
  const cat = (p.category || '').trim();
  return {
    id: p.id, slug: p.slug, title: p.title, date: String(p.published_at).replace(' ', 'T'), excerpt: p.excerpt || '', content: p.content || '',
    image: p.image ? { src: p.image, alt: p.image_alt || p.title } : null,
    categories: cat ? [{ name: cat, slug: slugify(cat) }] : [], status: p.status,
  };
}

export async function getPosts({ perPage = 12, category } = {}) {
  await ensureSeed();
  let posts = (await postsList()).map(mapPost);
  if (category) {
    posts = posts.filter((p) => p.categories[0]?.slug === category);
    return { posts: posts.slice(0, perPage), category: posts[0]?.categories[0] || null };
  }
  return { posts: posts.slice(0, perPage), category: null };
}
export async function getPost(slug) {
  await ensureSeed();
  return (await postsList()).map(mapPost).find((p) => p.slug === slug) || null;
}
export async function getAllPostsAdmin() { await ensureSeed(); return (await postsList({ onlyPublished: false })).map(mapPost); }

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export function formatDate(iso) {
  const d = new Date(iso);
  const mes = MESES[d.getMonth()];
  return { dia: String(d.getDate()).padStart(2, '0'), mesCurto: mes.slice(0, 3), longa: `${d.getDate()} ${mes} ${d.getFullYear()}` };
}

// Texto simples do painel → parágrafos, quebras de linha e **negrito**, sem aceitar HTML.
export function rich(text) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return String(text || '').split(/\n\s*\n/).map((p) => `<p>${esc(p.trim()).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br />')}</p>`).join('');
}
