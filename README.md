# LP Grupo Forte

Site institucional do Grupo Forte: réplica em código (Next.js) do site original feito em Elementor, com as notícias vindas de um WordPress headless.

- **Site:** https://white-badger-810180.hostingersite.com
- **Painel:** https://white-badger-810180.hostingersite.com/painel/

## Painel do cliente

Em `/painel/` um funcionário do cliente atualiza o site sem mexer em código: notícias, imagens, textos, arte do Instagram, parceiros, contadores, líderes e contatos. Cada pessoa tem usuário e senha próprios.

- Dados, imagens enviadas e usuários ficam em um banco MySQL da hospedagem (tabelas `gf_*`), lido pelas variáveis `DB_*` que a Hostinger injeta. Nada disso fica no repositório.
- O login é por e-mail e senha. Recuperação de senha e convites de novos acessos saem pelo Resend; a chave de API é digitada no próprio painel (E-mail (Resend)), fica cifrada no banco e nunca é exibida de novo.
- Sem as variáveis `DB_*` (desenvolvimento), o painel grava em `.data/`, que é ignorada pelo git.
- Telas e campos do painel são descritos em `lib/schema.js`; o conteúdo padrão está em `lib/content.js`.

## Como funciona

- O layout das páginas fica neste repositório (`app/`, `components/`, `app/globals.css`).
- Todo o conteúdo editável vem do painel (`lib/content.js`, `lib/data.js`) e aparece no site assim que é salvo, sem novo deploy.
- O WordPress em `/cms` continua instalado, mas o site não depende mais dele.

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
