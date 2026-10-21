export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "mydr24-locale";
export const THEME_STORAGE_KEY = "mydr24-theme";

/** A string available in every supported locale. */
export type L10n = Record<Locale, string>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Pick the string for a locale, falling back to English. */
export function tr(value: L10n, locale: Locale): string {
  return value[locale] || value.en;
}
