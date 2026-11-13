import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://white-badger-810180.hostingersite.com'),
  title: { default: 'Grupo Forte — Tradição, Inovação e Qualidade no Setor da Construção', template: '%s — Grupo Forte' },
  description: SITE.description,
  icons: { icon: '/img/favicon.png' },
  openGraph: { siteName: 'Grupo Forte', locale: 'pt_BR', type: 'website' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip" href="#conteudo">Ir para o conteúdo</a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
