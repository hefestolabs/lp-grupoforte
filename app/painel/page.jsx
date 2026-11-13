import { redirect } from 'next/navigation';
import PainelApp from '@/components/painel/PainelApp';
import { getSession } from '@/lib/auth';
import { getContent } from '@/lib/content';
import { getAllPostsAdmin } from '@/lib/data';
import { SCHEMA } from '@/lib/schema';
import { storeMode, usersList } from '@/lib/store';

export default async function Painel() {
  const users = await usersList();
  if (!users.length) redirect('/painel/configurar/');
  const user = await getSession();
  if (!user) redirect('/painel/login/');
  const [content, posts] = await Promise.all([getContent(), getAllPostsAdmin()]);
  return <PainelApp storeMode={storeMode()} user={user} schema={SCHEMA} initialContent={content} initialPosts={posts} initialUsers={user.admin ? users.map((u) => ({ id: u.id, username: u.username, email: u.email || '', name: u.name, mustChange: Boolean(u.must_change), admin: u.role === 'admin' })) : []} />;
}
