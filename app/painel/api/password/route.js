import { body, fail, guard, json } from '@/lib/api';
import { createSession, hashPassword, passwordProblem, verifyPassword } from '@/lib/auth';
import { userSave, usersList } from '@/lib/store';

export async function POST(req) {
  const g = await guard({ allowMustChange: true }); if (g.error) return g.error;
  const { current = '', next = '' } = await body(req);
  const user = (await usersList()).find((u) => u.id === g.user.id);
  if (!user || !verifyPassword(String(current), user.pass_hash)) return fail('A senha atual não confere.');
  const problem = passwordProblem(next); if (problem) return fail(problem);
  if (next === current) return fail('A nova senha precisa ser diferente da atual.');
  await userSave({ ...user, pass_hash: hashPassword(next), must_change: false });
  await createSession(user);
  return json({ ok: true });
}
