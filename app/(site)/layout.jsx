import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic'; // o conteúdo vem do painel

export default async function SiteLayout({ children }) {
  const { contatos } = await getContent();
  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Sobre nós', href: '/sobre-nos/' },
    { label: 'Produtos', href: '/#PRODUTOSANCORA' },
    { label: 'Trabalhe conosco', href: contatos.vagas || '/trabalhe-conosco/', external: Boolean(contatos.vagas) },
  ];
  return (
    <>
      <a className="skip" href="#conteudo">Ir para o conteúdo</a>
      <Header nav={nav} whatsapp={contatos.whatsapp} />
      <main id="conteudo">{children}</main>
      <Footer c={contatos} />
      <Reveal />
    </>
  );
}
