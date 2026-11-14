import Anthropic from '@anthropic-ai/sdk';
import { body, fail, guard, json } from '@/lib/api';
import { loginAllowed, loginFailed } from '@/lib/auth';
import { supportChat } from '@/lib/support';

export const maxDuration = 120;

export async function POST(req) {
  const g = await guard(); if (g.error) return g.error;
  const key = `chat|${g.user.id}`;
  if (!loginAllowed(key, 30)) return fail('Muitas mensagens em pouco tempo. Aguarde alguns minutos.', 429);
  loginFailed(key);
  const { messages, tela } = await body(req);
  if (!Array.isArray(messages) || !messages.length || messages.length > 30) return fail('Conversa inválida.');
  const history = [];
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string' || !m.content.trim()) return fail('Conversa inválida.');
    if (m.content.length > 4000) return fail('A mensagem é longa demais. Resuma em até 4.000 caracteres.');
    history.push({ role: m.role, content: m.content.trim() });
  }
  if (history[0].role !== 'user' || history[history.length - 1].role !== 'user') return fail('Conversa inválida.');
  try { return json(await supportChat(g.user, history, String(tela || '').slice(0, 60))); }
  catch (e) {
    if (e.code === 'AI_OFF') return fail(e.message, 409);
    if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) return fail('A chave da IA foi recusada. Avise o administrador.', 502);
    if (e instanceof Anthropic.RateLimitError) return fail('O assistente está ocupado. Tente de novo em instantes.', 503);
    if (e instanceof Anthropic.APIConnectionError) return fail('Não foi possível falar com o assistente. Tente de novo.', 503);
    if (e instanceof Anthropic.APIError) { console.error('Suporte IA:', e.status, e.message); return fail('O assistente não respondeu. Tente de novo ou abra uma demanda.', 502); }
    console.error('Suporte IA:', e.message); return fail('O assistente não respondeu. Tente de novo ou abra uma demanda.', 500);
  }
}
