import {
  buildYouTubeEmbedUrl,
  transitionPlayerState,
  type PlayerState,
} from "../lib/videos";

const facades = document.querySelectorAll<HTMLElement>("[data-youtube-facade]");

for (const facade of facades) {
  if (facade.dataset.initialized === "true") continue;
  facade.dataset.initialized = "true";

  const button = facade.querySelector<HTMLButtonElement>("[data-play-video]");
  const viewport = facade.querySelector<HTMLElement>("[data-player-viewport]");
  const status = facade.querySelector<HTMLElement>('[role="status"]');
  const errorMessage = facade.querySelector<HTMLElement>("[data-player-error]");
  const unavailableMessage = facade.querySelector<HTMLElement>(
    "[data-player-unavailable]",
  );
  const youtubeId = facade.dataset.youtubeId;
  const title = facade.dataset.videoTitle;

  if (
    !button ||
    !viewport ||
    !status ||
    !errorMessage ||
    !unavailableMessage ||
    !youtubeId ||
    !title
  ) {
    continue;
  }

  let state: PlayerState = "idle";
  const setState = (nextState: PlayerState) => {
    state = nextState;
    facade.dataset.playerState = state;
    errorMessage.hidden = state !== "error";
    unavailableMessage.hidden = state !== "unavailable";
  };

  button.addEventListener("click", () => {
    setState(transitionPlayerState(state, "request"));
    button.disabled = true;
    status.textContent = "Carregando vídeo.";

    try {
      const iframe = document.createElement("iframe");
      iframe.src = buildYouTubeEmbedUrl(youtubeId, {
        autoplay: true,
        playsinline: true,
        rel: false,
      });
      iframe.title = `Vídeo: ${title}`;
      iframe.allow =
        "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.setAttribute("data-player-iframe", "");

      iframe.addEventListener(
        "load",
        () => {
          setState(transitionPlayerState(state, "loaded"));
          status.textContent = "";
          iframe.focus({ preventScroll: true });
        },
        { once: true },
      );
      iframe.addEventListener(
        "error",
        () => {
          setState(transitionPlayerState(state, "failed"));
          status.textContent = "";
          button.disabled = false;
          button.focus({ preventScroll: true });
        },
        { once: true },
      );

      viewport.replaceChildren(iframe);
    } catch {
      setState(transitionPlayerState(state, "failed"));
      status.textContent = "";
      button.disabled = false;
      button.focus({ preventScroll: true });
    }
  });
}
