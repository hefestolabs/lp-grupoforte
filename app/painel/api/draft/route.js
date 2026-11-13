// Rascunho da prévia do editor (por usuário). Não altera o site publicado.
import { body, guard, json } from '@/lib/api';
import { clearDraft, saveDraft } from '@/lib/content';

export async function PUT(req) {
  const g = await guard(); if (g.error) return g.error;
  await saveDraft(g.user.id, (await body(req)).content);
  return json({ ok: true });
}
export async function DELETE() {
  const g = await guard(); if (g.error) return g.error;
  await clearDraft(g.user.id);
  return json({ ok: true });
}
