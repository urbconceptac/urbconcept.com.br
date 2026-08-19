import logoAsset from "@/assets/logo-urb.png.asset.json";
import monkAsset from "@/assets/monk-crowd-new.png.asset.json";
import portraitAsset from "@/assets/portrait-crowd.jpg.asset.json";
import press1Asset from "@/assets/press-1.png.asset.json";
import press2Asset from "@/assets/unnamed-2.png.asset.json";
import lobaoLogo from "@/assets/logo-lobao-white.png.asset.json";
import lobao1 from "@/assets/lb4.jpg.asset.json";
import lobao2 from "@/assets/lb9.jpg.asset.json";
import lobao3 from "@/assets/lb14.jpg.asset.json";
import lobao4 from "@/assets/lb15.jpg.asset.json";
import turquesaLogo from "@/assets/logo-turquesa-white.png.asset.json";
import turquesa1 from "@/assets/tq-fachada.jpg.asset.json";
import turquesa2 from "@/assets/tq-interior.jpg.asset.json";
import turquesa3 from "@/assets/tq4.jpg.asset.json";
import turquesa4 from "@/assets/tq7.jpg.asset.json";
import turquesa5 from "@/assets/tq-cartaz-a.jpg.asset.json";
import turquesa6 from "@/assets/tq-cartaz-b.jpg.asset.json";
import polpetteriaLogo from "@/assets/logo-polpetteria.png.asset.json";
import rotuloTapenades from "@/assets/rotulo-tapenades.jpg.asset.json";
import polpetteriaVitrine from "@/assets/polpetteria-vitrine.jpg.asset.json";
import polpetteriaPote from "@/assets/polpetteria-pote.jpg.asset.json";
import cruzeirenseWhite from "@/assets/logo-cruzeirense-white.png.asset.json";
import cruzeirenseColor from "@/assets/logo-cruzeirense-color.png.asset.json";
import tqthEp1 from "@/assets/tqth-ep1.mp3.asset.json";
import spotJulho from "@/assets/spot-cruzeirense-julho.mp3.asset.json";
import spot8do8 from "@/assets/spot-cruzeirense-8do8.mp3.asset.json";

export const media = {
  logo: logoAsset.url,
  monk: monkAsset.url,
  portrait: portraitAsset.url,
  press1: press1Asset.url,
  press2: press2Asset.url,
  lobao: {
    logo: lobaoLogo.url,
    gallery: [lobao1.url, lobao2.url, lobao3.url, lobao4.url],
  },
  turquesa: {
    logo: turquesaLogo.url,
    gallery: [
      turquesa1.url,
      turquesa2.url,
      turquesa3.url,
      turquesa4.url,
      turquesa5.url,
      turquesa6.url,
    ],
  },
  polpetteria: {
    logo: polpetteriaLogo.url,
    gallery: [rotuloTapenades.url, polpetteriaVitrine.url, polpetteriaPote.url],
  },
  cruzeirense: {
    logo: cruzeirenseWhite.url,
    gallery: [cruzeirenseColor.url],
    spots: [
      { label: "Spot — Julho / Semana 05", src: spotJulho.url },
      { label: "Spot — 8 do 8", src: spot8do8.url },
    ],
  },
  tqth: {
    audio: [{ label: "Toca Que Tem História — Episódio 01", src: tqthEp1.url }],
  },
};
