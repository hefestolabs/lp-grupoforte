import EditBridge from '@/components/EditBridge';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Reveal from '@/components/Reveal';
import { getContent, previewUserId } from '@/lib/content';

export const dynamic = 'force-dynamic'; // o conteúdo vem do painel

export default async function SiteLayout({ children }) {
  const { contatos } = await getContent();
  const previa = Boolean(await previewUserId());
  const nav = [
    { label: 'Home', href: '/', page: 'home' },
    { label: 'Sobre nós', href: '/sobre-nos/', page: 'sobre' },
    { label: 'Produtos', href: '/#PRODUTOSANCORA', page: 'produtos' },
    { label: 'Trabalhe conosco', href: contatos.vagas || '/trabalhe-conosco/', external: Boolean(contatos.vagas), page: 'trabalhe' },
  ];
  return (
    <>
      <a className="skip" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Header nav={nav} whatsapp={contatos.whatsapp} />
      <main id="conteudo">{children}</main>
      <Footer c={contatos} />
      {previa ? <EditBridge /> : <Reveal />}
    </>
  );
}
