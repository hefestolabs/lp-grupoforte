# Instruções para agentes (qualquer modelo)

Site e painel do Grupo Forte (Next.js), publicado na Hostinger. Estas regras valem para qualquer agente de IA ou pessoa que altere este repositório.

## Fluxo de trabalho obrigatório

1. **Toda tarefa começa com uma Issue no GitHub** — correção, melhoria ou nova função. Antes de alterar código, crie a issue (ou use a que já existir) com: o que se quer, por quê e o critério de pronto. Use um rótulo: `bug` (correção), `enhancement` (melhoria ou nova função) ou `documentation`.
2. **Uma branch por issue**, criada a partir da `main` atualizada: `<numero-da-issue>-<resumo-curto>` (ex.: `12-chat-provedor-ia`). Não faça commit direto na `main`.
3. **Todo deploy passa por um Pull Request** para a `main`. A descrição do PR deve:
   - mencionar a issue com palavra de fechamento: `Closes #<numero>` (uma linha por issue);
   - resumir o que mudou e como foi testado.
4. **Merge só depois da aprovação do responsável pelo projeto.** O agente abre o PR e avisa; não faz merge por conta própria, a menos que tenha sido autorizado para aquele PR.
5. **Deploy somente a partir da `main`, depois do merge.** Nada vai para o servidor a partir de branch de trabalho. Depois do deploy, confira o site no ar e comente o resultado no PR ou na issue.
6. Trabalho encontrado no caminho e fora do escopo vira **outra issue**, não entra no mesmo PR.

## Regras gerais

- Não reescreva o histórico da `main` nem descarte commits de outras sessões sem decisão do responsável.
- Nunca coloque chaves de API, senhas ou tokens no código, em commits, issues, PRs ou conversas. Segredos ficam nas variáveis do servidor ou nos campos do próprio painel (cifrados no banco).
- Telas de configuração (e-mail, IA, CRM, acessos) são restritas ao administrador do painel; não exponha esses dados a editores.
- Antes de abrir o PR: `npm run quality` e `npm run build` precisam passar e a mudança precisa ter sido testada. O CI (GitHub Actions) roda o mesmo em cada PR.
- **Commits no padrão Conventional Commits**, validados pelo commitlint: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`, `perf:`, `style:`, `build:`. Ex.: `feat(painel): escolha do provedor de IA`. O texto pode ser em português.
- Textos do site e do painel em português do Brasil.

## Qualidade de código

| Comando           | O que verifica                                                                |
| ----------------- | ----------------------------------------------------------------------------- |
| `npm run lint`    | Lint e formatação com Biome (`npm run lint:fix` corrige o que for automático) |
| `npm run knip`    | Arquivos, exports e dependências sem uso                                      |
| `npm run arch`    | Contrato de arquitetura (`.dependency-cruiser.cjs`)                           |
| `npm run quality` | Os três acima                                                                 |

Contrato de arquitetura: `lib/` não importa de `components/` nem de `app/`; componentes não importam rotas; o site público não importa código do painel; componentes do painel (navegador) não importam módulos de servidor de `lib/`; sem dependências circulares.
