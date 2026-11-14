// Contrato de arquitetura: quem pode importar de quem.
module.exports = {
  forbidden: [
    {
      name: 'lib-nao-importa-interface',
      severity: 'error',
      comment: 'lib/ é a camada de dados e regras: não depende de componentes nem de rotas.',
      from: { path: '^lib/' },
      to: { path: '^(components|app)/' },
    },
    {
      name: 'componentes-nao-importam-rotas',
      severity: 'error',
      comment: 'Componentes não dependem de arquivos de rota.',
      from: { path: '^components/' },
      to: { path: '^app/' },
    },
    {
      name: 'site-nao-importa-painel',
      severity: 'error',
      comment: 'O site público não carrega código do painel.',
      from: { path: '^(app/\\(site\\)|components/(?!painel/))' },
      to: { path: '^components/painel/' },
    },
    {
      name: 'navegador-nao-importa-servidor',
      severity: 'error',
      comment: 'Componentes do painel rodam no navegador: não importam banco, autenticação, e-mail ou suporte do servidor.',
      from: { path: '^components/painel/' },
      to: { path: '^lib/(store|auth|mail|support|api|content|data|posts-api)\\.js$' },
    },
    { name: 'sem-ciclos', severity: 'error', comment: 'Sem dependências circulares.', from: {}, to: { circular: true } },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    enhancedResolveOptions: { extensions: ['.js', '.jsx', '.mjs', '.json'] },
    tsConfig: { fileName: 'jsconfig.json' },
  },
};
