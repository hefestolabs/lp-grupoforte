import { body, fail, guard, json } from '@/lib/api';
import { getSession, hashPassword, passwordProblem } from '@/lib/auth';
import { userSave, usersList } from '@/lib/store';

const pub = (u) => ({ id: u.id, username: u.username, name: u.name, mustChange: Boolean(u.must_change) });

export async function GET() {
  if (!(await getSession())) return fail('Sessão expirada. Entre novamente.', 401);
  return json((await usersList()).map(pub));
}
// Cria outro acesso, com senha provisória que a pessoa troca no primeiro login.
export async function POST(req) {
  const g = await guard(); if (g.error) return g.error;
  const { name = '', username = '', password = '' } = await body(req);
  const u = String(username).toLowerCase().trim();
  if (!/^[a-z0-9._-]{3,40}$/.test(u)) return fail('Usuário: de 3 a 40 letras minúsculas, números, ponto ou traço.');
  if (!String(name).trim()) return fail('Informe o nome.');
  const problem = passwordProblem(password); if (problem) return fail(problem);
  try { await userSave({ username: u, name: String(name).trim().slice(0, 100), pass_hash: hashPassword(password), must_change: true }); }
  catch (e) { return e.code === 'ER_DUP_ENTRY' ? fail('Esse usuário já existe.') : fail('Não foi possível criar.', 500); }
  return json({ ok: true });
}
