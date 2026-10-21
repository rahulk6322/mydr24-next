"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-reveal for [data-reveal] elements (150–300ms ease-out, see base.css).
 * Items already on screen are marked visible *before* .reveal-ready is added,
 * so there is no flash and nothing is hidden if JS never runs.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const pending = () => Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));

    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pending().forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      for (const el of pending()) {
        const rect = el.getBoundingClientRect();
        if (!root.classList.contains("reveal-ready") && rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("is-visible");
        } else {
          io.observe(el);
        }
      }
    };

    scan();
    root.classList.add("reveal-ready");
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
