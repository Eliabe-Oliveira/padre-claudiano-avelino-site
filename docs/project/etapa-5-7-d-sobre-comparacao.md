# Etapa 5.7-D — Fase 3: comparação visual da página Sobre

## Referência e limites editoriais

A comparação foi feita com
`docs/design-references/etapa-5-7-d/sobre-desktop.png`, redimensionada
mentalmente para a largura de teste de 1440 px. Foram reproduzidos o ritmo
verde–marfim–verde–marfim–verde, a escala do título, a relação entre pintura e
texto, a moldura vertical, os filetes dourados, o índice de cinco temas e o
encerramento.

A fotografia e a biografia fictícias da referência não foram usadas. A página
mantém integralmente a biografia aprovada, a fotografia configurada em
`siteMedia.aboutPortrait`, a frase de posicionamento e os cinco temas reais.
Também não foram adicionados brasão, citação ou conteúdo institucional.

## Rodada 1 — 1440 px

Captura:
`tests/visual/artifacts/etapa-5-7-d/sobre/rodada-1-1440.png`.

Diferenças observadas:

- o hero recebeu uma superfície clara por causa da variável de cor usada;
- a pintura superior já ocupava o lado direito, mas ainda não tinha o contraste
  verde da referência;
- a imagem lazy da biografia não havia sido carregada durante a captura;
- a moldura assumiu altura excessiva sem a imagem;
- títulos no marfim herdaram contraste claro;
- a ordem geral das cinco superfícies já correspondia à referência.

Correções:

- aplicação do verde-cipreste profundo no hero;
- altura explícita e proporção vertical da fotografia;
- carregamento da fotografia antes das capturas comparativas;
- contraste verde profundo para títulos sobre marfim;
- acabamento dourado da moldura e do botão final.

## Rodada 2 — 1440 px

Captura:
`tests/visual/artifacts/etapa-5-7-d/sobre/rodada-2-1440.png`.

Diferenças observadas:

- biografia e fotografia passaram a formar uma composição equilibrada em duas
  colunas;
- a faixa intermediária ficou próxima da proporção da referência;
- o índice passou a apresentar cinco linhas regulares e filetes discretos;
- ainda faltava assegurar o verde pictórico no hero e no encerramento após a
  cascata compartilhada;
- no celular, o resumo real do hero precisava de contraste adicional sobre a
  pintura.

Correções:

- seletores específicos de `page-about` para hero e encerramento;
- restauração das superfícies compartilhadas das demais páginas;
- painel verde translúcido somente no resumo móvel;
- preservação do fluxo texto–fotografia no celular.

## Resultado final

Capturas:

- `tests/visual/artifacts/etapa-5-7-d/sobre/final-1440.png`;
- `tests/visual/artifacts/etapa-5-7-d/sobre/final-390.png`.

Em 1440 px, a página reproduz o hero verde com pintura à direita, a biografia
marfim com retrato vertical à esquerda, a faixa escura, o índice de cinco temas
e o encerramento verde. O rodapé real permanece depois da composição.

Em 390 px, título, resumo, pintura, biografia, fotografia, posicionamento, temas
e ação final passam para uma coluna sem perda de conteúdo ou rolagem
horizontal. A pintura é reposicionada e o resumo recebe fundo translúcido para
preservar a leitura.

As pinturas usadas são assets locais já autorizados e as fotografias originais
não foram alteradas.
