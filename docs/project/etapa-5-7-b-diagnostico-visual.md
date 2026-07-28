# Etapa 5.7-B — Diagnóstico visual

## Contexto

O site parte de uma base técnica estável: rotas, conteúdo aprovado, navegação
progressiva, responsividade, acessibilidade, fontes locais, fotografias
responsivas, coleções e validações automatizadas já funcionam. A reconstrução
visual deve preservar essas garantias.

Existe uma divergência temporal entre a especificação desta etapa e o estado do
projeto: a Etapa 5.8 já está implementada e foi publicada por solicitação
anterior. A Etapa 5.7-B não removerá nem ampliará esses recursos e não alterará
os arquivos de SEO, sitemap, robots, favicon, dados estruturados, cabeçalhos,
domínio ou workflow.

## Diagnóstico objetivo

- A Início usa uma sequência de seis seções com largura, alinhamento e
  espaçamento semelhantes. Isso reduz a distinção entre apresentação, conteúdo
  e encerramento.
- Os estados vazios de reflexão em destaque, vídeo e reflexões recentes aparecem
  consecutivamente. A repetição comunica ausência mais do que intenção
  editorial.
- A alternância entre fundo principal, fundo secundário e superfície é discreta;
  falta contraste de escala e densidade entre as seções.
- As fotografias autorizadas estão tecnicamente bem integradas, mas ocupam
  funções próximas às de ilustrações laterais. Elas ainda não organizam o ritmo
  da composição.
- A escala dos títulos é confortável, porém insuficiente para estabelecer a
  presença autoral esperada em aberturas e declarações editoriais.
- As composições são predominantemente centralizadas em contêineres simétricos.
  Há pouca alternância de alinhamento, proporção ou deslocamento vertical.
- Listas temáticas, estados vazios e blocos institucionais usam caixas e
  superfícies de linguagem visual semelhante.
- Em páginas de coleção vazia, a pouca altura do conteúdo aproxima visualmente o
  rodapé da mensagem de ausência.
- Texto, imagem e espaço seguem intervalos quase uniformes; faltam mudanças
  deliberadas entre trechos densos, pausas e planos fotográficos.
- Início, Sobre, Reflexões e Vídeos compartilham aberturas e blocos com tratamento
  muito próximo, limitando a identidade específica de cada rota.
- A combinação de seções iguais, mensagens de “em breve” e caixas repetidas faz
  o conjunto parecer uma estrutura ainda provisória, apesar da estabilidade
  técnica.

## Elementos que devem ser preservados

- HTML semântico, um `h1` por página, landmarks e skip link.
- Menu móvel baseado em `details`/`summary`, funcional sem JavaScript.
- Escape, retorno de foco, indicação de rota atual e navegação por teclado.
- Copy, biografia, temas e limites editoriais aprovados.
- Content Collections vazias, schemas e validação de integridade.
- Componentes futuros de reflexão e vídeo.
- Astro Assets com AVIF, WebP, dimensões, `srcset`, `sizes` e carregamento
  coerente.
- Paleta, Source Serif 4, Inter, foco visível e movimento reduzido.
- Ausência de recursos externos, JavaScript decorativo e conteúdo fictício.
- Rotas existentes, desempenho e testes funcionais.
