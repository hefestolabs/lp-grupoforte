// Utilidades das rotas do painel.
import { NextResponse } from 'next/server';
import { getSession, sameOrigin } from './auth';

export const json = (data, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export const fail = (message, status = 400) => json({ error: message }, status);

// Toda rota que altera algo exige: mesma origem (anti-CSRF) e usuário logado.
export async function guard({ allowMustChange = false } = {}) {
  if (!(await sameOrigin())) return { error: fail('Origem não permitida.', 403) };
  const user = await getSession();
  if (!user) return { error: fail('Sessão expirada. Entre novamente.', 401) };
  if (user.mustChange && !allowMustChange) return { error: fail('Troque a senha provisória antes de continuar.', 403) };
  return { user };
}
export async function body(req) { try { return await req.json(); } catch { return {}; } }
