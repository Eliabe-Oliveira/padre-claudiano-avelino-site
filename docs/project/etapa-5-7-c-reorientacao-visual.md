# Etapa 5.7-C — Reorientação visual católica renascentista

## Objetivo

Reorientar a identidade visual consolidada na 5.7-B para um catolicismo
editorial renascentista contemporâneo, preservando arquitetura, copy, rotas,
coleções, fotografias e comportamento funcional.

## Estratégia

A intervenção acrescenta uma camada artística contida: reproduções em
domínio público, recortes pictóricos orgânicos, textura de pigmento, ocre
envelhecido, filetes e movimento lento em CSS. A página continua sendo uma
publicação autoral, não um museu digital ou interface devocional genérica.

## Colagem sacra

Na Início, a composição completa de _A Criação de Adão_ ocupa o plano de fundo
como afresco, e não como adesivo digital. São Jerônimo e a Anunciação receberam
limites deliberadamente irregulares, preservando pátina, luz, sombra e a matéria
das reproduções. A irregularidade é contida para que a composição não pareça
scrapbook ou ornamentação infantil.

O verde-cipreste usa uma superfície local de 1600 × 1200 px construída com
pinceladas amplas, veladuras, áreas foscas, pigmento e marcas de pincel seco. O
SVG-fonte permanece como registro editável, enquanto a produção carrega sua
versão WebP de 16 KB para evitar rasterização de filtros no navegador.

## Início

O hero foi reduzido ao nome, à frase “Palavra, reflexão e encontro com Deus.” e
a uma única ação para conhecer as reflexões. A reprodução completa de
_A Criação de Adão_ foi tonalizada em verde-cipreste e ocupa toda a primeira
dobra: Adão surge à esquerda, o encontro das mãos estrutura o centro e Deus
domina o lado direito. Uma camada translúcida garante contraste, enquanto um
deslocamento de poucos pixels cria respiração sem deformar a obra. Fotografia,
explicação longa, chamada de vídeos e demais informações ficam fora da primeira
dobra, preservando silêncio, espaço vazio e predominância da arte.

Declaração editorial, eixos, temas e encerramento mantêm conteúdo e ordem. A
textura pictórica e os acentos ocres relacionam essas seções à nova atmosfera.

## Sobre

Biografia, fotografia e temas permanecem intactos. _São Jerônimo em seu estudo_
acompanha a frase de posicionamento como referência a Palavra, estudo e
contemplação, sem converter a trajetória em currículo institucional.

## Reflexões

O estado vazio continua sem artigos simulados. _A Anunciação_ forma uma faixa
de escuta contemplativa na abertura, enquanto proposta, temas, periodicidade e
ação permanecem iguais.

## Vídeos

A fotografia de celebração continua sendo o elemento figurativo principal. O
plano verde, a textura e o ocre aproximam a página da mesma tradição visual sem
criar player, thumbnail ou vídeo fictício.

## Contato e 404

Contato conserva os dois estados de e-mail e não cria formulário. Um círculo
linear abstrato e a textura aprofundam o plano verde. A 404 recebe o mesmo
vocabulário com sobriedade, sem fotografia, humor ou informação técnica.

## Movimento

O afresco da Início usa uma animação CSS de 18 segundos. Os recortes de São
Jerônimo e da Anunciação usam deslocamento vertical de poucos pixels em ciclos
de 18 e 20 segundos. Não foi adicionado JavaScript decorativo. Em
`prefers-reduced-motion: reduce`, todas as animações artísticas são removidas e
as composições permanecem estáticas.

## Acessibilidade

Os recortes artísticos são decorativos, têm `alt=""`, ficam em contêineres
`aria-hidden` e não carregam significado exclusivo. O afresco da Início é
aplicado por CSS e igualmente decorativo. Os textos mantêm contraste, ordem
semântica e exatamente um H1. Menu, foco, skip link e funcionamento sem
JavaScript continuam preservados.

## Performance

Os arquivos artísticos permanecem locais. O afresco da Início usa derivações
WebP de aproximadamente 244 KB para desktop e 35 KB para mobile, já
dimensionadas para o hero; os outros recortes são processados pelo Astro Assets
e carregados de forma lazy. Nenhuma dependência, fonte, biblioteca ou requisição
externa foi adicionada.

Na auditoria Lighthouse final, a Início obteve 97 em Performance no perfil
mobile e 100 no desktop; Sobre obteve 99 e Vídeos 97 no mobile. Todas as quatro
execuções obtiveram 100 em Acessibilidade, Boas Práticas e SEO, com TBT de
0 ms e CLS máximo de 0,019. O resumo está em
`tests/performance/artifacts/etapa-5-7-c/resumo.md`.

## Evidências

Baseline e resultado final estão em
`tests/visual/artifacts/etapa-5-7-c/`. As fontes e justificativas de domínio
público estão em `etapa-5-7-c-fontes-visuais.md`.

## Limitações

A leitura estética final depende de validação do responsável e do cliente.
Capturas e auditorias automatizadas não substituem dispositivos físicos,
leitores de tela e avaliação com pessoas com deficiência.

## Estado preservado

Não foram alterados workflow, fotografias originais, conteúdo, biografia,
temas, coleções, schemas, rotas, SEO, sitemap, robots, JSON-LD, favicon,
domínio ou configuração de publicação. Recursos da Etapa 5.8 já existentes
antes desta tarefa permaneceram sem ampliação.
