// Único módulo que fala com o WordPress (headless, em /cms no mesmo domínio).
import { decodeHTML } from 'entities';

const API = (process.env.WP_API_URL || 'https://white-badger-810180.hostingersite.com/cms/wp-json/wp/v2').replace(/\/$/, '');
const REVALIDATE = 60; // segundos: uma notícia nova aparece em até 1 minuto, sem novo deploy

const text = (s) => decodeHTML(String(s || '').replace(/<[^>]+>/g, '')).trim();

async function wp(path) {
  const res = await fetch(`${API}${path}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`WordPress respondeu ${res.status} em ${path}`);
  return res.json();
}

function mapPost(p) {
  const media = p._embedded?.['wp:featuredmedia']?.[0];
  const terms = (p._embedded?.['wp:term'] || []).flat().filter((t) => t.taxonomy === 'category');
  return {
    id: p.id,
    slug: p.slug,
    title: text(p.title?.rendered),
    date: p.date,
    excerpt: text(p.excerpt?.rendered),
    content: p.content?.rendered || '',
    image: media?.source_url ? { src: media.source_url, alt: media.alt_text || text(p.title?.rendered) } : null,
    categories: terms.map((t) => ({ name: text(t.name), slug: t.slug })),
    seo: p.yoast_head_json
      ? { title: text(p.yoast_head_json.title), description: text(p.yoast_head_json.description || p.yoast_head_json.og_description) }
      : null,
  };
}

export async function getPosts({ perPage = 12, category } = {}) {
  let q = `/posts?per_page=${perPage}&_embed=1`;
  if (category) {
    const cats = await wp(`/categories?slug=${encodeURIComponent(category)}`);
    if (!cats.length) return { posts: [], category: null };
    q += `&categories=${cats[0].id}`;
    const data = await wp(q);
    return { posts: data.map(mapPost), category: { name: text(cats[0].name), slug: cats[0].slug } };
  }
  const data = await wp(q);
  return { posts: data.map(mapPost), category: null };
}

export async function getPost(slug) {
  const data = await wp(`/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
  return data.length ? mapPost(data[0]) : null;
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export function formatDate(iso) {
  const d = new Date(iso);
  const mes = MESES[d.getMonth()];
  return { dia: String(d.getDate()).padStart(2, '0'), mesCurto: mes.slice(0, 3), longa: `${d.getDate()} ${mes} ${d.getFullYear()}` };
}
