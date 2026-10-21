import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/** Locale from the cookie (set by the language toggle), memoised per request. */
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
});

export async function getI18n() {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}
