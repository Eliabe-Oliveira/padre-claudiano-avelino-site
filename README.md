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
| `npm run test:build`   | Audita URLs e arquivos do build estático.         |

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

A Etapa extraordinária 5.7-C reorientou a apresentação consolidada na 5.7-B
para um catolicismo editorial renascentista contemporâneo. A estrutura, a copy
e as fotografias autorizadas foram preservadas; três obras em domínio público,
textura pictórica leve e movimento CSS sutil acrescentam uma camada católica e
contemplativa. As coleções de reflexões e vídeos permanecem vazias e recebem
tratamento editorial intencional, sem conteúdo fictício.

A Etapa 5.8 está tecnicamente concluída: as páginas existentes possuem URLs
públicas centralizadas, canonical, Open Graph, JSON-LD, sitemap, robots e
favicon. A configuração futura de cabeçalhos do Cloudflare Pages também está
preparada. Nenhuma publicação foi realizada.

O contato é configurado no build pela variável opcional `CONTACT_EMAIL`. Sem ela, a página informa que o endereço será disponibilizado em breve; um valor preenchido e inválido interrompe o build.

As instruções de manutenção editorial estão em [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md). Use `npm run check`, `npm run test` e `npm run build` para validar alterações de conteúdo.

A documentação técnica da etapa está em
[`docs/project/etapa-5-8-seo-seguranca.md`](./docs/project/etapa-5-8-seo-seguranca.md).

Use `npm run build` para o build local,
`GITHUB_PAGES=true npm run build` para validar o subdiretório do GitHub Pages ou
`SITE_URL=https://dominio-final.example/ npm run build` como sintaxe
ilustrativa para uma futura raiz pública.

O endereço definitivo de contato e os conteúdos reais continuam pendentes.
Nenhuma etapa posterior deve ser iniciada automaticamente. Commit, push, deploy
e publicação exigem autorização expressa.
