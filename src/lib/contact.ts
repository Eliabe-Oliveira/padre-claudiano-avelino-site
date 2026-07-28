export function normalizeContactEmail(
  value: string | undefined,
): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

export function isValidContactEmail(value: string | undefined): boolean {
  const email = normalizeContactEmail(value);
  if (!email || /\s/.test(email)) return false;

  const parts = email.split("@");
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
}

export function resolveContactEmail(
  value: string | undefined,
): string | undefined {
  const email = normalizeContactEmail(value);
  if (!email) return undefined;
  if (!isValidContactEmail(email)) {
    throw new Error(
      "CONTACT_EMAIL está inválida. Informe um único endereço de e-mail válido.",
    );
  }
  return email;
}

export function buildMailto(email: string, subject: string): string {
  if (!isValidContactEmail(email)) {
    throw new Error("Não foi possível construir o mailto: e-mail inválido.");
  }

  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
