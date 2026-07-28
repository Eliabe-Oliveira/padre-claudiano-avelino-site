import homeHeroPhoto from "../assets/photos/final/padre-claudiano-retrato.png";
import aboutPortraitPhoto from "../assets/photos/final/padre-celebracao.jpeg";
import celebrationPhoto from "../assets/photos/final/celebracao-missa.jpeg";

interface SiteMediaItem {
  src: typeof homeHeroPhoto;
  alt: string;
  objectPosition: string;
  sourceFilename: string;
}

interface SiteMedia {
  homeHero?: SiteMediaItem;
  aboutPortrait?: SiteMediaItem;
  celebration?: SiteMediaItem;
}

export const siteMedia: SiteMedia = {
  homeHero: {
    src: homeHeroPhoto,
    alt: "Padre Claudiano Avelino em retrato, olhando para a câmera.",
    objectPosition: "50% 24%",
    sourceFilename: "padre-claudiano-retrato.png",
  },
  aboutPortrait: {
    src: aboutPortraitPhoto,
    alt: "Padre Claudiano Avelino durante uma leitura.",
    objectPosition: "50% 38%",
    sourceFilename: "padre-celebracao.jpeg",
  },
  celebration: {
    src: celebrationPhoto,
    alt: "Padre Claudiano Avelino durante uma celebração.",
    objectPosition: "50% 48%",
    sourceFilename: "celebracao-missa.jpeg",
  },
};
