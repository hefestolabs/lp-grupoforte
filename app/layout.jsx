import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://white-badger-810180.hostingersite.com'),
  title: { default: 'Grupo Forte — Tradição, Inovação e Qualidade no Setor da Construção', template: '%s — Grupo Forte' },
  description: 'Tradição, inovação e qualidade no setor da construção. Argaforte, Reboforte, Dacor e Realce Tintas.',
  icons: { icon: '/img/favicon.png' },
  openGraph: { siteName: 'Grupo Forte', locale: 'pt_BR', type: 'website' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Adianta a conexão com o YouTube para o vídeo do hero abrir mais rápido */}
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://googlevideo.com" />
        {/* Liga os efeitos de entrada antes da primeira pintura; sem JavaScript o conteúdo fica visível. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js-reveal')" }} />
        <noscript><style>{'[data-reveal]{opacity:1!important;animation:none!important}'}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
