import crypto from 'node:crypto';
import { adminRead, body, fail, guard, json } from '@/lib/api';
import { createPasswordToken, hashPassword, normEmail, passwordProblem, validEmail } from '@/lib/auth';
import { getMailSettings, passwordLinkMail } from '@/lib/mail';
import { userDelete, userSave, usersList } from '@/lib/store';

const pub = (u) => ({ id: u.id, username: u.username, email: u.email || '', name: u.name, mustChange: Boolean(u.must_change), admin: u.role === 'admin' });

export async function GET() {
  const g = await adminRead(); if (g.error) return g.error;
  return json((await usersList()).map(pub));
}
// Cria outro acesso. Com o e-mail configurado, a pessoa recebe um link para criar a senha;
// sem ele, quem cria informa uma senha provisória, trocada no primeiro login.
export async function POST(req) {
  const g = await guard({ admin: true }); if (g.error) return g.error;
  const { name = '', email = '', password = '' } = await body(req);
  const e = normEmail(email);
  if (!String(name).trim()) return fail('Informe o nome.');
  if (!validEmail(e)) return fail('Informe um e-mail válido.');
  const byMail = (await getMailSettings()).ready;
  if (!byMail) { const problem = passwordProblem(password); if (problem) return fail(`Sem o envio de e-mails configurado, informe uma senha provisória. ${problem}`); }
  const initial = byMail ? crypto.randomBytes(24).toString('base64url') : password;
  try { await userSave({ role: 'editor', username: e, email: e, name: String(name).trim().slice(0, 100), pass_hash: hashPassword(initial), must_change: !byMail }); }
  catch (err) { return err.code === 'ER_DUP_ENTRY' ? fail('Já existe um acesso com esse e-mail.') : fail('Não foi possível criar.', 500); }
  if (!byMail) return json({ ok: true, invited: false });
  const user = (await usersList()).find((x) => x.email === e);
  try { await passwordLinkMail(user, await createPasswordToken(user, 48 * 60), 'convite'); }
  catch (err) { await userDelete(user.id); return fail(`O convite não pôde ser enviado, então o acesso não foi criado. ${err.message}`, 502); }
  return json({ ok: true, invited: true });
}
