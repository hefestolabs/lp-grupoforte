// Cria o primeiro acesso. Só funciona enquanto não existir nenhum usuário.
import { body, fail, json } from '@/lib/api';
import { hashPassword, normEmail, passwordProblem, sameOrigin, validEmail } from '@/lib/auth';
import { userSave, usersList } from '@/lib/store';

export async function POST(req) {
  if (!(await sameOrigin())) return fail('Origem não permitida.', 403);
  if ((await usersList()).length) return fail('O painel já foi configurado.', 403);
  const { name = '', username = '', password = '', mustChange = false } = await body(req);
  const u = normEmail(username);
  if (!validEmail(u)) return fail('Informe um e-mail válido.');
  if (!String(name).trim()) return fail('Informe o nome.');
  const problem = passwordProblem(password);
  if (problem) return fail(problem);
  await userSave({
    role: 'admin',
    username: u,
    email: u,
    name: String(name).trim().slice(0, 100),
    pass_hash: hashPassword(password),
    must_change: Boolean(mustChange),
  });
  return json({ ok: true });
}
