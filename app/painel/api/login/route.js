import { body, fail, json } from '@/lib/api';
import { clientIp, createSession, findUser, loginAllowed, loginFailed, sameOrigin, verifyPassword } from '@/lib/auth';

export async function POST(req) {
  if (!(await sameOrigin())) return fail('Origem não permitida.', 403);
  const { username = '', password = '' } = await body(req);
  const key = `${await clientIp()}|${String(username).toLowerCase()}`;
  if (!loginAllowed(key)) return fail('Muitas tentativas. Aguarde 10 minutos.', 429);
  const user = await findUser(username);
  if (!user || !verifyPassword(String(password), user.pass_hash)) {
    loginFailed(key);
    return fail('E-mail ou senha incorretos.', 401);
  }
  await createSession(user);
  return json({ ok: true, mustChange: Boolean(user.must_change) });
}
