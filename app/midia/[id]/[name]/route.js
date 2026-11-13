// Entrega as imagens enviadas pelo painel.
import { mediaGet } from '@/lib/store';

export async function GET(_req, { params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return new Response('Não encontrado', { status: 404 });
  const m = await mediaGet(id);
  if (!m) return new Response('Não encontrado', { status: 404 });
  return new Response(m.data, { headers: { 'Content-Type': m.mime, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'" } });
}
