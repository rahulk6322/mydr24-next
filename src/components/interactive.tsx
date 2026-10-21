"use client";

import { useRouter } from "next/navigation";
import { Children, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { ServiceSlug } from "@/data/services";
import type { LiveStats } from "@/lib/availability";
import { fmt, formatDuration } from "@/lib/format";
import { useI18n } from "./i18n-provider";
import { Icon } from "./icons";
import { useUI } from "./ui-context";

/* ---------- CTA buttons wired to the UI context ---------- */

/** In-page link (default #lead) that also pre-selects a service in the lead form. */
export function ServiceCta({ service, href = "#lead", className, children }: { service: ServiceSlug; href?: string; className?: string; children: ReactNode }) {
  const { requestService } = useUI();
  return (
    <a href={href} className={className} onClick={() => requestService(service)}>
      {children}
    </a>
  );
}

export function SosButton({ className = "btn btn--sos", children }: { className?: string; children: ReactNode }) {
  const { openSos } = useUI();
  return (
    <button type="button" className={className} onClick={openSos} aria-haspopup="dialog">
      {children}
    </button>
  );
}

export function BookButton({ service, className = "btn btn--primary", children }: { service?: ServiceSlug; className?: string; children: ReactNode }) {
  const { openBooking } = useUI();
  return (
    <button type="button" className={className} onClick={() => openBooking(service)} aria-haspopup="dialog">
      {children}
    </button>
  );
}

/* ---------- Accordion (FAQ) ---------- */
export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number }) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen >= 0 ? [defaultOpen] : []));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-b${i}`;
        const panelId = `${baseId}-p${i}`;
        return (
          <div key={item.q} className={`accordion__item${isOpen ? " is-open" : ""}`}>
            <h3 className="accordion__heading">
              <button id={btnId} className="accordion__trigger" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(i)}>
                {item.q}
                <span className="accordion__chev"><Icon name="chevron-down" /></span>
              </button>
            </h3>
            <div id={panelId} className="accordion__panel" role="region" aria-labelledby={btnId} inert={!isOpen}>
              <div className="accordion__inner"><p>{item.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Carousel (swipeable scroll-snap, dots, arrows) ---------- */
export function Carousel({ label, className = "", heading, children }: { label: string; className?: string; heading?: ReactNode; children: ReactNode }) {
  const { dict } = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [scrollable, setScrollable] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const box = track.getBoundingClientRect();
    const center = box.left + box.width / 2;
    let best = 0;
    let bestDistance = Infinity;
    Array.from(track.children).forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    setActive(best);
    setScrollable(track.scrollWidth > track.clientWidth + 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [update]);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const el = track?.children[i];
    if (!track || !el) return;
    const t = track.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    track.scrollBy({ left: r.left - t.left - (t.width - r.width) / 2, behavior: "smooth" });
  };
  const step = (dir: 1 | -1) => goTo(Math.min(slides.length - 1, Math.max(0, active + dir)));

  return (
    <div className={`carousel ${className}`} aria-roledescription="carousel" aria-label={label}>
      {(heading || scrollable) && (
        <div className="cluster" style={{ justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
          <div>{heading}</div>
          {scrollable && (
            <div className="cluster hide-sm" style={{ gap: 8 }}>
              <button className="icon-btn" type="button" onClick={() => step(-1)} disabled={active === 0} aria-label={dict.common.prev}>
                <Icon name="chevron-left" size="sm" />
              </button>
              <button className="icon-btn" type="button" onClick={() => step(1)} disabled={active === slides.length - 1} aria-label={dict.common.next}>
                <Icon name="chevron-right" size="sm" />
              </button>
            </div>
          )}
        </div>
      )}
      <div className="carousel__track" ref={trackRef} tabIndex={0}>
        {slides}
      </div>
      {scrollable && (
        <div className="carousel__dots">
          {slides.map((_, i) => (
            <button key={i} className="carousel__dot" type="button" aria-current={i === active} onClick={() => goTo(i)}
              aria-label={fmt(dict.common.slideOf, { label, n: i + 1, total: slides.length })} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Live trust strip (polls /api/stats) ---------- */
export function LiveTrustStrip({ initial }: { initial: LiveStats }) {
  const { dict } = useI18n();
  const [stats, setStats] = useState(initial);

  useEffect(() => {
    const load = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (res.ok) setStats((await res.json()) as LiveStats);
      } catch {
        /* keep last known values */
      }
    };
    const id = setInterval(load, 30_000);
    document.addEventListener("visibilitychange", load);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  const t = dict.trust;
  return (
    <>
      <div className="trust-strip card--glass" style={{ border: "1px solid var(--color-border)" }} data-reveal>
        <div className="trust-strip__item">
          <span className="icon-tile"><Icon name="doctor" /></span>
          <div>
            <p className="trust-strip__value" aria-live="polite">{stats.doctorsOnline.toLocaleString("en-IN")}</p>
            <p className="trust-strip__label">{t.doctorsOnline} <span className="badge badge--primary badge--live" style={{ minHeight: 22, padding: "2px 8px" }}>{t.live}</span></p>
          </div>
        </div>
        <div className="trust-strip__item">
          <span className="icon-tile"><Icon name="clock" /></span>
          <div>
            <p className="trust-strip__value">{formatDuration(stats.avgConnectSeconds)} min</p>
            <p className="trust-strip__label">{t.avgConnect}</p>
          </div>
        </div>
        <div className="trust-strip__item">
          <span className="icon-tile icon-tile--blue"><Icon name="map-pin" /></span>
          <div>
            <p className="trust-strip__value">{stats.citiesServed}+</p>
            <p className="trust-strip__label">{t.cities}</p>
          </div>
        </div>
      </div>
      <p className="caption trust-strip__note">{t.note}</p>
    </>
  );
}

/* ---------- Re-render a server page periodically (live availability) ---------- */
export function AutoRefresh({ intervalMs = 60_000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);
  return null;
}
