# Etapa 5.7-B — Reconstrução visual e editorial

## 1. Objetivo

Reinterpretar “Palavra que respira” como uma publicação autoral contemporânea,
com presença tipográfica, fotografia, contraste e ritmo, preservando a base
técnica e a copy aprovada.

## 2. Problemas identificados

A baseline mostrou repetição de seções, estados vazios consecutivos, baixa
diferenciação entre páginas, escala contida, pouca assimetria e fotografias com
função visual secundária. O diagnóstico completo está em
`etapa-5-7-b-diagnostico-visual.md`.

## 3. Estratégia visual

As páginas passaram a alternar aberturas tipográficas, planos claros e verdes,
listas editoriais, composição assimétrica e pausas amplas. A linguagem se
aproxima de livro, ensaio e revista cultural, sem incorporar padrões de
aplicativo ou landing page.

## 4. Nova hierarquia tipográfica

Source Serif 4 permanece responsável por títulos e leitura; Inter continua em
navegação, metadados e ações. A escala fluida ganhou contraste, limites de
largura e line-height mais fechado. O itálico aparece apenas em palavras
pontuais.

## 5. Uso da paleta

Os tokens aprovados foram preservados. Verde escuro e verde de marca estruturam
declarações, eixos e encerramentos. Terracota aparece somente em filetes,
sublinhados, foco e números editoriais.

## 6. Uso das fotografias

- `padre-claudiano-retrato.png`: hero da Início, eager e alta prioridade.
- `padre-celebracao.jpeg`: biografia da Sobre, lazy.
- `celebracao-missa.jpeg`: abertura da página Vídeos, lazy e com legenda factual.

Os originais não foram alterados. Astro Assets continua responsável pelos
derivados AVIF, WebP e fallback.

## 7. Reconstrução da Início

O hero passou a destacar o nome e integrar o retrato a um plano verde. A frase
de posicionamento ganhou seção própria. Reflexões e vídeos foram reunidos em
dois eixos relacionados e assimétricos. Os cinco temas usam lista editorial e o
encerramento adota plano verde profundo com uma ação.

## 8. Reconstrução de Sobre

A abertura é tipográfica e não repete o hero. Biografia e fotografia formam uma
composição 60/40 no desktop e texto antes da imagem no celular. O destaque de
posicionamento cria uma pausa e os temas alternam alinhamento.

## 9. Tratamento de Reflexões vazia

A página apresenta proposta, cinco temas, periodicidade quinzenal e ação para a
trajetória. Não há cards, datas, títulos ou textos fictícios.

## 10. Tratamento de Vídeos vazia

A série Homilia de 1 minuto recebe abertura própria e fotografia contextual. O
estado vazio explica a proposta sem player, thumbnail, controle ou conteúdo
simulado. A infraestrutura futura permanece no projeto.

## 11. Tratamento de Contato

A página combina grande palavra decorativa, abertura tipográfica e bloco verde
assimétrico. O estado sem e-mail é editorial; com `CONTACT_EMAIL`, o `mailto`
continua disponível sem JavaScript ou formulário.

## 12. Tratamento da 404

O número 404, o título, o texto e a única ação formam uma composição verde sem
fotografia, humor ou informação técnica.

## 13. Cabeçalho

O nome ganhou presença, a navegação recebeu espaçamento refinado e o cabeçalho
é sticky com fundo opaco suficiente. Menu progressivo, rota atual, teclado,
Escape e retorno de foco permanecem.

## 14. Rodapé

O plano verde foi ampliado, o nome recebeu escala editorial e navegação,
contato e créditos foram reorganizados. `body` em coluna e `main` flexível
mantêm o rodapé no fim de páginas curtas.

## 15. Componentes criados

Foram criados `EditorialStatement`, `ThemeList` e `HomeEditorialAxes`. Eles
representam padrões reutilizáveis reais e evitam variantes excessivas.

## 16. Acessibilidade

Landmarks, um H1 por rota, ordem de leitura, foco, skip link, teclado, alt
factual e áreas de toque foram preservados. Números decorativos usam
`aria-hidden`. Axe verifica as seis rotas sem silenciar regras.

## 17. Responsividade

Foram auditadas as larguras 320, 390, 768, 1024, 1280, 1440 e 1920 px. Grids
viram uma coluna quando necessário; títulos, imagens, ações e listas mantêm
largura e ordem adequadas, sem overflow.

## 18. Movimento reduzido

Somente transições pequenas permanecem. A regra global para
`prefers-reduced-motion: reduce` remove transições e deslocamentos decorativos
sem ocultar conteúdo.

## 19. Desempenho

Não foram adicionados JavaScript, fontes, imagens externas ou bibliotecas. A
fotografia principal é prioritária; as demais usam lazy loading. O Lighthouse
final registrou Performance 98 na Início mobile, 100 na Início desktop, 99 em
Sobre mobile e 97 em Vídeos mobile. As quatro auditorias obtiveram 100 em
Accessibility, Best Practices e SEO.

## 20. Comparação entre baseline e final

A baseline mostra seções sucessivas de mesma escala e mensagens vazias
repetidas. O resultado final apresenta aberturas distintas, maior contraste,
fotografias estruturantes, listas em vez de cards iguais e alternância entre
densidade e respiro. As capturas ficam em
`tests/visual/artifacts/etapa-5-7-b/`.

## 21. Limitações

Capturas e auditorias automatizadas não substituem testes com leitores de tela,
dispositivos físicos e pessoas com deficiência. O comportamento de conteúdos
reais precisará ser revisto quando forem autorizados.

## 22. Conteúdo real ainda necessário

Continuam pendentes reflexões, vídeos, capas, miniaturas, relações editoriais e
o endereço de contato. Nenhum desses dados foi simulado.

## 23. Itens preservados para a Etapa 5.8

O projeto já continha recursos da Etapa 5.8 por solicitação anterior. Esta
reconstrução não alterou nem ampliou SEO, canonical, Open Graph, JSON-LD,
sitemap, robots, favicon, cabeçalhos, domínio ou workflow.
