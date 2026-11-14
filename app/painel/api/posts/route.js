import { body, fail, guard, json } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { getAllPostsAdmin } from '@/lib/data';
import { readPost } from '@/lib/posts-api';
import { postSave } from '@/lib/store';

export async function GET() {
  if (!(await getSession())) return fail('Sessão expirada. Entre novamente.', 401);
  return json(await getAllPostsAdmin());
}
export async function POST(req) {
  const g = await guard();
  if (g.error) return g.error;
  const { post, error } = readPost(await body(req));
  if (error) return fail(error);
  try {
    return json({ ok: true, id: await postSave(post) });
  } catch (e) {
    return e.code === 'ER_DUP_ENTRY' ? fail('Já existe uma notícia com esse endereço. Mude o título ou o endereço.') : fail('Não foi possível salvar.', 500);
  }
}
