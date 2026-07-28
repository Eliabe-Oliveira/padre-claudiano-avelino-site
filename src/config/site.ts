import { resolveContactEmail } from "../lib/contact";

export const siteConfig = {
  name: "Padre Claudiano Avelino",
  publicName: "Padre Claudiano Avelino",
  shortDescription:
    "Espiritualidade, reflexão e encontro com a Palavra de Deus.",
  contactEmail: resolveContactEmail(import.meta.env.CONTACT_EMAIL),
  contactSubject: "Contato pelo site Padre Claudiano Avelino",
} as const;
