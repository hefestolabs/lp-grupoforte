import { body, fail, guard, json } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { publicMailSettings, saveMailSettings } from '@/lib/mail';

export async function GET() {
  if (!(await getSession())) return fail('Sessão expirada. Entre novamente.', 401);
  return json(await publicMailSettings());
}
export async function PUT(req) {
  const g = await guard(); if (g.error) return g.error;
  try { await saveMailSettings(await body(req)); } catch (e) { return fail(e.message); }
  return json({ ok: true, ...(await publicMailSettings()) });
}
