# Semana 4 — Arquitetura técnica

## Stack aprovada

- Astro 6.x estável com geração estática;
- TypeScript estrito;
- Node.js 24 e npm, com `package-lock.json`;
- HTML semântico, CSS nativo e JavaScript mínimo;
- Astro Content Collections e Zod;
- reflexões em Markdown e vídeos em YAML;
- Astro Assets para imagens;
- fontes locais;
- YouTube carregado após interação, em modo de privacidade aprimorada;
- contato por `mailto`;
- WCAG 2.2 nível AA como referência;
- Vitest, Playwright e `@axe-core/playwright`.

Cloudflare Pages é a hospedagem planejada para uma etapa futura, sem configuração nesta etapa.

## Content Layer implementada

- A configuração está em `src/content.config.ts` e usa a Content Layer API do Astro 6.
- `reflections` usa `glob` para `src/data/reflections/**/*.md`.
- `videos` usa `glob` para `src/data/videos/**/*.{yaml,yml}`.
- Os schemas usam `astro/zod`, imagens locais usam `image()` e relações usam `reference()`.
- A página técnica executa temporariamente `assertContentIntegrity()` durante o build, garantindo validação global e resolução das referências enquanto a página inicial definitiva ainda não existe.
- Futuras alterações da página inicial devem preservar essa garantia de validação no build.

## Restrições

Não usar framework de interface ou CSS, CMS, banco de dados, autenticação, API própria, SSR, adapter de servidor, analytics, cookies, biblioteca de animação ou gerenciador de estado.

Não executar ações que alterem Git — incluindo inicialização, adição, commit, push, pull, merge, reset, limpeza, checkout ou troca de branch — nem publicar sem autorização expressa.
