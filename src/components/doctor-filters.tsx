"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type FormEvent } from "react";
import { DOCTOR_LANGUAGES, SPECIALITIES, type Speciality } from "@/data/doctors";
import { LANGUAGE_LABELS } from "@/data/languages";
import { tr } from "@/i18n/config";
import { useI18n } from "./i18n-provider";

type Filters = { speciality: string; language: string; online: boolean };

/** URL-driven filters (?speciality=&language=&online=1). Works without JS as a GET form. */
export function DoctorFilters(initial: Filters) {
  const { dict, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [filters, setFilters] = useState<Filters>(initial);
  const t = dict.doctorsPage;

  // Sync when the server re-renders with new searchParams (back/forward, reset link).
  useEffect(() => setFilters(initial), [initial.speciality, initial.language, initial.online]); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = (next: Filters) => {
    setFilters(next);
    const params = new URLSearchParams();
    if (next.speciality) params.set("speciality", next.speciality);
    if (next.language) params.set("language", next.language);
    if (next.online) params.set("online", "1");
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    apply(filters);
  };

  return (
    <form className={`filters card card--glass${pending ? " is-pending" : ""}`} method="get" action={pathname} role="search" aria-label={t.eyebrow} onSubmit={onSubmit}>
      <div className="field">
        <label className="field__label" htmlFor="f-speciality">{t.speciality}</label>
        <select className="select" id="f-speciality" name="speciality" value={filters.speciality}
          onChange={(e) => apply({ ...filters, speciality: e.target.value })}>
          <option value="">{t.all}</option>
          {(Object.keys(SPECIALITIES) as Speciality[]).map((key) => (
            <option key={key} value={key}>{tr(SPECIALITIES[key], locale)}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label className="field__label" htmlFor="f-language">{t.language}</label>
        <select className="select" id="f-language" name="language" value={filters.language}
          onChange={(e) => apply({ ...filters, language: e.target.value })}>
          <option value="">{t.all}</option>
          {DOCTOR_LANGUAGES.map((l) => (
            <option key={l} value={l}>{tr(LANGUAGE_LABELS[l], locale)}</option>
          ))}
        </select>
      </div>
      <label className="checkbox" htmlFor="f-online">
        <input type="checkbox" id="f-online" name="online" value="1" checked={filters.online}
          onChange={(e) => apply({ ...filters, online: e.target.checked })} />
        <span>{t.onlineOnly}</span>
      </label>
      <noscript>
        <button className="btn btn--secondary btn--sm" type="submit">{t.apply}</button>
      </noscript>
    </form>
  );
}
