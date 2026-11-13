// Dados fixos do site (contatos, menus, marcas). Um único lugar para editar.
export const SITE = {
  name: 'Grupo Forte',
  description: 'Tradição, inovação e qualidade no setor da construção. Argaforte, Reboforte, Dacor e Realce Tintas.',
  whatsapp: 'https://wa.me/6920180545',
  instagram: 'https://www.instagram.com/grupoforteoficial/',
  instagramPost: 'https://www.instagram.com/p/DcQf5exjcZZ/',
  vagas: 'https://argaforte.vagas.solides.com.br/',
  facebook: 'https://www.facebook.com/p/GrupoForte-100089550009681/',
  youtube: 'https://www.youtube.com/@grupoforteoficial',
  email: 'contato@argaforte.com.br',
  phone: '(69) 2018-0545',
  address: 'Rodovia BR 364, Km 233, Setor Prosperidade. Cacoal/RO',
  copyright:
    'Copyright 2025 Todos Direitos Reservados / GrupoForte Argaforte Indústria e Comércio de Argamassa Ltda CNPJ: 04.334.842/0001-30 | Inscrição Estadual: 00000000904082 Rodovia BR-364, Km 233, s/n, Zona Rural CEP 76960-970 — Cacoal – RO',
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Sobre nós', href: '/sobre-nos/' },
  { label: 'Produtos', href: '/#PRODUTOSANCORA' },
  { label: 'Trabalhe conosco', href: SITE.vagas, external: true },
];

export const MARCAS = [
  {
    nome: 'Argaforte',
    img: '/img/marca-argaforte.webp',
    texto: 'Qualidade e resistência em argamassas e rejuntes que garantem segurança e durabilidade para sua obra.',
    textoProdutos: 'Qualidade e resistência em argamassas que garantem segurança e durabilidade para sua obra.',
    href: 'https://www.instagram.com/argaforte.oficial/',
  },
  {
    nome: 'Reboforte',
    img: '/img/marca-reboforte.jpg',
    texto: 'Impermeabilizante versátil e eficiente que une proteção duradoura, alto desempenho e excelente custo-benefício.',
    href: 'https://www.instagram.com/grupoforteoficial/',
  },
  {
    nome: 'Dacor',
    img: '/img/marca-dacor.webp',
    texto: 'Cores vibrantes, acabamento impecável e tecnologia premium para transformar ambientes com proteção.',
    textoProdutos: 'Cores vibrantes, acabamento impecável e tecnologia premium para transformar ambientes com estilo e proteção.',
    href: 'https://www.instagram.com/dacortintas/',
  },
  {
    nome: 'Realce Tintas',
    img: '/img/marca-realce.webp',
    texto: 'Tintas versáteis e práticas que unem beleza, cobertura uniforme e excelente custo-benefício.',
    href: 'https://www.instagram.com/grupoforteoficial/',
  },
];
