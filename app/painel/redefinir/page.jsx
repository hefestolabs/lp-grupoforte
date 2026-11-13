import AuthForm from '@/components/painel/AuthForm';

export default async function Redefinir({ searchParams }) {
  const { u = '', t = '' } = await searchParams;
  return <AuthForm mode="reset" u={String(u)} t={String(t)} />;
}
