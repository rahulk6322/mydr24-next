import Link from "next/link";
import type { ReactNode } from "react";

/** Sub-page hero with breadcrumb. */
export function PageHero({ title, lead, crumbs, homeLabel, breadcrumbLabel, children }: {
  title: ReactNode;
  lead?: ReactNode;
  crumbs: { label: string; href?: string }[];
  homeLabel: string;
  breadcrumbLabel: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="container">
        <div className="page-hero__inner" data-reveal>
          <nav className="breadcrumb" aria-label={breadcrumbLabel}>
            <Link href="/">{homeLabel}</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="cluster" style={{ gap: 8 }}>
                <span aria-hidden="true">/</span>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </span>
            ))}
          </nav>
          <h1 className="h1" id="page-title">{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
