import { fail, guard, json } from '@/lib/api';
import { sendToCrm } from '@/lib/support';

export async function POST() {
  const g = await guard({ admin: true });
  if (g.error) return g.error;
  const r = await sendToCrm({
    id: 0,
    title: 'Teste de conexão do painel',
    description: 'Esta é uma demanda de teste enviada pelo painel do site. Pode ser ignorada.',
    priority: 'baixa',
    source: 'manual',
    user_name: g.user.name,
    user_email: g.user.email,
    transcript: '',
  });
  return r.status === 'enviado' ? json({ ok: true, detail: r.detail }) : fail(r.detail, 502);
}
