import { buildReflectionEmailShareUrl } from "../lib/reflections";

const roots = document.querySelectorAll<HTMLElement>("[data-share-links]");

for (const root of roots) {
  const copyButton = root.querySelector<HTMLButtonElement>("[data-copy-link]");
  const emailLink = root.querySelector<HTMLAnchorElement>("[data-email-share]");
  const status = root.querySelector<HTMLElement>('[role="status"]');
  const title = root.dataset.title;

  if (!copyButton || !emailLink || !status || !title) continue;

  emailLink.href = buildReflectionEmailShareUrl(title, window.location.href);

  copyButton.addEventListener("click", async () => {
    status.textContent = "";
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const temporaryField = document.createElement("textarea");
        temporaryField.value = window.location.href;
        temporaryField.setAttribute("readonly", "");
        temporaryField.style.position = "fixed";
        temporaryField.style.opacity = "0";
        document.body.append(temporaryField);
        temporaryField.select();
        const legacyDocument = document as unknown as {
          execCommand(command: string): boolean;
        };
        const copied = legacyDocument.execCommand("copy");
        temporaryField.remove();
        if (!copied) throw new Error("Falha ao copiar.");
      }
      status.textContent = "Link copiado.";
    } catch {
      status.textContent = "Não foi possível copiar o link.";
    }
  });
}
