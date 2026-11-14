import { body, fail, guard, json } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { resendTicket, publicSupportSettings } from '@/lib/support';
import { ticketsList } from '@/lib/store';

// Administrador vê todas as demandas; editor vê só as próprias. Também informa se o assistente está ligado.
export async function GET() {
  const user = await getSession();
  if (!user) return fail('Sessão expirada. Entre novamente.', 401);
  const s = await publicSupportSettings();
  const tickets = (await ticketsList(user.admin ? 0 : user.id)).map((t) => ({ id: t.id, title: t.title, description: t.description, priority: t.priority, source: t.source, crm: t.crm_status, crmDetail: user.admin ? t.crm_detail : '', by: t.user_name, at: t.created_at }));
  return json({ ai: s.hasKey, crm: Boolean(s.webhookUrl), tickets });
}
// Reenvia ao CRM uma demanda que ficou pendente ou com erro (só o administrador).
export async function POST(req) {
  const g = await guard({ admin: true }); if (g.error) return g.error;
  const crm = await resendTicket(Number((await body(req)).id));
  return crm ? json({ ok: true, crm: crm.status, detail: crm.detail }) : fail('Demanda não encontrada.', 404);
}
