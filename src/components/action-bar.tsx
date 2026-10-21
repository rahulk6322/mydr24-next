"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useI18n } from "./i18n-provider";
import { Icon } from "./icons";
import { useUI } from "./ui-context";

/** Sticky thumb-zone bar on mobile (<768px): Call Doctor | SOS | Book. Hides over the footer. */
export function ActionBar() {
  const { dict } = useI18n();
  const { openSos, openBooking } = useUI();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setHidden(Boolean(entry?.isIntersecting)), { rootMargin: "0px 0px -40% 0px" });
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <nav className={`action-bar${hidden ? " is-hidden" : ""}`} aria-label={dict.bar.label} inert={hidden}>
      <a className="action-bar__btn" href={`tel:${site.helplineTel}`}>
        <Icon name="phone" />
        <span>{dict.bar.call}</span>
      </a>
      <button className="action-bar__sos" type="button" onClick={openSos} aria-haspopup="dialog" aria-label={dict.header.sosLabel}>
        <Icon name="alert" />
        SOS
      </button>
      <button className="action-bar__btn" type="button" onClick={() => openBooking()} aria-haspopup="dialog">
        <Icon name="calendar" />
        <span>{dict.bar.book}</span>
      </button>
    </nav>
  );
}
