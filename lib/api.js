// Utilidades das rotas do painel.
import { NextResponse } from 'next/server';
import { getSession, sameOrigin } from './auth';

export const json = (data, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export const fail = (message, status = 400) => json({ error: message }, status);

// Toda rota que altera algo exige: mesma origem (anti-CSRF) e usuário logado.
export async function guard({ allowMustChange = false, admin = false } = {}) {
  if (!(await sameOrigin())) return { error: fail('Origem não permitida.', 403) };
  const user = await getSession();
  if (!user) return { error: fail('Sessão expirada. Entre novamente.', 401) };
  if (user.mustChange && !allowMustChange) return { error: fail('Troque a senha provisória antes de continuar.', 403) };
  if (admin && !user.admin) return { error: fail('Só o administrador pode fazer isso.', 403) };
  return { user };
}
export async function body(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

// Leitura restrita ao administrador (sem checagem de origem, por ser GET).
export async function adminRead() {
  const user = await getSession();
  if (!user) return { error: fail('Sessão expirada. Entre novamente.', 401) };
  if (!user.admin) return { error: fail('Só o administrador pode ver isso.', 403) };
  return { user };
}
