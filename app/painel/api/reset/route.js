import { body, fail, json } from '@/lib/api';
import { clientIp, consumePasswordToken, hashPassword, loginAllowed, loginFailed, passwordProblem, sameOrigin } from '@/lib/auth';
import { userSave } from '@/lib/store';

export async function POST(req) {
  if (!(await sameOrigin())) return fail('Origem não permitida.', 403);
  const { u, t, password = '' } = await body(req);
  const key = `rst|${await clientIp()}`;
  if (!loginAllowed(key)) return fail('Muitas tentativas. Aguarde 10 minutos.', 429);
  const found = await consumePasswordToken(u, t);
  if (!found) {
    loginFailed(key);
    return fail('Este link expirou ou já foi usado. Peça um novo.');
  }
  const problem = passwordProblem(password);
  if (problem) return fail(problem);
  await userSave({ ...found.user, pass_hash: hashPassword(password), must_change: false });
  await found.done();
  return json({ ok: true });
}
