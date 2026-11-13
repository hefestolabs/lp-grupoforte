import { adminRead, body, fail, guard, json } from '@/lib/api';
import { publicMailSettings, saveMailSettings } from '@/lib/mail';

export async function GET() {
  const g = await adminRead(); if (g.error) return g.error;
  return json(await publicMailSettings());
}
export async function PUT(req) {
  const g = await guard({ admin: true }); if (g.error) return g.error;
  try { await saveMailSettings(await body(req)); } catch (e) { return fail(e.message); }
  return json({ ok: true, ...(await publicMailSettings()) });
}
