# Site Padre Claudiano Avelino

Fundação técnica do site pessoal e autoral de Padre Claudiano Avelino, voltado à espiritualidade católica, a reflexões escritas e a vídeos. O projeto não é institucional e não representa oficialmente a Ordem dos Paulinos, a PAULUS ou qualquer outra organização.

## Requisitos

- Node.js 24
- npm 11 ou versão compatível

Use `nvm use` na raiz para selecionar a versão registrada em `.nvmrc`.

## Instalação

```sh
npm install
```

## Comandos

| Comando                | Finalidade                                        |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Inicia o ambiente local de desenvolvimento.       |
| `npm run build`        | Gera o site estático em `dist/`.                  |
| `npm run preview`      | Pré-visualiza o build local.                      |
| `npm run check`        | Executa as verificações do Astro e do TypeScript. |
| `npm run lint`         | Analisa o código com ESLint.                      |
| `npm run format`       | Formata os arquivos com Prettier.                 |
| `npm run format:check` | Confere a formatação sem alterar arquivos.        |
| `npm run test`         | Executa os testes unitários com Vitest.           |
| `npm run test:e2e`     | Executa os testes de navegação com Playwright.    |

## Estrutura

- `src/pages/`: rotas do site;
- `src/layouts/`: layouts Astro;
- `src/components/`: componentes futuros, organizados por função;
- `src/assets/`: fotografias, imagens de reflexões e miniaturas;
- `src/data/`: conteúdo estruturado futuro;
- `src/data/reflections/`: coleção Markdown de reflexões;
- `src/data/videos/`: coleção YAML de vídeos;
- `tests/unit/`: testes unitários;
- `tests/e2e/`: testes de navegação;
- `tests/visual/`: reservado para uma etapa futura;
- `docs/project/`: decisões editoriais, visuais e técnicas aprovadas.

## Estado

O projeto está na Etapa 5.3: modelo de conteúdo, Content Collections e validações. As coleções reais permanecem vazias e as páginas editoriais ainda não foram implementadas. A página existente continua sendo somente uma validação interna.

As instruções de manutenção editorial estão em [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md). Use `npm run check`, `npm run test` e `npm run build` para validar alterações de conteúdo.

Nenhuma etapa posterior, incluindo a Etapa 5.4, deve ser iniciada automaticamente. Commit, push, deploy e publicação exigem autorização expressa.
