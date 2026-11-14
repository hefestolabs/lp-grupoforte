// Descrição das telas do painel: cada seção vira um formulário. Tipos: text, textarea, url, number, image, select, list.
const ICONES = [
  ['industries', 'Indústria'],
  ['truck', 'Caminhão'],
  ['headphone', 'Atendimento'],
  ['city', 'Prédios'],
  ['award', 'Selo'],
];
const img = (key, label, help) => ({ key, label, type: 'image', help });

export const SCHEMA = [
  {
    id: 'home',
    titulo: 'Página inicial',
    pagina: '/',
    grupos: [
      {
        id: 'hero',
        titulo: 'Topo (hero)',
        campos: [
          { key: 'heroVideo', label: 'Vídeo de fundo (link do YouTube)', type: 'url', help: 'Cole o link do vídeo. Deixe vazio para ficar só a arte azul.' },
          { key: 'heroVideoInicio', label: 'Começar no segundo', type: 'number' },
          img('heroLogo', 'Logo sobre o vídeo', 'PNG com fundo transparente.'),
        ],
      },
      {
        id: 'marcas',
        titulo: 'Marcas',
        campos: [
          { key: 'marcasTitulo', label: 'Título', type: 'text' },
          {
            key: 'marcas',
            label: 'Cartões das marcas',
            type: 'list',
            nomeItem: 'marca',
            rotulo: 'nome',
            campos: [
              { key: 'nome', label: 'Nome', type: 'text' },
              img('img', 'Imagem do cartão'),
              { key: 'texto', label: 'Texto', type: 'textarea' },
              { key: 'link', label: 'Link do botão "Ver detalhes"', type: 'url' },
            ],
          },
        ],
      },
      {
        id: 'unidades',
        titulo: 'Unidades',
        campos: [
          { key: 'unidadesTitulo', label: 'Título', type: 'text' },
          {
            key: 'unidades',
            label: 'Unidades',
            type: 'list',
            nomeItem: 'unidade',
            rotulo: 'local',
            campos: [
              { key: 'tipo', label: 'Tipo', type: 'text' },
              { key: 'local', label: 'Cidade, Estado', type: 'text' },
              { key: 'texto', label: 'Descrição', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'numeros',
        titulo: 'Números',
        campos: [
          {
            key: 'contadores',
            label: 'Contadores (faixa laranja)',
            type: 'list',
            nomeItem: 'contador',
            rotulo: 'titulo',
            campos: [
              { key: 'titulo', label: 'Título', type: 'text' },
              { key: 'valor', label: 'Número', type: 'number' },
              { key: 'prefixo', label: 'Antes do número (ex.: +)', type: 'text' },
              { key: 'sufixo', label: 'Depois do número (ex.: %)', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'instagram',
        titulo: 'Instagram',
        campos: [
          { key: 'instagramTexto', label: 'Texto do cartão', type: 'textarea' },
          { key: 'instagramBotao', label: 'Texto do botão', type: 'text' },
          img('instagramArte', 'Arte do feed', 'Imagem vertical (ex.: 1080×1350).'),
          { key: 'instagramPost', label: 'Link da publicação (botão do coração)', type: 'url' },
        ],
      },
      {
        id: 'servicos',
        titulo: 'Serviços',
        campos: [
          { key: 'servicosTitulo', label: 'Título', type: 'text' },
          {
            key: 'servicos',
            label: 'Cartões de serviço',
            type: 'list',
            nomeItem: 'serviço',
            rotulo: 'titulo',
            campos: [
              { key: 'icone', label: 'Ícone', type: 'select', opcoes: ICONES },
              { key: 'titulo', label: 'Título', type: 'text' },
              { key: 'texto', label: 'Texto', type: 'textarea' },
              { key: 'link', label: 'Link do "Saiba mais"', type: 'url' },
            ],
          },
          { key: 'chamadaTexto', label: 'Cartão azul: texto', type: 'textarea' },
          { key: 'chamadaBotao', label: 'Cartão azul: botão', type: 'text' },
          { key: 'chamadaLink', label: 'Cartão azul: link', type: 'url' },
        ],
      },
      {
        id: 'info',
        titulo: 'Informações',
        campos: [
          { key: 'infoTitulo', label: 'Título', type: 'text' },
          { key: 'infoTexto', label: 'Texto', type: 'textarea' },
          {
            key: 'infoItens',
            label: 'Itens da sanfona',
            type: 'list',
            nomeItem: 'item',
            rotulo: 'titulo',
            campos: [
              { key: 'titulo', label: 'Título', type: 'text' },
              { key: 'texto', label: 'Texto ao abrir', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'parceiros',
        titulo: 'Parceiros',
        campos: [
          {
            key: 'parceiros',
            label: 'Logotipos do carrossel',
            type: 'list',
            nomeItem: 'parceiro',
            rotulo: 'nome',
            campos: [{ key: 'nome', label: 'Nome da empresa', type: 'text' }, img('img', 'Logotipo', 'PNG quadrado, branco com fundo transparente.')],
          },
        ],
      },
      { id: 'noticias', titulo: 'Notícias', campos: [{ key: 'noticiasTitulo', label: 'Título da seção', type: 'text' }] },
    ],
  },
  {
    id: 'sobre',
    titulo: 'Sobre nós',
    pagina: '/sobre-nos/',
    grupos: [
      {
        id: 'topo',
        titulo: 'Topo',
        campos: [
          img('capa', 'Imagem do banner do topo'),
          img('banner', 'Foto grande (fábrica)'),
          { key: 'bannerLink', label: 'Link ao clicar na foto', type: 'url' },
        ],
      },
      {
        id: 'texto',
        titulo: 'Texto',
        campos: [
          { key: 'titulo', label: 'Título', type: 'textarea' },
          { key: 'texto', label: 'Texto', type: 'textarea', help: 'Deixe uma linha em branco para separar parágrafos.' },
          {
            key: 'destaques',
            label: 'Caixas de destaque',
            type: 'list',
            nomeItem: 'destaque',
            rotulo: 'titulo',
            campos: [
              { key: 'icone', label: 'Ícone', type: 'select', opcoes: ICONES },
              { key: 'titulo', label: 'Título', type: 'text' },
              { key: 'texto', label: 'Texto', type: 'textarea' },
            ],
          },
          img('foto', 'Foto ao lado do texto'),
        ],
      },
      {
        id: 'valores',
        titulo: 'Missão, Visão e Valores',
        campos: [
          {
            key: 'valores',
            label: 'Cartões',
            type: 'list',
            nomeItem: 'cartão',
            rotulo: 'titulo',
            campos: [
              { key: 'titulo', label: 'Título', type: 'text' },
              img('img', 'Ícone'),
              { key: 'texto', label: 'Texto', type: 'textarea', help: 'Use **assim** para negrito.' },
            ],
          },
        ],
      },
      {
        id: 'logos',
        titulo: 'Logotipos das marcas',
        campos: [
          {
            key: 'logos',
            label: 'Logotipos',
            type: 'list',
            nomeItem: 'logotipo',
            rotulo: 'nome',
            campos: [{ key: 'nome', label: 'Nome', type: 'text' }, img('img', 'Logotipo')],
          },
        ],
      },
      {
        id: 'lideres',
        titulo: 'Líderes',
        campos: [
          {
            key: 'lideres',
            label: 'Líderes',
            type: 'list',
            nomeItem: 'líder',
            rotulo: 'nome',
            campos: [
              { key: 'nome', label: 'Nome', type: 'text' },
              { key: 'cargo', label: 'Cargo', type: 'text' },
              { key: 'frase', label: 'Frase', type: 'textarea' },
              img('foto', 'Foto pequena (redonda)'),
              { key: 'video', label: 'Link do vídeo (YouTube)', type: 'url', help: 'Vazio mostra o cartão "Vídeo em breve".' },
              img('capa', 'Capa do vídeo', 'Imagem vertical.'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'paginas',
    titulo: 'Produtos e Trabalhe conosco',
    pagina: '/produtos/',
    paginas: { produtos: '/produtos/', trabalhe: '/trabalhe-conosco/' },
    grupos: [
      {
        id: 'produtos',
        titulo: 'Produtos',
        campos: [
          img('produtosCapa', 'Imagem do banner'),
          { key: 'produtosBotaoLink', label: 'Link do botão "Saiba mais"', type: 'url' },
          { key: 'catalogoTexto', label: 'Catálogo: texto', type: 'textarea' },
          { key: 'catalogoBotao', label: 'Catálogo: texto do botão', type: 'text' },
          { key: 'catalogoLink', label: 'Catálogo: link do botão', type: 'url', help: 'Os cartões das marcas são os mesmos da página inicial.' },
        ],
      },
      {
        id: 'trabalhe',
        titulo: 'Trabalhe conosco',
        campos: [
          img('trabalheCapa', 'Imagem do banner'),
          { key: 'unidadeTitulo', label: 'Título da unidade', type: 'text' },
          { key: 'unidadeEndereco', label: 'Endereço', type: 'text' },
          { key: 'unidadeTexto', label: 'Descrição', type: 'text' },
          img('unidadeFoto', 'Foto da unidade'),
          {
            key: 'mapaBusca',
            label: 'Local mostrado no mapa',
            type: 'text',
            help: 'Endereço completo da unidade ou coordenadas no formato -11.0000,-61.0000 (latitude,longitude). Para pegar as coordenadas: no Google Maps, clique com o botão direito no local.',
          },
          { key: 'trabalheBotaoLink', label: 'Link do botão "Entrar em contato"', type: 'url' },
        ],
      },
    ],
  },
  {
    id: 'contatos',
    titulo: 'Contatos e rodapé',
    pagina: '/',
    grupos: [
      {
        id: 'contato',
        titulo: 'Contato',
        campos: [
          { key: 'whatsapp', label: 'Link do WhatsApp', type: 'url', help: 'Formato: https://wa.me/55DDDNUMERO' },
          { key: 'telefone', label: 'Telefone (como aparece)', type: 'text' },
          { key: 'email', label: 'E-mail', type: 'text' },
          { key: 'endereco', label: 'Endereço', type: 'text' },
        ],
      },
      {
        id: 'redes',
        titulo: 'Redes e links',
        campos: [
          { key: 'instagram', label: 'Instagram', type: 'url' },
          { key: 'facebook', label: 'Facebook', type: 'url' },
          { key: 'youtube', label: 'YouTube', type: 'url' },
          { key: 'vagas', label: 'Página de vagas (menu "Trabalhe conosco")', type: 'url' },
        ],
      },
      {
        id: 'rodape',
        titulo: 'Rodapé',
        campos: [
          { key: 'slogan', label: 'Slogan', type: 'text' },
          { key: 'copyright', label: 'Texto de copyright', type: 'textarea' },
        ],
      },
    ],
  },
];
