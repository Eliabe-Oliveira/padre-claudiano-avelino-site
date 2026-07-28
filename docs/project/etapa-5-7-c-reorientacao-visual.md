# Etapa 5.7-C — Reorientação visual católica renascentista

## Objetivo

Reorientar a identidade visual consolidada na 5.7-B para um catolicismo
editorial renascentista contemporâneo, preservando arquitetura, copy, rotas,
coleções, fotografias e comportamento funcional.

## Estratégia

A intervenção acrescenta uma camada artística contida: três reproduções em
domínio público, textura orgânica leve, ocre envelhecido, filetes e movimento
lento em CSS. A página continua sendo uma publicação autoral, não um museu
digital ou interface devocional genérica.

## Início

O hero preserva nome, posicionamento, descrição e ações. O plano verde tornou-se
mais profundo e recebeu o detalhe das mãos de _A Criação de Adão_. A obra é
dividida em duas metades decorativas que se aproximam por poucos pixels em um
ciclo longo. O retrato do Padre permanece factual, em escala subordinada à
composição simbólica.

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

As mãos usam duas animações CSS de 12 segundos. Os recortes de São Jerônimo e da
Anunciação usam deslocamento vertical de poucos pixels em ciclos de 18 e 20
segundos. Não foi adicionado JavaScript decorativo. Em
`prefers-reduced-motion: reduce`, todas as animações artísticas são removidas e
as composições permanecem estáticas.

## Acessibilidade

Os recortes artísticos são decorativos, têm `alt=""`, ficam em contêineres
`aria-hidden` e não carregam significado exclusivo. Os textos mantêm superfícies
opacas, contraste, ordem semântica e exatamente um H1. Menu, foco, skip link e
funcionamento sem JavaScript continuam preservados.

## Performance

Há somente três arquivos artísticos locais. Astro Assets produz tamanhos
responsivos, AVIF, WebP e fallback. A arte da Início é eager por estar na
primeira dobra; os outros dois recortes são lazy. Nenhuma dependência, fonte,
biblioteca ou requisição externa foi adicionada.

Na auditoria Lighthouse final, a Início obteve 95 em Performance no perfil
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
