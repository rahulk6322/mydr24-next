import type { CSSProperties } from "react";

/** Replace {key} placeholders in a string. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Typed helper for CSS custom properties in `style`. */
export function vars(values: Record<`--${string}`, string | number>): CSSProperties {
  return values as CSSProperties;
}

/** Stagger delay for [data-reveal] elements. */
export function delay(ms: number): CSSProperties {
  return vars({ "--reveal-delay": `${ms}ms` });
}

/** 98 seconds → "1:38" */
export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Stable 32-bit FNV-1a hash (used for deterministic simulated data). */
export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Minutes since midnight in India Standard Time (UTC+5:30). */
export function istMinutes(now: Date): number {
  return (now.getUTCHours() * 60 + now.getUTCMinutes() + 330) % 1440;
}

/** 9 → "9 AM" (en) / "सुबह 9 बजे" (hi) */
export function formatHour(hour24: number, locale: "en" | "hi"): string {
  const h = ((hour24 % 24) + 24) % 24;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (locale === "hi") {
    const period = h >= 5 && h < 12 ? "सुबह" : h >= 12 && h < 16 ? "दोपहर" : h >= 16 && h < 20 ? "शाम" : "रात";
    return `${period} ${h12} बजे`;
  }
  return `${h12} ${h < 12 ? "AM" : "PM"}`;
}
