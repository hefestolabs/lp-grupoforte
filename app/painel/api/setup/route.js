// Cria o primeiro acesso. Só funciona enquanto não existir nenhum usuário.
import { body, fail, json } from '@/lib/api';
import { hashPassword, passwordProblem, sameOrigin } from '@/lib/auth';
import { userSave, usersList } from '@/lib/store';

export async function POST(req) {
  if (!(await sameOrigin())) return fail('Origem não permitida.', 403);
  if ((await usersList()).length) return fail('O painel já foi configurado.', 403);
  const { name = '', username = '', password = '', mustChange = false } = await body(req);
  const u = String(username).toLowerCase().trim();
  if (!/^[a-z0-9._-]{3,40}$/.test(u)) return fail('Usuário: de 3 a 40 letras minúsculas, números, ponto ou traço.');
  if (!String(name).trim()) return fail('Informe o nome.');
  const problem = passwordProblem(password); if (problem) return fail(problem);
  await userSave({ username: u, name: String(name).trim().slice(0, 100), pass_hash: hashPassword(password), must_change: Boolean(mustChange) });
  return json({ ok: true });
}
