import { redirect } from 'next/navigation';
import AuthForm from '@/components/painel/AuthForm';
import { usersList } from '@/lib/store';

// Primeiro acesso: só existe enquanto nenhum usuário foi criado.
export default async function Configurar() {
  if ((await usersList()).length) redirect('/painel/login/');
  return <AuthForm mode="setup" />;
}
