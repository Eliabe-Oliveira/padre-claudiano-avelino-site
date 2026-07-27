const publicationDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPublicationDate(date: Date): string {
  return publicationDateFormatter.format(date);
}

export function isFutureDate(date: Date, now: Date = new Date()): boolean {
  return date.getTime() > now.getTime();
}
