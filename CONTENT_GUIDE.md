# Guia de manutenção do conteúdo

## 1. Finalidade do sistema de conteúdo

O conteúdo editorial é mantido em arquivos locais, validado por schemas e incluído no build estático. Não existe CMS ou painel administrativo na V1.

## 2. Localização das reflexões

Cada reflexão futura deve ser um arquivo Markdown em `src/data/reflections/`.

## 3. Localização dos vídeos

Cada vídeo futuro deve ser um arquivo YAML em `src/data/videos/`.

## 4. Diferença entre draft e published

- `draft`: conteúdo em preparação, ausente das consultas públicas;
- `published`: conteúdo aprovado para publicação e sujeito às validações de data.

Alterar o status não substitui a revisão editorial.

## 5. Como criar uma reflexão

Crie um arquivo `.md` em `src/data/reflections/`. O exemplo abaixo é somente um modelo técnico e não representa conteúdo real nem texto de Padre Claudiano.

```md
---
title: "Fixture técnica de reflexão"
slug: "fixture-tecnica-reflexao"
excerpt: "Resumo exclusivamente técnico para demonstrar a estrutura."
publishedAt: 2026-07-24
theme: "evangelho-vida-cotidiana"
status: "draft"
author: "Padre Claudiano Avelino"
featured: false
closingType: "conclusion"
relatedReflections: []
---

Texto técnico de exemplo. Substitua somente por conteúdo aprovado e revisado.
```

Esse modelo não deve ser copiado para a coleção como publicação real.

## 6. Campos obrigatórios de reflexão

- `title`
- `slug`
- `excerpt`
- `publishedAt`
- `theme`
- `status`
- `author`, sempre `Padre Claudiano Avelino`

## 7. Campos opcionais de reflexão

- `updatedAt`
- `scriptureReference`
- `cover`
- `coverAlt`
- `featured`
- `closingType`
- `relatedVideo`
- `relatedReflections`
- `seoTitle`
- `seoDescription`
- `socialImage`

Quando omitidos, `featured` é `false` e `relatedReflections` é uma lista vazia.

## 8. Como definir slug

Use somente letras minúsculas sem acento, números e hífens simples:

```text
modelo-tecnico-de-slug
```

Não use espaços, barras, acentos, hífen inicial/final ou hífens duplicados. O `slug` deve corresponder ao ID canônico da entrada.

## 9. Regra de estabilidade de URL

O slug será a URL pública futura. Depois da publicação, não o altere automaticamente nem apenas para melhorar redação. Mudanças exigem decisão explícita sobre estabilidade da URL.

## 10. Como definir tema

Use exatamente um destes identificadores:

- `evangelho-vida-cotidiana`
- `oracao-vida-espiritual`
- `santos-testemunhos-fe`
- `familia-relacoes-virtudes`
- `palavra-pensamento-comunicacao`

## 11. Como cadastrar capa e texto alternativo

`cover` deve apontar para imagem local processável pelo Astro. Sempre forneça `coverAlt` quando houver capa. Não use `coverAlt` sem `cover`.

```yaml
cover: "../../assets/reflections/arquivo-aprovado.jpg"
coverAlt: "Descrição objetiva da imagem aprovada"
```

`socialImage` também deve ser uma imagem local. Não baixe ou publique fotografia sem verificar licença, autorização e crédito aplicável.

## 12. Como relacionar reflexão e vídeo

Referências usam IDs, nunca URLs completas:

```yaml
relatedVideo: "fixture-tecnica-video"
relatedReflections:
  - "outra-fixture-tecnica"
```

Os nomes acima são apenas exemplos técnicos. Uma reflexão não pode apontar para si mesma e a lista não pode repetir IDs.

## 13. Como criar vídeo YAML

Crie um arquivo `.yaml` ou `.yml` em `src/data/videos/`. O nome do arquivo, sem extensão, deve corresponder ao campo `id`.

```yaml
# Modelo técnico; não representa vídeo real nem conteúdo de Padre Claudiano.
title: "Fixture técnica de vídeo"
id: "fixture-tecnica-video"
series: "Homilia de 1 minuto"
youtubeId: "AbCdEf12_-3" # ID sintático fictício; não representa vídeo real.
description: "Descrição exclusivamente técnica do modelo."
scriptureReference: "Referência técnica não publicável"
status: "draft"
featured: false
unlisted: true
```

Não coloque esse exemplo na coleção real.

## 14. Como obter o youtubeId

Em uma URL de exibição, o `youtubeId` é o valor depois de `v=`. Em uma URL curta, é o segmento após `youtu.be/`. Confirme no canal autorizado antes de cadastrar. O valor precisa ter exatamente 11 caracteres válidos.

## 15. Como registrar vídeo não listado

Use:

```yaml
unlisted: true
```

Isso registra o estado editorial; não modifica a configuração do vídeo no YouTube.

## 16. Como definir destaque

Use `featured: true` em no máximo uma reflexão e um vídeo. Múltiplos destaques interrompem o build.

## 17. Regras sobre publishedAt

- Reflexões sempre exigem `publishedAt`.
- Vídeos em `draft` podem omitir a data.
- Vídeos `published` exigem `publishedAt`.
- Conteúdo publicado com data futura falha na integridade ou é defensivamente excluído das consultas públicas.
- `updatedAt` nunca pode ser anterior a `publishedAt`.
- Prefira datas ISO (`AAAA-MM-DD`).

## 18. Comandos de validação

Execute antes de considerar uma atualização pronta:

```sh
npm run check
npm run test
npm run build
```

O build executa a validação global de integridade.

## 19. Erros comuns

- slug com acento ou espaço;
- nome do YAML diferente de `id`;
- referência para entrada inexistente;
- capa sem texto alternativo;
- texto alternativo sem imagem;
- vídeo publicado sem data;
- data futura em conteúdo publicado;
- mais de um destaque;
- autor ou série escritos de modo diferente dos valores fixos;
- ID do YouTube com tamanho ou caracteres inválidos.

## 20. Direitos autorais de fotografias

Use somente fotografias com autorização e origem verificadas. Uma imagem disponível na internet não está automaticamente liberada para publicação. Registre licença, autorização e crédito antes de adicioná-la.

## 21. Conteúdo não aprovado

É proibido publicar rascunhos, pautas, modelos técnicos ou conteúdo ainda não aprovado.

## 22. Atribuição de autoria

É proibido atribuir a Padre Claudiano Avelino textos gerados automaticamente. O campo fixo de autor identifica conteúdo efetivamente aprovado, não autoriza atribuição automática.

## 23. Processo editorial quinzenal

1. Preparar o conteúdo como `draft`.
2. Confirmar autoria, texto, referências, imagens e direitos.
3. Revisar título, resumo, tema, slug estável e relações.
4. Definir datas e destaque, quando aprovado.
5. Executar `check`, `test` e `build`.
6. Corrigir todas as inconsistências apresentadas.
7. Alterar para `published` somente após aprovação editorial.
8. Repetir as validações antes de qualquer publicação autorizada.

## 24. Headings no corpo da reflexão

O título principal da página é gerado pelo layout. O corpo Markdown pode usar
`##` e `###`, mas nunca deve conter heading de nível 1 (`#`). HTML bruto, MDX,
scripts, iframes e imagens remotas também não são permitidos.

## 25. Relações editoriais

Reflexões relacionadas são exclusivamente as referências cadastradas em
`relatedReflections`, na ordem definida pelo editor. Não são inferidas por tema.
Use no máximo três relações relevantes e não repita IDs nem relacione a reflexão
consigo mesma.

## 26. Miniaturas e incorporação de vídeos

Prefira miniaturas locais autorizadas, cadastradas em `thumbnail` com
`thumbnailAlt`. Sem arquivo local, a fachada usa `i.ytimg.com` e realiza essa
requisição antes da reprodução. O iframe de `youtube-nocookie.com` somente é
criado depois de uma ação explícita do visitante.

Antes de publicar um vídeo, valide manualmente se ele continua disponível e
autorizado para incorporação. Restrições de idade ou de incorporação não devem
ser contornadas.
