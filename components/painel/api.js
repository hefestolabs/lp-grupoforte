// Chamadas do painel ao servidor.
export async function api(path, { method = 'GET', data, form } = {}) {
  let res;
  try {
    res = await fetch(`/painel/api/${path}/`, { method, credentials: 'same-origin', headers: data ? { 'Content-Type': 'application/json' } : undefined, body: form || (data ? JSON.stringify(data) : undefined) });
  } catch { throw new Error('Sem conexão com o servidor. Tente de novo.'); }
  let out = {};
  try { out = await res.json(); } catch {}
  if (res.status === 401 && path !== 'login') { window.location.href = '/painel/login/'; throw new Error('Sessão expirada.'); }
  if (!res.ok) throw new Error(out.error || 'Não foi possível concluir. Tente de novo.');
  return out;
}
export async function upload(file) {
  const form = new FormData(); form.append('file', file);
  return (await api('upload', { method: 'POST', form })).url;
}
