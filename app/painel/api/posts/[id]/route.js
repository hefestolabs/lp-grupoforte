import { body, fail, guard, json } from '@/lib/api';
import { readPost } from '@/lib/posts-api';
import { postDelete, postSave } from '@/lib/store';

export async function PUT(req, { params }) {
  const g = await guard();
  if (g.error) return g.error;
  const id = Number((await params).id);
  if (!id) return fail('Notícia inválida.');
  const { post, error } = readPost(await body(req));
  if (error) return fail(error);
  try {
    await postSave({ ...post, id });
    return json({ ok: true });
  } catch (e) {
    return e.code === 'ER_DUP_ENTRY' ? fail('Já existe uma notícia com esse endereço.') : fail('Não foi possível salvar.', 500);
  }
}
export async function DELETE(_req, { params }) {
  const g = await guard();
  if (g.error) return g.error;
  const id = Number((await params).id);
  if (!id) return fail('Notícia inválida.');
  await postDelete(id);
  return json({ ok: true });
}
