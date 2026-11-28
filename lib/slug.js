// Endereço amigável a partir de um texto ("Dia do Cliente!" → "dia-do-cliente"). Sem dependências: serve ao site e ao painel.
export const slugify = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
