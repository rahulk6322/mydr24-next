import Link from "next/link";

/** Logo + wordmark. `id` keeps the SVG gradient id unique per instance. */
export function Brand({ id, onClick }: { id: string; onClick?: () => void }) {
  const gradient = `bm-${id}`;
  return (
    <Link className="brand" href="/" aria-label="MyDR24 by Accufly Healthcare — home" onClick={onClick}>
      <svg className="brand__mark" viewBox="0 0 36 36" aria-hidden="true">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00C2A8" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill={`url(#${gradient})`} />
        <path d="M7 19h5l2.5-6 4 11 2.5-5H29" fill="none" stroke="#0A0F1A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="brand__text">
        <span className="brand__name">
          MyDR<b>24</b>
        </span>
        <span className="brand__by">by Accufly Healthcare</span>
      </span>
    </Link>
  );
}
