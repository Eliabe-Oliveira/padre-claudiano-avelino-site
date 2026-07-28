# Etapa 5.7-D — Especificação visual mensurável

## Escopo da Fase 1

Este documento converte as cinco artes oficiais em regras compartilhadas. A
Fase 1 implementa apenas fundação visual, cabeçalho, rodapé, botões, superfícies,
divisores e tratamento de pinturas. A reconstrução das páginas fica
explicitamente adiada.

## Inventário das referências

| Arte      |      Dimensões | Proporção |                                  Seções visíveis |
| --------- | -------------: | --------: | -----------------------------------------------: |
| Início    | 1536 × 1024 px |       3:2 |    hero integrado, índice de temas e faixa clara |
| Sobre     |  948 × 1659 px |     0,571 | hero, biografia, citação, pilares e encerramento |
| Reflexões |  948 × 1659 px |     0,571 |         hero, listagem, índice, citação e rodapé |
| Vídeos    |  948 × 1659 px |     0,571 |    hero/destaque, série, listagem e encerramento |
| Contato   |  948 × 1659 px |     0,571 |               hero, canal, encerramento e rodapé |

## Sistema compartilhado

- Área útil desktop: entre 86% e 92% da largura, limitada visualmente a cerca
  de 1360 px na arte horizontal e 850 px nas artes verticais.
- Cabeçalho: 7% a 10% da altura da arte; verde contínuo com o hero; nome à
  esquerda e cinco links à direita.
- Verde: `#061A13`, `#0A241B` e `#123226`, com pigmento não uniforme.
- Marfim: `#EFE4CF` e `#F7EFDF`, com manchas e fissuras de baixa opacidade.
- Dourado fosco: `#9A783B` e `#C4A15C`; reservado a filetes, estado ativo,
  ornamentos e ações.
- Texto escuro: `#29281F`; texto inverso: `#EFE4CF`.
- Bordas: 1 px, sem sombra moderna; raios entre 0 e 2 px.
- Títulos: Source Serif 4, peso visual entre 390 e 520, line-height entre 0,9 e
  1,1.
- Interface: Inter, peso 600–700, tracking entre `0.04em` e `0.08em`.
- Movimento: ausente nas referências estáticas; quando já existente, deve ser
  lento e neutralizado com `prefers-reduced-motion`.

## Cabeçalho

- Altura-alvo desktop: 112 px; mobile: 88 px.
- Marca exclusivamente tipográfica em duas escalas: “Padre” como legenda e
  “Claudiano Avelino” como nome principal.
- Navegação desktop horizontal, com intervalo de 24–48 px.
- Links em serifada de aproximadamente 16 px.
- Item ativo em dourado com filete inferior de 2 px.
- Menu móvel mantém `details/summary`, alvo mínimo de 44 px, Escape e retorno
  de foco.
- Não há brasão, símbolo, cargo ou botão de contato.

## Rodapé

- Fundo verde pictórico e filete dourado superior de 1 px.
- Presença vertical desktop entre 180 e 260 px.
- Grade de três colunas: identidade, navegação e contato existente.
- Nome em serifada entre 32 e 52 px.
- Sem redes sociais, brasão, telefone ou ano de copyright.
- Em mobile, uma coluna e intervalos de 32–48 px.

## Componentes compartilhados

- `ButtonLink`: retângulo de borda fina, raio de 2 px, texto Inter em caixa
  alta e altura mínima de 48 px.
- `OrnamentalDivider`: duas linhas de 1 px e losango central; largura máxima de
  160 px.
- `RenaissanceArtwork`: imagem responsiva do Astro, borda de 1 px, sem raio,
  saturação reduzida e pátina leve.
- `.painted-background` / `.sacred-surface--dark`: superfície verde texturizada.
- `.aged-paper-section` / `.sacred-surface--light`: superfície marfim
  texturizada.

## Início

- A arte horizontal concentra praticamente todo o conteúdo em um hero de 90%
  da altura, seguido por faixa marfim de 10%.
- Pintura ocupa toda a largura: Adão no terço inferior esquerdo e Deus nos 45%
  direitos.
- Título em três linhas ocupa aproximadamente 35% da largura e 30% da altura.
- Temas formam uma faixa inferior em cinco colunas.
- A referência contém brasão, citação e conteúdo fictício que não serão
  reproduzidos.
- Reconstrução da página: pendente de autorização da Fase 2.

## Sobre

- Hero verde: aproximadamente 27% da altura total.
- Título à esquerda; pintura sacra ocupa aproximadamente 48% da largura à
  direita.
- Biografia marfim: aproximadamente 27%, com retrato arqueado à esquerda e
  texto à direita.
- Faixa verde de citação: aproximadamente 9%.
- Índice marfim: aproximadamente 26%, com cinco linhas.
- Encerramento verde: aproximadamente 11%.
- Fotografia fictícia e textos fictícios da arte não serão copiados.
- Reconstrução da página: pendente.

## Reflexões

- Hero verde: aproximadamente 24% da altura, com pintura contemplativa à
  direita e título à esquerda.
- Listagem marfim: aproximadamente 47%; três itens horizontais, cada um com
  imagem e texto.
- Índice temático marfim: aproximadamente 13%, cinco colunas.
- Citação e rodapé verdes: aproximadamente 16%.
- A coleção real está vazia; a composição futura usará o estado vazio existente
  sem criar os três artigos fictícios mostrados.
- Reconstrução da página: pendente.

## Vídeos

- Fundo verde ocupa aproximadamente 63% da arte.
- Hero textual centralizado no terço superior, pintura à direita.
- Destaque marfim sobreposto em duas colunas e série em quatro colunas.
- Listagem marfim ocupa aproximadamente 27%.
- Encerramento verde ocupa aproximadamente 10%.
- Como a coleção real está vazia, players, miniaturas, datas e durações
  fictícias não serão criados.
- Reconstrução da página: pendente.

## Contato

- Hero verde: aproximadamente 32%, título à esquerda e mãos à direita.
- Canal marfim: aproximadamente 39%, conteúdo centralizado e pintura lateral.
- Encerramento verde: aproximadamente 22%, pintura no canto inferior direito.
- Rodapé verde: aproximadamente 7%.
- E-mail, telefone, horários, citação, formulário e redes sociais da arte são
  fictícios e não serão usados.
- Reconstrução da página: pendente.

## Responsividade derivada

- 320 e 390 px: uma coluna; título nunca ultrapassa a viewport; arte é
  reposicionada sem cobrir texto; ações ocupam largura disponível.
- 768 px: menu móvel preservado; colunas complexas convergem para uma ou duas.
- 1024 px: cabeçalho desktop somente quando os cinco links couberem sem
  compressão.
- 1440 e 1920 px: conteúdo centralizado, pinturas podem alcançar as bordas.
- Em todas as larguras: sem overflow horizontal, alvos mínimos de 44 px e um H1
  por página.

## Elementos deliberadamente excluídos

Brasão, logomarca, redes sociais, telefone, horário, e-mail não aprovado,
formulário, datas, publicações e vídeos fictícios, citações atribuídas ao Padre,
biografia nova e qualquer dado institucional não aprovado.
