import { body, fail, guard, json } from '@/lib/api';
import { DEFAULTS, getPublished as getContent, saveSection } from '@/lib/content';

export async function GET() {
  const g = await guardRead();
  if (g) return g;
  return json(await getContent());
}
async function guardRead() {
  const { getSession } = await import('@/lib/auth');
  return (await getSession()) ? null : fail('Sessão expirada. Entre novamente.', 401);
}
export async function PUT(req) {
  const g = await guard();
  if (g.error) return g.error;
  const { section, data } = await body(req);
  if (!DEFAULTS[section]) return fail('Seção desconhecida.');
  return json({ ok: true, data: await saveSection(section, data) });
}
