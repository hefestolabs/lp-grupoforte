# LP Grupo Forte

Site institucional do Grupo Forte: réplica em código (Next.js) do site original feito em Elementor, com as notícias vindas de um WordPress headless.

- **Site:** https://white-badger-810180.hostingersite.com
- **Painel de conteúdo (WordPress):** https://white-badger-810180.hostingersite.com/cms/wp-admin

## Como funciona

- O layout das páginas fica neste repositório (`app/`, `components/`, `app/globals.css`).
- Notícias e categorias são lidas do WordPress em `/cms` (`lib/data.js`). Uma notícia publicada aparece no site em até 1 minuto, sem novo deploy.
- Contatos, menu e marcas ficam em `lib/site.js`.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `app/` | Páginas (home, sobre-nos, produtos, trabalhe-conosco, noticias, notícia, categoria) e estilos |
| `components/` | Cabeçalho, rodapé, carrossel, sanfona, contadores, grade de notícias |
| `lib/` | Dados do site, acesso ao WordPress e ícones em SVG |
| `public/img/` | Imagens |
| `docs/demandas/` | Uma demanda por arquivo (use `_modelo.md` como base) |

## Rodar localmente

```bash
npm install
```

```bash
npm run dev
```

## Publicar

O site roda na Hostinger como aplicação Node.js (Next.js, saída `.next`, Node 22, script `build`). Nunca publicar como site estático: isso sobrescreve o WordPress em `/cms`.

## Fluxo de trabalho

1. Registrar a demanda em `docs/demandas/NNN-titulo-curto.md` a partir do modelo.
2. Criar uma branch `demanda/NNN-titulo-curto` a partir de `main`.
3. Implementar, abrir pull request e revisar.
4. Após o merge, marcar a demanda como concluída.
