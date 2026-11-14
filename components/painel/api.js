// Chamadas do painel ao servidor.
// Avisa a barra de progresso do topo quantas chamadas estão em andamento.
let pending = 0;
function net(d) {
  pending = Math.max(0, pending + d);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('gf-net', { detail: pending }));
}
export async function api(path, { method = 'GET', data, form } = {}) {
  const track = path !== 'draft'; // o rascunho do editor salva sozinho a cada alteração: não mostra a barra
  if (track) net(1);
  let res;
  try {
    res = await fetch(`/painel/api/${path}/`, {
      method,
      credentials: 'same-origin',
      headers: data ? { 'Content-Type': 'application/json' } : undefined,
      body: form || (data ? JSON.stringify(data) : undefined),
    });
  } catch {
    throw new Error('Sem conexão com o servidor. Tente de novo.');
  } finally {
    if (track) net(-1);
  }
  let out = {};
  try {
    out = await res.json();
  } catch {}
  if (res.status === 401 && path !== 'login') {
    window.location.href = '/painel/login/';
    throw new Error('Sessão expirada.');
  }
  if (!res.ok) throw new Error(out.error || 'Não foi possível concluir. Tente de novo.');
  return out;
}
// Envio de imagem com progresso (0 a 1).
export function upload(file, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/painel/api/upload/');
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    xhr.onerror = () => reject(new Error('Sem conexão com o servidor. Tente de novo.'));
    xhr.onload = () => {
      const out = xhr.response || {};
      if (xhr.status === 401) {
        window.location.href = '/painel/login/';
        reject(new Error('Sessão expirada.'));
        return;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(out.error || 'Não foi possível concluir. Tente de novo.'));
        return;
      }
      resolve(out.url);
    };
    xhr.send(form);
  });
}
