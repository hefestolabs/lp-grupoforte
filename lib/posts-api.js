import { slugify } from './data';

// Valida e normaliza uma notícia vinda do painel.
export function readPost(input, existing) {
  const title = String(input.title || '')
    .trim()
    .slice(0, 200);
  if (!title) return { error: 'Informe o título.' };
  const slug = slugify(input.slug || existing?.slug || title);
  if (!slug) return { error: 'Endereço inválido.' };
  const RESERVED = ['painel', 'midia', 'noticias', 'category', 'sobre-nos', 'produtos', 'trabalhe-conosco', 'cms', 'img', 'fonts'];
  if (RESERVED.includes(slug)) return { error: 'Esse endereço é reservado. Escolha outro.' };
  const image = String(input.image || '').trim();
  if (image && !/^(\/|https:\/\/)/.test(image)) return { error: 'Imagem inválida.' };
  let date = String(input.date || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(date)) date = new Date().toISOString();
  const published_at = date.slice(0, 10) + ' ' + (date.slice(11, 19) || '12:00:00').padEnd(8, ':00').slice(0, 8);
  return {
    post: {
      slug,
      title,
      excerpt: String(input.excerpt || '')
        .trim()
        .slice(0, 300),
      content: String(input.content || '').slice(0, 20000),
      category: String(input.category || '')
        .trim()
        .slice(0, 80),
      image,
      image_alt: String(input.imageAlt || '')
        .trim()
        .slice(0, 200),
      status: input.status === 'rascunho' ? 'rascunho' : 'publicado',
      published_at,
    },
  };
}
