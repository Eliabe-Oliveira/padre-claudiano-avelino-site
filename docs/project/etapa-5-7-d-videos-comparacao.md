# Etapa 5.7-D — Fase 5: comparação visual de Vídeos

## Referência e limites editoriais

A implementação foi comparada com
`docs/design-references/etapa-5-7-d/videos-desktop.png`. A coleção real de
vídeos permanece vazia. Não foram criados players, thumbnails, títulos, datas,
durações ou cards fictícios.

A referência orientou o hero verde, a pintura à direita, o título central, o
painel marfim sobreposto, a área destinada ao destaque, a seção da série
“Homilia de 1 minuto”, a superfície clara inferior, a faixa final e o rodapé.
Somente textos já existentes e aprovados foram redistribuídos.

O `YouTubeFacade` continua integrado aos componentes de vídeo real e não é
renderizado enquanto a coleção estiver vazia.

## Rodada 1 — 1440 px

Captura: `tests/visual/artifacts/etapa-5-7-d/videos/rodada-1-1440.png`.

Diferenças identificadas:

- hero, título central e pintura já acompanhavam a referência;
- o painel marfim possuía proporção e sobreposição próximas da arte;
- a área vazia destinada ao vídeo principal estava clara demais e poderia ser
  interpretada como recurso não carregado;
- a série já preservava massa visual por meio de quatro campos delimitados por
  filetes, sem simular vídeos;
- a seção inferior e a faixa verde mantinham o ritmo vertical esperado.

Correção:

- a área principal tornou-se uma superfície verde pictórica intencional, com
  filete interno e sem qualquer ícone, botão, thumbnail ou comportamento de
  player.

## Rodada 2 — 1440 px

Captura: `tests/visual/artifacts/etapa-5-7-d/videos/rodada-2-1440.png`.

Resultados:

- a composição vazia passa a ser reconhecida como escolha editorial;
- o destaque marfim equilibra área pictórica e copy aprovada;
- a série preserva a largura e a massa dos quatro itens da referência sem
  inventar conteúdo;
- a superfície clara inferior contém apenas a ação existente;
- destaque, grade e `YouTubeFacade` reais permanecem preparados para assumir a
  composição quando houver conteúdo publicado.

## Validação em 390 px

Captura: `tests/visual/artifacts/etapa-5-7-d/videos/final-390.png`.

No celular, o hero mantém título, texto e pintura legíveis; o painel destacado
passa para uma coluna; a série conserva os campos pictóricos como composição
vertical; a ação inferior permanece com alvo amplo. Não há rolagem horizontal
nem player oculto ocupando a árvore de acessibilidade.

## Capturas finais

- `tests/visual/artifacts/etapa-5-7-d/videos/final-1440.png`;
- `tests/visual/artifacts/etapa-5-7-d/videos/final-390.png`.
