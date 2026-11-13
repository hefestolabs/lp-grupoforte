// Login do painel: senha com scrypt, sessão em cookie assinado (HMAC), limite de tentativas.
import crypto from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { kvDelete, kvGet, kvSet, usersList } from './store';

const COOKIE = 'gf_painel';
const MAX_AGE = 60 * 60 * 12; // 12 horas

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}
export function verifyPassword(password, stored) {
  const [alg, saltHex, hashHex] = String(stored).split('$');
  if (alg !== 'scrypt' || !saltHex || !hashHex) return false;
  const hash = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), 64);
  const want = Buffer.from(hashHex, 'hex');
  return want.length === hash.length && crypto.timingSafeEqual(hash, want);
}
export function passwordProblem(pw) {
  if (typeof pw !== 'string' || pw.length < 10) return 'A senha precisa ter pelo menos 10 caracteres.';
  if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) return 'A senha precisa ter letras e números.';
  return null;
}

let secretCache;
export async function secret() {
  if (secretCache) return secretCache;
  let s = await kvGet('session_secret');
  if (!s) { s = crypto.randomBytes(48).toString('hex'); await kvSet('session_secret', s); }
  return (secretCache = s);
}
const sign = (payload, key) => crypto.createHmac('sha256', key).update(payload).digest('base64url');

export async function createSession(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, u: user.username, pv: passVersion(user), exp: Math.floor(Date.now() / 1000) + MAX_AGE })).toString('base64url');
  const value = `${payload}.${sign(payload, await secret())}`;
  (await cookies()).set(COOKIE, value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/painel', maxAge: MAX_AGE });
}
export async function destroySession() { (await cookies()).set(COOKIE, '', { path: '/painel', maxAge: 0 }); }

// Devolve o usuário logado (conferido no banco a cada chamada) ou null.
export async function getSession() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split('.');
  if (!payload || !sig) return null;
  const good = sign(payload, await secret());
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  let data; try { data = JSON.parse(Buffer.from(payload, 'base64url').toString()); } catch { return null; }
  if (!data.exp || data.exp < Date.now() / 1000) return null;
  const user = (await usersList()).find((x) => x.id === data.id && x.username === data.u);
  // Trocar a senha encerra as sessões abertas com a senha antiga.
  if (!user || data.pv !== passVersion(user)) return null;
  return { id: user.id, username: user.username, email: user.email || '', name: user.name, mustChange: Boolean(user.must_change) };
}

// Proteção contra envio de formulário vindo de outro site.
export async function sameOrigin() {
  const h = await headers();
  const origin = h.get('origin');
  if (!origin) return false;
  try { return new URL(origin).host === (h.get('x-forwarded-host') || h.get('host')); } catch { return false; }
}

// Limite de tentativas de login por IP + usuário (memória do processo).
const attempts = new Map();
export function loginAllowed(key) {
  const now = Date.now(); const a = (attempts.get(key) || []).filter((t) => now - t < 10 * 60 * 1000);
  attempts.set(key, a); return a.length < 6;
}
export function loginFailed(key) { attempts.set(key, [...(attempts.get(key) || []), Date.now()]); }
export async function clientIp() { const h = await headers(); return (h.get('x-forwarded-for') || '').split(',')[0].trim() || 'local'; }

const passVersion = (user) => crypto.createHash('sha256').update(String(user.pass_hash)).digest('base64url').slice(0, 12);
export const normEmail = (e) => String(e || '').trim().toLowerCase();
export const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 190;
export async function findUser(login) {
  const l = normEmail(login);
  return (await usersList()).find((u) => u.username === l || (u.email && u.email.toLowerCase() === l)) || null;
}

// Link de uso único para definir a senha (recuperação e convite). Guardamos só o hash do código.
export async function createPasswordToken(user, minutes) {
  const token = crypto.randomBytes(32).toString('base64url');
  await kvSet(`reset:${user.id}`, { hash: crypto.createHash('sha256').update(token).digest('hex'), exp: Date.now() + minutes * 60000, pv: passVersion(user) });
  return token;
}
export async function consumePasswordToken(userId, token) {
  const rec = await kvGet(`reset:${Number(userId)}`);
  if (!rec || rec.exp < Date.now()) return null;
  const hash = crypto.createHash('sha256').update(String(token)).digest('hex');
  if (hash.length !== rec.hash.length || !crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(rec.hash))) return null;
  const user = (await usersList()).find((u) => u.id === Number(userId));
  if (!user || passVersion(user) !== rec.pv) return null;
  return { user, done: () => kvDelete(`reset:${user.id}`) };
}
