const navigationRoots = document.querySelectorAll<HTMLDetailsElement>(
  "[data-mobile-navigation]",
);

for (const root of navigationRoots) {
  const toggle = root.querySelector<HTMLElement>("[data-menu-toggle]");
  const panel = root.querySelector<HTMLElement>("[data-menu-panel]");
  const label = root.querySelector<HTMLElement>("[data-menu-label]");

  if (!toggle || !panel || !label) continue;

  const syncState = () => {
    toggle.setAttribute("aria-expanded", String(root.open));
    label.textContent = root.open ? "Fechar menu" : "Menu";
  };

  root.addEventListener("toggle", syncState);
  panel.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) root.open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.open) {
      root.open = false;
      toggle.focus();
    }
  });
  syncState();
}
