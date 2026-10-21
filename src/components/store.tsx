import { hash } from "@/lib/format";
import { site } from "@/lib/site";
import { Icon } from "./icons";

// TODO(Accufly): replace with the official Apple / Google badge artwork per their brand guidelines.
export function StoreBadges() {
  return (
    <div className="store-badges">
      <a className="store-badge" href={site.playStoreUrl} aria-label="Get MyDR24 on Google Play">
        <Icon name="play" />
        <span className="store-badge__text">
          <span className="store-badge__small">GET IT ON</span>
          <span className="store-badge__big">Google Play</span>
        </span>
      </a>
      <a className="store-badge" href={site.appStoreUrl} aria-label="Download MyDR24 on the App Store">
        <Icon name="apple" />
        <span className="store-badge__text">
          <span className="store-badge__small">Download on the</span>
          <span className="store-badge__big">App Store</span>
        </span>
      </a>
    </div>
  );
}

/** Decorative QR placeholder (deterministic pattern). Replace with a real QR export of the download link. */
export function QrCode({ seed = "https://mydr24.in/app" }: { seed?: string }) {
  const n = 25;
  let h = hash(seed);
  const rnd = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
    return (h >>> 0) / 4294967296;
  };
  const inFinder = (x: number, y: number) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  let cells = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inFinder(x, y) && rnd() > 0.52) cells += `M${x} ${y}h1v1h-1z`;
  const finder = (x: number, y: number) => `M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z M${x + 2} ${y + 2}h3v3h-3z`;

  return (
    <svg viewBox={`0 0 ${n} ${n}`} fill="#0A0F1A" shapeRendering="crispEdges" role="img" aria-label="QR code placeholder to download the MyDR24 app">
      <path fillRule="evenodd" d={`${finder(0, 0)} ${finder(n - 7, 0)} ${finder(0, n - 7)}`} />
      <path d={cells} />
    </svg>
  );
}
