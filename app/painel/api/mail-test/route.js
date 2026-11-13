import { fail, guard, json } from '@/lib/api';
import { sendMail } from '@/lib/mail';

export async function POST() {
  const g = await guard({ admin: true }); if (g.error) return g.error;
  if (!g.user.email) return fail('Cadastre o seu e-mail em "Minha conta" para receber o teste.');
  try { await sendMail({ to: g.user.email, subject: 'Teste de e-mail do painel Grupo Forte', title: 'Funcionou!', lines: ['Este é um e-mail de teste do painel do site.', 'A recuperação de senha e os convites por e-mail estão prontos para uso.'] }); }
  catch (e) { return fail(e.message, e.code === 'MAIL_OFF' ? 400 : 502); }
  return json({ ok: true, to: g.user.email });
}
