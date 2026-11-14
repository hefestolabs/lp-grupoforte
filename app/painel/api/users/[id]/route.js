import { fail, guard, json } from '@/lib/api';
import { userDelete, usersList } from '@/lib/store';

export async function DELETE(_req, { params }) {
  const g = await guard({ admin: true });
  if (g.error) return g.error;
  const id = Number((await params).id);
  if (id === g.user.id) return fail('Você não pode remover o próprio acesso.');
  if ((await usersList()).length <= 1) return fail('Precisa existir pelo menos um acesso.');
  await userDelete(id);
  return json({ ok: true });
}
