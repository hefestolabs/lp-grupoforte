// Pedido de redefinição de senha. A resposta é sempre a mesma, exista ou não o e-mail.
import { body, fail, json } from '@/lib/api';
import { clientIp, createPasswordToken, findUser, loginAllowed, loginFailed, normEmail, sameOrigin } from '@/lib/auth';
import { passwordLinkMail } from '@/lib/mail';

export async function POST(req) {
  if (!(await sameOrigin())) return fail('Origem não permitida.', 403);
  const email = normEmail((await body(req)).email);
  const key = `rec|${await clientIp()}`;
  if (!loginAllowed(key)) return fail('Muitos pedidos. Aguarde 10 minutos.', 429);
  loginFailed(key);
  const user = email ? await findUser(email) : null;
  if (user?.email) {
    try {
      await passwordLinkMail(user, await createPasswordToken(user, 30), 'recuperar');
    } catch (e) {
      console.error('Recuperação de senha: e-mail não enviado:', e.message);
    }
  }
  return json({ ok: true });
}
