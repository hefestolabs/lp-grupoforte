import { redirect } from 'next/navigation';
import AuthForm from '@/components/painel/AuthForm';
import { getSession } from '@/lib/auth';
import { usersList } from '@/lib/store';

export default async function Login() {
  if (!(await usersList()).length) redirect('/painel/configurar/');
  if (await getSession()) redirect('/painel/');
  return <AuthForm mode="login" />;
}
