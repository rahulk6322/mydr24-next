"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { setLocale } from "@/app/actions";
import { THEME_STORAGE_KEY } from "@/i18n/config";
import { useI18n } from "./i18n-provider";
import { Icon } from "./icons";

type Theme = "dark" | "light";
const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function ThemeToggle({ withLabel = false, className = "icon-btn" }: { withLabel?: boolean; className?: string }) {
  const { dict } = useI18n();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());
    // Keep every toggle (header + mobile menu) in sync.
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage blocked: theme still applies for this visit */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#0A0F1A" : "#F8FAFC");
  };

  const label = theme === "dark" ? dict.header.themeToLight : dict.header.themeToDark;
  return (
    <button type="button" data-theme-toggle className={className} onClick={toggle} aria-label={label} title={label}>
      <Icon name={theme === "dark" ? "sun" : "moon"} size="sm" />
      {withLabel && <span>{dict.header.theme}</span>}
    </button>
  );
}

export function LangToggle({ long = false, className = "icon-btn" }: { long?: boolean; className?: string }) {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next = locale === "hi" ? "en" : "hi";

  return (
    <button
      type="button"
      data-lang-toggle
      className={`${className}${pending ? " is-pending" : ""}`}
      lang={next}
      aria-label={long ? undefined : dict.locale.switchLabel}
      title={dict.locale.switchLabel}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await setLocale(next);
          router.refresh();
        })
      }
    >
      {long ? dict.locale.long : dict.locale.short}
    </button>
  );
}
