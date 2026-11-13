// Armazenamento do painel: MySQL em produção (variáveis DB_* da hospedagem) e arquivo local em desenvolvimento.
import fs from 'node:fs';
import path from 'node:path';

const env = (k) => process.env[k];
const hasDb = () => Boolean(env('DATABASE_URL') || (env('DB_HOST') && env('DB_USER')));

let poolPromise;
async function pool() {
  if (!poolPromise) {
    poolPromise = (async () => {
      const mysql = (await import('mysql2/promise')).default;
      const base = { waitForConnections: true, connectionLimit: 5, charset: 'utf8mb4', dateStrings: true };
      // "localhost" pode resolver para IPv6 (::1), onde o usuário do banco não tem permissão: força IPv4.
      const host = !env('DB_HOST') || env('DB_HOST') === 'localhost' ? '127.0.0.1' : env('DB_HOST');
      const p = env('DATABASE_URL') && !env('DB_HOST')
        ? mysql.createPool({ uri: env('DATABASE_URL'), ...base })
        : mysql.createPool({ host, port: Number(env('DB_PORT') || 3306), user: env('DB_USER'), password: env('DB_PASSWORD'), database: env('DB_NAME') || env('DB_DATABASE'), ...base });
      await p.query('CREATE TABLE IF NOT EXISTS gf_kv (k VARCHAR(64) PRIMARY KEY, v LONGTEXT NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) CHARACTER SET utf8mb4');
      await p.query('CREATE TABLE IF NOT EXISTS gf_media (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(190) NOT NULL, mime VARCHAR(100) NOT NULL, size INT NOT NULL, data LONGBLOB NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) CHARACTER SET utf8mb4');
      await p.query('CREATE TABLE IF NOT EXISTS gf_posts (id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(190) NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, excerpt TEXT, content MEDIUMTEXT, category VARCHAR(120), image VARCHAR(500), image_alt VARCHAR(255), status VARCHAR(20) NOT NULL DEFAULT \'publicado\', published_at DATETIME NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) CHARACTER SET utf8mb4');
      await p.query('CREATE TABLE IF NOT EXISTS gf_users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(60) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL, pass_hash VARCHAR(255) NOT NULL, must_change TINYINT NOT NULL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) CHARACTER SET utf8mb4');
      // Coluna de e-mail (adicionada depois da primeira versão do painel).
      try { await p.query('ALTER TABLE gf_users ADD COLUMN email VARCHAR(190) NULL UNIQUE'); } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }
      // Papel do acesso: 'admin' vê tudo; 'editor' só edita o conteúdo. O acesso mais antigo vira admin.
      try { await p.query("ALTER TABLE gf_users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'editor'"); } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }
      await p.query("UPDATE gf_users SET role = 'admin' WHERE id = (SELECT id FROM (SELECT MIN(id) id FROM gf_users) t) AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM gf_users WHERE role = 'admin') a)");
      return p;
    })().catch((e) => { poolPromise = null; throw e; });
  }
  return poolPromise;
}

// ---------- modo arquivo (desenvolvimento) ----------
const DIR = path.join(process.cwd(), '.data');
const FILE = path.join(DIR, 'store.json');
function fread() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return { kv: {}, posts: [], users: [], media: [], seq: 0 }; }
}
function fwrite(d) { fs.mkdirSync(DIR, { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(d)); }

// ---------- chave/valor ----------
export async function kvGet(key) {
  if (!hasDb()) return fread().kv[key] ?? null;
  const [rows] = await (await pool()).query('SELECT v FROM gf_kv WHERE k = ?', [key]);
  return rows.length ? JSON.parse(rows[0].v) : null;
}
export async function kvSet(key, value) {
  if (!hasDb()) { const d = fread(); d.kv[key] = value; return fwrite(d); }
  await (await pool()).query('INSERT INTO gf_kv (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [key, JSON.stringify(value)]);
}

// ---------- imagens ----------
export async function mediaPut({ name, mime, buffer }) {
  if (!hasDb()) {
    const d = fread(); const id = (d.seq += 1); d.media.push({ id, name, mime, size: buffer.length });
    fs.mkdirSync(path.join(DIR, 'media'), { recursive: true }); fs.writeFileSync(path.join(DIR, 'media', String(id)), buffer); fwrite(d); return id;
  }
  const [r] = await (await pool()).query('INSERT INTO gf_media (name, mime, size, data) VALUES (?, ?, ?, ?)', [name, mime, buffer.length, buffer]);
  return r.insertId;
}
export async function mediaGet(id) {
  if (!hasDb()) {
    const m = fread().media.find((x) => x.id === Number(id)); if (!m) return null;
    return { ...m, data: fs.readFileSync(path.join(DIR, 'media', String(m.id))) };
  }
  const [rows] = await (await pool()).query('SELECT name, mime, data FROM gf_media WHERE id = ?', [Number(id)]);
  return rows[0] || null;
}

// ---------- notícias ----------
const POST_COLS = 'id, slug, title, excerpt, content, category, image, image_alt, status, published_at';
export async function postsList({ onlyPublished = true } = {}) {
  if (!hasDb()) return fread().posts.filter((p) => !onlyPublished || p.status === 'publicado').sort((a, b) => String(b.published_at).localeCompare(String(a.published_at)));
  const [rows] = await (await pool()).query(`SELECT ${POST_COLS} FROM gf_posts ${onlyPublished ? "WHERE status = 'publicado'" : ''} ORDER BY published_at DESC, id DESC`);
  return rows;
}
export async function postSave(p) {
  const row = [p.slug, p.title, p.excerpt || '', p.content || '', p.category || '', p.image || '', p.image_alt || '', p.status || 'publicado', p.published_at];
  if (!hasDb()) {
    const d = fread();
    if (d.posts.some((x) => x.slug === p.slug && x.id !== p.id)) throw Object.assign(new Error('slug'), { code: 'ER_DUP_ENTRY' });
    if (p.id) { const i = d.posts.findIndex((x) => x.id === p.id); if (i < 0) return null; d.posts[i] = { ...d.posts[i], ...p }; fwrite(d); return p.id; }
    const id = (d.seq += 1); d.posts.push({ ...p, id }); fwrite(d); return id;
  }
  const db = await pool();
  if (p.id) { await db.query('UPDATE gf_posts SET slug=?, title=?, excerpt=?, content=?, category=?, image=?, image_alt=?, status=?, published_at=? WHERE id=?', [...row, p.id]); return p.id; }
  const [r] = await db.query('INSERT INTO gf_posts (slug, title, excerpt, content, category, image, image_alt, status, published_at) VALUES (?,?,?,?,?,?,?,?,?)', row);
  return r.insertId;
}
export async function postDelete(id) {
  if (!hasDb()) { const d = fread(); d.posts = d.posts.filter((x) => x.id !== Number(id)); return fwrite(d); }
  await (await pool()).query('DELETE FROM gf_posts WHERE id = ?', [Number(id)]);
}

// ---------- usuários do painel ----------
export async function usersList() {
  if (!hasDb()) { const u = fread().users; if (u.length && !u.some((x) => x.role === 'admin')) u[0].role = 'admin'; return u.map((x) => ({ role: 'editor', ...x })); }
  const [rows] = await (await pool()).query('SELECT id, username, email, name, pass_hash, must_change, role FROM gf_users ORDER BY id');
  return rows;
}
export async function userSave(u) {
  if (!hasDb()) {
    const d = fread();
    if (d.users.some((x) => x.id !== u.id && (x.username === u.username || (u.email && x.email === u.email)))) throw Object.assign(new Error('username'), { code: 'ER_DUP_ENTRY' });
    if (u.id) { const i = d.users.findIndex((x) => x.id === u.id); d.users[i] = { ...d.users[i], ...u }; } else d.users.push({ ...u, id: (d.seq += 1) });
    return fwrite(d);
  }
  const db = await pool();
  if (u.id) await db.query('UPDATE gf_users SET name=?, email=?, pass_hash=?, must_change=? WHERE id=?', [u.name, u.email || null, u.pass_hash, u.must_change ? 1 : 0, u.id]);
  else await db.query('INSERT INTO gf_users (username, email, name, pass_hash, must_change, role) VALUES (?,?,?,?,?,?)', [u.username, u.email || null, u.name, u.pass_hash, u.must_change ? 1 : 0, u.role === 'admin' ? 'admin' : 'editor']);
}
export async function userDelete(id) {
  if (!hasDb()) { const d = fread(); d.users = d.users.filter((x) => x.id !== Number(id)); return fwrite(d); }
  await (await pool()).query('DELETE FROM gf_users WHERE id = ?', [Number(id)]);
}
export const storeMode = () => (hasDb() ? 'mysql' : 'arquivo');

export async function kvDelete(key) {
  if (!hasDb()) { const d = fread(); delete d.kv[key]; return fwrite(d); }
  await (await pool()).query('DELETE FROM gf_kv WHERE k = ?', [key]);
}
