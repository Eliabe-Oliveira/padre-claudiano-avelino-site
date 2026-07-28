# Etapa 5.8 — SEO técnico, URLs públicas e segurança

## 1. Escopo

Esta etapa centraliza deployment e URLs, implementa metadados, dados
estruturados, sitemap, robots, favicon e a configuração futura de cabeçalhos do
Cloudflare Pages. Nenhuma publicação foi realizada.

## 2. URL pública

`config/deployment.mjs` resolve a raiz pública completa. `SITE_URL` tem
precedência, o fallback do GitHub Pages é
`https://eliabe-oliveira.github.io/padre-claudiano-avelino-site/` e o fallback
exclusivamente local é `http://localhost:4321/`.

## 3. Comportamento local

Sem variáveis de deployment, `site` usa `http://localhost:4321`, `base` usa `/`
e os artefatos locais podem conter localhost porque não são publicáveis.

## 4. Comportamento no GitHub Pages

Com `GITHUB_PAGES=true`, links, assets, canonical, Open Graph, JSON-LD, robots e
sitemap incluem `/padre-claudiano-avelino-site/`. A compatibilidade é validada
localmente; o workflow não foi executado.

## 5. SITE_URL

`SITE_URL` deve ser absoluta, usar HTTP ou HTTPS e pode incluir subdiretório.
Credenciais, query e fragmento são rejeitados. A barra final é normalizada.

Exemplo meramente sintático, não usado como configuração real:

```sh
SITE_URL=https://dominio-final.example/ npm run build
```

## 6. Base path

O pathname de `SITE_URL` é convertido em `base` do Astro. O helper
`normalizeBasePath` mantém uma representação consistente e evita duplicação.

## 7. Links internos

`src/lib/urls.ts` centraliza construção, normalização e remoção de base path.
Cabeçalho, menu móvel, rodapé, breadcrumbs, botões e links editoriais delegam ao
helper. Query, fragmentos, `mailto` e URLs externas são preservados.

## 8. Canonical

Todas as cinco páginas indexáveis geram canonical absoluto. A 404 não gera
canonical.

## 9. Open Graph

As páginas geram título, descrição, tipo, URL, nome do site, locale `pt_BR` e
imagem autorizada absoluta.

## 10. Compartilhamento social

Twitter Card usa `summary_large_image` porque todas as páginas atuais possuem
imagem autorizada. Não existem handle, autor de rede social ou `keywords`.

## 11. Imagens sociais

A imagem global e da Início é `padre-claudiano-retrato.png`; Sobre usa
`padre-celebracao.jpeg`. Reflexões futuras priorizam `socialImage`, depois
`cover` e por fim a imagem global. Astro Assets gera arquivo WebP versionado sem
modificar os originais.

## 12. JSON-LD

Início contém WebSite, WebPage e Person; Sobre contém ProfilePage e Person;
Contato contém ContactPage; Reflexões e Vídeos contêm CollectionPage. O layout
de reflexão está preparado para BlogPosting e BreadcrumbList.

Person contém somente nome, descrição aprovada, URL e imagem. Não são gerados
`sameAs`, endereço, telefone, e-mail, empregador ou publisher institucional.

## 13. Sitemap

`@astrojs/sitemap` gera `sitemap-index.xml` e `sitemap-0.xml`. São incluídas as
cinco páginas indexáveis. A 404, endpoints técnicos, drafts e conteúdo futuro
ficam excluídos. Reflexões publicadas e não futuras serão incluídas
automaticamente quando existirem.

## 14. robots.txt

`src/pages/robots.txt.ts` produz texto UTF-8 com acesso público e aponta para o
`sitemap-index.xml` absoluto correspondente ao deployment.

## 15. Favicon

`public/favicon.svg` é uma identificação funcional com fundo `#344E41` e letras
“CA” em `#F7F3EA`. Não representa logomarca formal ou institucional.

## 16. Cabeçalhos Cloudflare

`public/_headers` registra CSP, `nosniff`, `DENY`, política de referência, COOP,
CORP e Permissions-Policy. O arquivo é destinado ao futuro Cloudflare Pages e
não é interpretado pelo GitHub Pages.

## 17. CSP

Scripts executáveis foram emitidos como módulos externos. `script-src` permite
somente `self`, sem `unsafe-inline` ou `unsafe-eval`. Estilos inline permanecem
permitidos porque o Astro os produz. Imagens locais, `data:` e miniaturas
`i.ytimg.com` são aceitas; frames somente de `youtube-nocookie.com`.

## 18. Permissions-Policy

Sensores, câmera, localização, microfone, pagamento e USB ficam bloqueados.
Autoplay, fullscreen e picture-in-picture são permitidos ao próprio site e ao
player `youtube-nocookie.com`.

## 19. Cache

Somente `/_astro/*` recebe
`public, max-age=31536000, immutable`. HTML, favicon, robots, sitemap e
`_headers` não recebem cache imutável.

## 20. Limitações do GitHub Pages

GitHub Pages não aplica o formato `_headers` do Cloudflare. Os cabeçalhos foram
testados por servidor local, mas só estarão efetivos após hospedagem compatível
e publicação autorizada.

## 21. Testes

Vitest cobre deployment, URLs, JSON-LD, CSP, cache e servidor estático.
Playwright cobre metadados, 404, imagens sociais, axe, subdiretório e cabeçalhos.
Um auditor de build percorre os HTMLs e valida destinos internos nos builds
local e GitHub Pages.

## 22. Lighthouse

O runner preserva o throttling corrigido na Etapa 5.7. Os quatro cenários
continuam sujeitos aos gates de Performance, Accessibility, Best Practices e
SEO.

## 23. Validação após publicação

Após autorização de publicação, verificar URL pública, Rich Results Test,
validadores Open Graph, sitemap, robots, headers efetivos e comportamento do
player em navegador real. Nenhuma dessas validações externas foi alegada agora.

## 24. Migração futura para domínio personalizado

Defina `SITE_URL` com a raiz pública final e execute o build. Não é necessário
espalhar o domínio pelos componentes. DNS e domínio não foram configurados.

## 25. Comandos de build

Build local:

```sh
npm run build
```

Build compatível com o endereço de pré-visualização do GitHub Pages:

```sh
GITHUB_PAGES=true npm run build
```
