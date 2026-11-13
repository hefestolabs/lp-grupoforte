// E-mails do painel pelo Resend. A chave é digitada no próprio painel e fica cifrada no banco;
// ela nunca volta para o navegador nem aparece em logs.
import crypto from 'node:crypto';
import { secret } from './auth';
import { kvGet, kvSet } from './store';

const DEFAULT_SITE = process.env.SITE_URL || 'https://white-badger-810180.hostingersite.com';
const key = async () => crypto.createHash('sha256').update('mail:' + (await secret())).digest();

async function encrypt(text) {
  const iv = crypto.randomBytes(12); const c = crypto.createCipheriv('aes-256-gcm', await key(), iv);
  const enc = Buffer.concat([c.update(text, 'utf8'), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString('base64url')).join('.');
}
async function decrypt(packed) {
  try {
    const [iv, tag, enc] = String(packed).split('.').map((x) => Buffer.from(x, 'base64url'));
    const d = crypto.createDecipheriv('aes-256-gcm', await key(), iv); d.setAuthTag(tag);
    return Buffer.concat([d.update(enc), d.final()]).toString('utf8');
  } catch { return ''; }
}

export async function getMailSettings() {
  const s = (await kvGet('mail')) || {};
  const apiKey = s.key ? await decrypt(s.key) : '';
  return { apiKey, from: s.from || '', siteUrl: (s.siteUrl || DEFAULT_SITE).replace(/\/+$/, ''), ready: Boolean(apiKey && s.from) };
}
// O que o painel pode ver: nunca a chave, só se existe e os 4 últimos caracteres.
export async function publicMailSettings() {
  const s = await getMailSettings();
  return { hasKey: Boolean(s.apiKey), keyHint: s.apiKey ? `••••${s.apiKey.slice(-4)}` : '', from: s.from, siteUrl: s.siteUrl, ready: s.ready };
}
export async function saveMailSettings({ apiKey, from, siteUrl, removeKey }) {
  const cur = (await kvGet('mail')) || {};
  const next = { ...cur };
  if (removeKey) delete next.key;
  if (typeof apiKey === 'string' && apiKey.trim()) {
    const k = apiKey.trim();
    if (!/^re_[A-Za-z0-9_-]{10,200}$/.test(k)) throw new Error('A chave do Resend começa com "re_". Confira se copiou inteira.');
    next.key = await encrypt(k);
  }
  if (typeof from === 'string') {
    const f = from.trim().slice(0, 200);
    if (f && !/^([^<>]{1,100}<)?[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}>?$/.test(f)) throw new Error('Remetente inválido. Use o formato: Grupo Forte <painel@seudominio.com.br>');
    next.from = f;
  }
  if (typeof siteUrl === 'string' && siteUrl.trim()) {
    let u; try { u = new URL(siteUrl.trim()); } catch { throw new Error('Endereço do site inválido.'); }
    if (u.protocol !== 'https:') throw new Error('O endereço do site precisa começar com https://');
    next.siteUrl = u.origin;
  }
  await kvSet('mail', next);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function layout(title, body, button) {
  return `<div style="background:#f1f3f6;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#1d2733">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
<div style="background:#003b6e;padding:20px 28px;color:#fff;font-size:18px;font-weight:bold">GRUPO<span style="color:#ffb000">FORTE</span> · Painel do site</div>
<div style="padding:28px"><h1 style="margin:0 0 12px;font-size:20px">${esc(title)}</h1>${body}
${button ? `<p style="margin:24px 0"><a href="${esc(button.url)}" style="display:inline-block;background:#ee7302;color:#fff;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:8px">${esc(button.label)}</a></p><p style="font-size:13px;color:#5d6b7a">Se o botão não funcionar, copie este endereço:<br>${esc(button.url)}</p>` : ''}
</div></div></div>`;
}

export async function sendMail({ to, subject, title, lines, button }) {
  const s = await getMailSettings();
  if (!s.ready) throw Object.assign(new Error('O envio de e-mails ainda não foi configurado.'), { code: 'MAIL_OFF' });
  const html = layout(title, lines.map((l) => `<p style="margin:0 0 12px;line-height:1.5">${esc(l)}</p>`).join(''), button);
  const text = [title, '', ...lines, button ? `\n${button.label}: ${button.url}` : ''].join('\n');
  let res;
  try {
    res = await fetch(`${process.env.RESEND_API_URL || 'https://api.resend.com'}/emails`, { method: 'POST', headers: { Authorization: `Bearer ${s.apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: s.from, to: [to], subject, html, text }), signal: AbortSignal.timeout(15000) });
  } catch { throw new Error('Não foi possível falar com o Resend. Tente de novo.'); }
  if (!res.ok) {
    let detail = ''; try { detail = (await res.json()).message || ''; } catch {}
    const hint = res.status === 401 ? 'A chave do Resend foi recusada.' : res.status === 403 || res.status === 422 ? 'O Resend recusou o envio. Confira se o domínio do remetente está verificado.' : 'O Resend não aceitou o envio.';
    throw new Error(`${hint}${detail ? ` (${String(detail).slice(0, 160)})` : ''}`);
  }
}

export async function passwordLinkMail(user, token, kind) {
  const { siteUrl } = await getMailSettings();
  const url = `${siteUrl}/painel/redefinir/?u=${user.id}&t=${token}`;
  if (kind === 'convite') return sendMail({ to: user.email, subject: 'Seu acesso ao painel do site Grupo Forte', title: `Olá, ${user.name.split(' ')[0]}`, lines: ['Um acesso ao painel do site do Grupo Forte foi criado para você.', 'Clique no botão para criar a sua senha. O link vale por 48 horas.'], button: { label: 'Criar minha senha', url } });
  return sendMail({ to: user.email, subject: 'Redefinir a senha do painel Grupo Forte', title: 'Redefinir senha', lines: ['Recebemos um pedido para redefinir a sua senha do painel.', 'O link vale por 30 minutos e só pode ser usado uma vez. Se não foi você, ignore este e-mail: a senha atual continua valendo.'], button: { label: 'Criar nova senha', url } });
}
