# Auditoria da Etapa 5.7

## 1. Escopo

Integração de até duas fotografias autorizadas e auditoria de acessibilidade, navegação progressiva, responsividade, desempenho, segurança básica e consistência visual das seis rotas públicas existentes. A auditoria automatizada complementa, mas não substitui, validação manual por pessoas com deficiência e em dispositivos reais.

## 2. Fotografias escolhidas

- Início: `padre-claudiano-retrato.png`.
- Sobre: `padre-celebracao.jpeg`.
- Reserva: `celebracao-missa.jpeg`.

## 3. Páginas e posições

A fotografia da Início está exclusivamente em `inicio-abertura`, à direita do texto no desktop e após as ações no celular. A fotografia de Sobre está exclusivamente em `sobre-biografia`, ao lado do texto no desktop e após os três parágrafos no celular.

## 4. Textos alternativos

- “Padre Claudiano Avelino em retrato, olhando para a câmera.”
- “Padre Claudiano Avelino durante uma leitura.”

São descrições factuais, concisas e não inferem evento, local, data ou emoção.

## 5. Tratamento responsivo

`Picture` do Astro gera AVIF, WebP e fallback original com `srcset`, `sizes`, largura e altura. Qualidade 80. A abertura usa larguras 360, 480 e 720 px, carregamento eager e prioridade alta; a biografia usa larguras 360, 480, 720 e 960 px e carregamento lazy. Os contêineres preservam proporção, `object-fit: cover` e posições centralizadas configuradas em `media.ts`.

## 6. Estratégia sem JavaScript

O menu móvel usa `details` e `summary`, mantendo os cinco links disponíveis nativamente sem JavaScript. O script pequeno apenas aprimora rótulo, estado expandido, fechamento ao seguir link e Escape com retorno de foco.

## 7. Navegação por teclado

Foram verificados skip link, cabeçalho, menu móvel, ações editoriais, links, rodapé, Escape, retorno de foco e ausência de armadilhas ou `tabindex` positivo. Os estilos globais mantêm foco visível.

## 8. Resultados do axe

As seis rotas, Início e Sobre com menu aberto, viewport de 320 px e preferência por movimento reduzido foram verificadas com tags WCAG A/AA 2.0, 2.1 e 2.2 suportadas. A navegação sem JavaScript também foi exercitada. Resultado final: zero violações automatizadas. O axe não demonstra conformidade WCAG integral.

## 9. Resultados do Lighthouse

Os resultados de Início móvel e desktop, Sobre móvel e Vídeos móvel estão em `tests/performance/artifacts/etapa-5-7/`. O resumo registra Performance, Accessibility, Best Practices, SEO, FCP, LCP, CLS, TBT e Speed Index. SEO foi apenas registrado, sem gate ou configuração final.

A primeira configuração informava `formFactor: "desktop"` e viewport desktop, mas
mantinha o throttling móvel padrão do Lighthouse. Três execuções consecutivas
confirmaram o efeito estável: Performance 89, TBT 0 ms, FCP/LCP/Speed Index entre
1.507,10 e 1.507,85 ms e CLS entre 0,00135 e 0,00401. O relatório não atribuiu
economia à imagem LCP: o AVIF de 15.376 bytes estava descoberto no documento,
eager e com prioridade alta.

A auditoria desktop passou a usar o perfil `desktopDense4G` do Lighthouse 13.4.1
(RTT 40 ms, 10.240 Kbps e CPU 1×), além do user agent desktop. A execução oficial
final terminou com código 0; os valores exatos permanecem em `resumo.md`. O
encerramento também passou a finalizar sincronamente o Chrome e o grupo de
processos do preview, sem deixar o servidor local ativo.

## 10. Reflow

As seis rotas foram verificadas em 320, 390, 768, 1024, 1440 e 1920 px, sem rolagem horizontal. Títulos, ações, grids, cabeçalho, imagens e rodapé permanecem acessíveis. Também foi simulada ampliação de texto equivalente a 200%.

## 11. Contraste

Foram preservados os tokens aprovados e verificadas as combinações efetivamente renderizadas, inclusive links, botões, foco, cabeçalho, menu e rodapé. Não há texto sobre fotografias nem informação transmitida apenas por cor. Nenhuma nova combinação foi necessária.

## 12. Movimento reduzido

Com `prefers-reduced-motion: reduce`, transições decorativas são removidas sem eliminar feedback necessário. Menu, skip link, conteúdo e fotografias estáticas permanecem funcionais.

## 13. Recursos externos

As seis rotas não fizeram requisições externas: fontes e fotografias são locais; o estado vazio não solicita YouTube, miniaturas, CDN, analytics ou trackers.

## 14. Problemas encontrados

O menu anterior dependia de JavaScript. Na primeira execução pós-alteração, a semântica exposta pelo `summary` não manteve o papel de botão esperado pela suíte existente. O acionador recebeu papel explícito coerente com seu comportamento nativo. Um teste de origem de imagem também foi ajustado para aceitar a rota local de transformação usada pelo servidor de desenvolvimento do Astro.

A auditoria desktop usava viewport desktop com throttling móvel, reduzindo
artificialmente FCP, LCP e Speed Index. O script também aplicava `await` a
`chrome.kill()`, cujo retorno é `void`, e encerrava apenas o processo npm do
preview, não sua árvore completa.

## 15. Correções

Integração via Astro Assets, layouts responsivos, navegação progressiva, semântica do acionador, testes de fotografias, JavaScript desativado, teclado, reflow, axe, movimento reduzido, recursos externos e Lighthouse.

Na correção final de desempenho, somente o script e os artefatos de auditoria
foram ajustados: perfil desktop correto, user agent coerente, remoção do `await`
sem efeito e encerramento do grupo de processos do preview. O site, a copy, o
layout, as fontes e as fotografias não foram alterados.

## 16. Limitações

Tempos do Lighthouse variam conforme a máquina. Contraste, teclado e recortes foram auditados tecnicamente, mas recomenda-se validação adicional em dispositivos reais, leitores de tela e com usuários.

## 17. Reservado para a Etapa 5.8

SEO final, favicon, sitemap, robots, Open Graph, JSON-LD, domínio, cabeçalhos da hospedagem, publicação e configuração de produção.

## 18. Reservado para conteúdo real

Validar cards, capas e player quando reflexões e vídeos reais forem autorizados; validar endereço de contato quando fornecido.
