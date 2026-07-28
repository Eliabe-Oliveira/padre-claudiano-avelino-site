# Etapa 5.7-D — Fase 4: comparação visual de Reflexões

## Referência e limites editoriais

A implementação foi comparada com
`docs/design-references/etapa-5-7-d/reflexoes-desktop.png`. A coleção real
permanece vazia. Nenhum dos artigos, títulos, datas, resumos ou links fictícios
da referência foi copiado.

A referência foi aplicada à identidade, ao hero, à relação entre pintura e
texto, às superfícies verde e marfim, ao índice temático, à faixa contemplativa
e ao ritmo vertical. A periodicidade aprovada — novos textos a cada duas
semanas — foi preservada.

## Rodada 1 — 1440 px

Captura:
`tests/visual/artifacts/etapa-5-7-d/reflexoes/rodada-1-1440.png`.

Diferenças identificadas:

- o título quebrava em duas linhas por causa da escala e da largura da coluna;
- o estado vazio já preservava aproximadamente a massa da listagem fictícia;
- os cinco temas já formavam um índice horizontal;
- a pintura da faixa contemplativa estava excessivamente escura;
- não havia cards, artigos, datas ou títulos simulados.

Correções:

- redução controlada do H1 e ampliação da coluna textual;
- reforço da pintura na faixa contemplativa;
- preservação das separações douradas e das superfícies envelhecidas;
- manutenção do grande intervalo editorial como parte do estado vazio.

## Rodada 2 — 1440 px

Captura:
`tests/visual/artifacts/etapa-5-7-d/reflexoes/rodada-2-1440.png`.

Resultados:

- o H1 passa a ocupar uma única linha, como na referência;
- o hero equilibra título à esquerda e pintura à direita;
- a composição vazia mantém a hierarquia de título, explicação, periodicidade e
  ação já aprovados;
- os cinco temas ocupam cinco colunas, sem conteúdo editorial inventado;
- a faixa final preserva atmosfera contemplativa somente por meio da pintura.

Foi acrescentada uma preparação visual para conteúdo futuro: quando a coleção
receber publicações reais, destaque e cards assumirão composição horizontal,
bordas finas, fundo marfim e uma coluna no celular.

## Validação em 390 px

Captura:
`tests/visual/artifacts/etapa-5-7-d/reflexoes/final-390.png`.

Em celular, hero, estado vazio, periodicidade, temas e faixa contemplativa
seguem em uma coluna. A pintura é reposicionada abaixo do título, o texto recebe
contraste adicional e os cinco temas tornam-se linhas horizontais. Não há
rolagem lateral.

## Capturas finais

- `tests/visual/artifacts/etapa-5-7-d/reflexoes/final-1440.png`;
- `tests/visual/artifacts/etapa-5-7-d/reflexoes/final-390.png`.
