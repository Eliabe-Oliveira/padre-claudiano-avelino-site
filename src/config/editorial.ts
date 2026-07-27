export const EDITORIAL_THEMES = [
  "evangelho-vida-cotidiana",
  "oracao-vida-espiritual",
  "santos-testemunhos-fe",
  "familia-relacoes-virtudes",
  "palavra-pensamento-comunicacao",
] as const;

export type EditorialTheme = (typeof EDITORIAL_THEMES)[number];

export const EDITORIAL_THEME_LABELS: Readonly<Record<EditorialTheme, string>> =
  {
    "evangelho-vida-cotidiana": "Evangelho e vida cotidiana",
    "oracao-vida-espiritual": "Oração e vida espiritual",
    "santos-testemunhos-fe": "Santos e testemunhos de fé",
    "familia-relacoes-virtudes": "Família, relações e virtudes cristãs",
    "palavra-pensamento-comunicacao": "Palavra, pensamento e comunicação",
  };

export const CONTENT_STATUSES = ["draft", "published"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const CLOSING_TYPES = ["prayer", "question", "conclusion"] as const;
export type ClosingType = (typeof CLOSING_TYPES)[number];

export const AUTHOR_NAME = "Padre Claudiano Avelino" as const;
export const VIDEO_SERIES_NAME = "Homilia de 1 minuto" as const;
