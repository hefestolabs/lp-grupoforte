// Abertura manual de demanda (sem passar pelo assistente).
import { body, fail, guard, json } from '@/lib/api';
import { loginAllowed, loginFailed } from '@/lib/auth';
import { openTicket } from '@/lib/support';

export async function POST(req) {
  const g = await guard();
  if (g.error) return g.error;
  const key = `ticket|${g.user.id}`;
  if (!loginAllowed(key, 10)) return fail('Muitas demandas em pouco tempo. Aguarde alguns minutos.', 429);
  loginFailed(key);
  const { title, description, priority, transcript } = await body(req);
  try {
    return json({ ok: true, ...(await openTicket(g.user, { title, description, priority, source: 'manual', transcript })) });
  } catch (e) {
    return fail(e.message);
  }
}
