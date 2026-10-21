"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { submitLead } from "@/app/actions";
import { LANGUAGE_LABELS, LEAD_LANGUAGES } from "@/data/languages";
import { SERVICES, type ServiceSlug } from "@/data/services";
import { tr } from "@/i18n/config";
import { initialLeadState } from "@/lib/lead-types";
import { vars } from "@/lib/format";
import { leadFromFormData, validateField, validateLead, type LeadField } from "@/lib/validation";
import { useI18n } from "./i18n-provider";
import { Icon } from "./icons";
import { rich } from "./rich";
import { useUI } from "./ui-context";

type LeadFormProps = {
  /** Prefix for element ids, so several forms can live on one page. */
  idPrefix: string;
  defaultService?: ServiceSlug;
  /** Stored with the lead for attribution (e.g. "home", "contact", "mobile-sheet"). */
  source?: string;
};

/** Lead form: validate → loading → success. Remounts on "Submit another". */
export function LeadForm(props: LeadFormProps) {
  const [key, setKey] = useState(0);
  return <LeadFormInner key={key} {...props} onReset={() => setKey((k) => k + 1)} />;
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className={`field${error ? " is-invalid" : ""}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        <span className="req" aria-hidden="true">*</span>
      </label>
      {children}
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && (
        <p className="field__error" id={`${id}-err`}>
          <Icon name="alert" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function LeadFormInner({ idPrefix, defaultService, source = "web", onReset }: LeadFormProps & { onReset: () => void }) {
  const { dict, locale } = useI18n();
  const { serviceRequest } = useUI();
  const t = dict.form;
  const [state, formAction, pending] = useActionState(submitLead, initialLeadState);
  const [errors, setErrors] = useState<LeadField[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const id = (field: string) => `${idPrefix}-${field}`;

  const focusField = (field: LeadField) => formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();

  // Server response → show its errors or the success panel.
  useEffect(() => {
    if (state.status === "error") {
      setErrors(state.errors);
      if (state.errors[0]) focusField(state.errors[0]);
    }
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  // In-page CTAs ("Plan care for a parent", …) pre-select the service.
  useEffect(() => {
    if (!serviceRequest || !serviceRef.current) return;
    serviceRef.current.value = serviceRequest.service;
    setErrors((e) => e.filter((f) => f !== "service"));
  }, [serviceRequest]);

  const revalidate = (field: LeadField, value: unknown, onlyIfShown: boolean) => {
    if (onlyIfShown && !errors.includes(field)) return;
    const ok = validateField(field, value);
    setErrors((e) => (ok ? e.filter((f) => f !== field) : e.includes(field) ? e : [...e, field]));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Handle submission manually (instead of the default form-action path) so React
    // doesn't auto-reset the fields if the server rejects the request.
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const result = validateLead(leadFromFormData(fd));
    if (!result.ok) {
      setErrors(result.errors);
      if (result.errors[0]) focusField(result.errors[0]);
      return;
    }
    setErrors([]);
    startTransition(() => formAction(fd));
  };

  if (state.status === "success") {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status">
        <span className="form-success__icon"><Icon name="check" /></span>
        <h3 className="h3">{t.successTitle}</h3>
        {state.mobile && <p className="muted">{rich(t.successText, { mobile: <strong>{state.mobile}</strong> })}</p>}
        <span className="form-success__ref">{t.ref}: {state.ref}</span>
        <p className="caption">{rich(t.worse, { 112: <a className="link" href="tel:112">112</a> })}</p>
        <button className="btn btn--secondary" type="button" onClick={onReset}>{t.again}</button>
      </div>
    );
  }

  const err = (f: LeadField) => (errors.includes(f) ? t.errors[f] : undefined);
  const describe = (f: LeadField, hint = false) => [hint ? `${id(f)}-hint` : "", errors.includes(f) ? `${id(f)}-err` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} className="form" action={formAction} onSubmit={onSubmit} noValidate aria-describedby={id("note")}>
      <input type="hidden" name="source" value={source} />
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor={id("company")}>{t.honeypot}</label>
        <input id={id("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id={id("name")} label={t.name} error={err("name")}>
        <input className="input" id={id("name")} name="name" type="text" autoComplete="name" placeholder={t.namePh} required minLength={2} maxLength={80}
          aria-invalid={errors.includes("name") || undefined} aria-describedby={describe("name")}
          onBlur={(e) => e.target.value && revalidate("name", e.target.value, false)} onChange={(e) => revalidate("name", e.target.value, true)} />
      </Field>

      <Field id={id("mobile")} label={t.mobile} error={err("mobile")} hint={t.mobileHint}>
        <div className="input-group">
          <span className="input-group__prefix" aria-hidden="true">🇮🇳 +91</span>
          <input className="input" id={id("mobile")} name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder={t.mobilePh} required maxLength={11}
            aria-invalid={errors.includes("mobile") || undefined} aria-describedby={describe("mobile", true)}
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, "").slice(0, 10);
              e.target.value = d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
              revalidate("mobile", e.target.value, true);
            }}
            onBlur={(e) => e.target.value && revalidate("mobile", e.target.value, false)} />
        </div>
      </Field>

      <div className="form__row">
        <Field id={id("city")} label={t.city} error={err("city")}>
          <input className="input" id={id("city")} name="city" type="text" autoComplete="address-level2" placeholder={t.cityPh} required maxLength={60}
            aria-invalid={errors.includes("city") || undefined} aria-describedby={describe("city")}
            onBlur={(e) => e.target.value && revalidate("city", e.target.value, false)} onChange={(e) => revalidate("city", e.target.value, true)} />
        </Field>
        <Field id={id("language")} label={t.language} error={err("language")}>
          <select className="select" id={id("language")} name="language" required defaultValue={locale === "hi" ? "Hindi" : ""}
            aria-invalid={errors.includes("language") || undefined} aria-describedby={describe("language")}
            onChange={(e) => revalidate("language", e.target.value, true)}>
            <option value="">{t.languagePh}</option>
            {LEAD_LANGUAGES.map((l) => (
              <option key={l} value={l}>{tr(LANGUAGE_LABELS[l], locale)}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field id={id("service")} label={t.service} error={err("service")}>
        <select ref={serviceRef} className="select" id={id("service")} name="service" required defaultValue={defaultService ?? ""}
          aria-invalid={errors.includes("service") || undefined} aria-describedby={describe("service")}
          onChange={(e) => revalidate("service", e.target.value, true)}>
          <option value="">{t.servicePh}</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.slug}>
              {tr(s.title, locale)}{s.comingSoon ? ` ${t.waitlist}` : ""}
            </option>
          ))}
        </select>
      </Field>

      <div className={`field${errors.includes("consent") ? " is-invalid" : ""}`}>
        <label className="checkbox" htmlFor={id("consent")}>
          <input type="checkbox" id={id("consent")} name="consent" required
            aria-invalid={errors.includes("consent") || undefined} aria-describedby={describe("consent")}
            onChange={(e) => revalidate("consent", e.target.checked, true)} />
          <span>{rich(t.consent, { privacy: <Link className="link" href="/legal#privacy">{t.privacy}</Link> })}</span>
        </label>
        {errors.includes("consent") && (
          <p className="field__error" id={`${id("consent")}-err`}>
            <Icon name="alert" />
            <span>{t.errors.consent}</span>
          </p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p className="form-alert" role="alert">
          <Icon name="alert" />
          <span>{state.message === "rate" ? t.rate : t.server}</span>
        </p>
      )}

      <button className={`btn btn--primary btn--lg btn--block${pending ? " is-loading" : ""}`} type="submit" aria-busy={pending || undefined}>
        {t.submit} <Icon name="arrow-right" />
      </button>
      <p className="caption cluster" style={vars({ "--cluster-gap": "6px" })} id={id("note")}>
        <Icon name="lock" size="sm" /> {t.secure}
      </p>
    </form>
  );
}
