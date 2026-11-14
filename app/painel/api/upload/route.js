import { fail, guard, json } from '@/lib/api';
import { mediaPut } from '@/lib/store';

const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const MAX = 6 * 1024 * 1024;

// Confere os primeiros bytes do arquivo, para não aceitar outro tipo renomeado como imagem.
function sniff(b) {
  if (b[0] === 0xff && b[1] === 0xd8) return 'image/jpeg';
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
  if (b.subarray(0, 3).toString() === 'GIF') return 'image/gif';
  return null;
}

export async function POST(req) {
  const g = await guard();
  if (g.error) return g.error;
  let file;
  try {
    file = (await req.formData()).get('file');
  } catch {
    return fail('Envio inválido.');
  }
  if (!file || typeof file === 'string') return fail('Nenhum arquivo enviado.');
  if (file.size > MAX) return fail('A imagem passa de 6 MB. Reduza e envie de novo.');
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniff(buffer);
  if (!mime || !TYPES[mime]) return fail('Formato não aceito. Use JPG, PNG, WebP ou GIF.');
  const base =
    String(file.name || 'imagem')
      .replace(/\.[^.]+$/, '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'imagem';
  const name = `${base}.${TYPES[mime]}`;
  const id = await mediaPut({ name, mime, buffer });
  return json({ ok: true, url: `/midia/${id}/${name}` });
}
