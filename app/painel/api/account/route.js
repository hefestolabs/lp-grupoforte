// Dados da própria conta: nome e e-mail (pede a senha atual).
import { body, fail, guard, json } from '@/lib/api';
import { normEmail, validEmail, verifyPassword } from '@/lib/auth';
import { userSave, usersList } from '@/lib/store';

export async function PUT(req) {
  const g = await guard();
  if (g.error) return g.error;
  const { name = '', email = '', current = '' } = await body(req);
  const user = (await usersList()).find((x) => x.id === g.user.id);
  if (!user || !verifyPassword(String(current), user.pass_hash)) return fail('A senha atual não confere.');
  const e = normEmail(email);
  if (!validEmail(e)) return fail('Informe um e-mail válido.');
  if (!String(name).trim()) return fail('Informe o nome.');
  try {
    await userSave({ ...user, name: String(name).trim().slice(0, 100), email: e });
  } catch (err) {
    return err.code === 'ER_DUP_ENTRY' ? fail('Esse e-mail já está em uso por outro acesso.') : fail('Não foi possível salvar.', 500);
  }
  return json({ ok: true, name: String(name).trim(), email: e });
}
