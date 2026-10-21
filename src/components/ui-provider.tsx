"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { ServiceSlug } from "@/data/services";
import { site } from "@/lib/site";
import { useI18n } from "./i18n-provider";
import { Icon } from "./icons";
import { LeadForm } from "./lead-form";
import { Modal } from "./modal";
import { rich } from "./rich";
import { UIContext, useUI, type ServiceRequest, type UIContextValue } from "./ui-context";

/** App-wide UI state: SOS dialog, booking bottom sheet, service pre-selection. */
export function UIProvider({ children }: { children: ReactNode }) {
  const [sosOpen, setSosOpen] = useState(false);
  const [booking, setBooking] = useState<{ open: boolean; service?: ServiceSlug }>({ open: false });
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);

  const openSos = useCallback(() => {
    setBooking((b) => ({ ...b, open: false }));
    setSosOpen(true);
  }, []);
  const closeSos = useCallback(() => setSosOpen(false), []);
  const openBooking = useCallback((service?: ServiceSlug) => setBooking({ open: true, service }), []);
  const closeBooking = useCallback(() => setBooking((b) => ({ ...b, open: false })), []);
  const requestService = useCallback((service: ServiceSlug) => setServiceRequest((r) => ({ service, n: (r?.n ?? 0) + 1 })), []);

  const value = useMemo<UIContextValue>(
    () => ({ openSos, openBooking, requestService, serviceRequest }),
    [openSos, openBooking, requestService, serviceRequest],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <SosDialog open={sosOpen} onClose={closeSos} />
      <BookingSheet open={booking.open} service={booking.service} onClose={closeBooking} />
    </UIContext.Provider>
  );
}

function SosDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dict } = useI18n();
  const t = dict.sos;
  return (
    <Modal open={open} onClose={onClose} className="dialog dialog--sos" labelledBy="sos-title">
      <div className="dialog__head">
        <div className="stack" style={{ gap: 8 }}>
          <span className="icon-tile icon-tile--urgent"><Icon name="alert" /></span>
          <h2 className="h3" id="sos-title">{t.title}</h2>
        </div>
        <button className="icon-btn" type="button" onClick={onClose} aria-label={dict.common.close}><Icon name="close" /></button>
      </div>
      <div className="dialog__body">
        <p className="muted">{t.text}</p>
        <a className="sos-option" href={`tel:${site.emergencyTel}`}>
          <span className="icon-tile icon-tile--urgent"><Icon name="phone" /></span>
          <span><span className="sos-option__title">{t.national}</span><br /><span className="caption">{t.nationalSub}</span></span>
          <span className="sos-option__num">{site.emergencyTel}</span>
        </a>
        <a className="sos-option" href={`tel:${site.ambulanceTel}`}>
          <span className="icon-tile icon-tile--urgent"><Icon name="ambulance" /></span>
          <span><span className="sos-option__title">{t.ambulance}</span><br /><span className="caption">{t.ambulanceSub}</span></span>
          <span className="sos-option__num">{site.ambulanceTel}</span>
        </a>
        <a className="btn btn--sos btn--block" href={`tel:${site.helplineTel}`}><Icon name="phone" /> {t.callUs}</a>
        <p className="caption">{t.note}</p>
      </div>
    </Modal>
  );
}

function BookingSheet({ open, service, onClose }: { open: boolean; service?: ServiceSlug; onClose: () => void }) {
  const { dict } = useI18n();
  return (
    <Modal open={open} onClose={onClose} className="sheet" labelledBy="sheet-title">
      <div className="sheet__grabber" aria-hidden="true" />
      <div className="sheet__body">
        <div className="cluster" style={{ justifyContent: "space-between" }}>
          <h2 className="h3" id="sheet-title">{dict.sheet.title}</h2>
          <button className="icon-btn" type="button" onClick={onClose} aria-label={dict.common.close}><Icon name="close" /></button>
        </div>
        <EmergencyNotice />
        <LeadForm key={service ?? "none"} idPrefix="sheet" defaultService={service} source="mobile-sheet" />
      </div>
    </Modal>
  );
}

/** "Medical emergency? Don't fill out a form…" — shown above every lead form. */
export function EmergencyNotice() {
  const { dict } = useI18n();
  const { openSos } = useUI();
  return (
    <div className="notice" role="note">
      <Icon name="alert" />
      <p>
        {rich(dict.notice.text, {
          strong: <strong>{dict.notice.strong}</strong>,
          112: <a href={`tel:${site.emergencyTel}`}>{site.emergencyTel}</a>,
          108: <a href={`tel:${site.ambulanceTel}`}>{site.ambulanceTel}</a>,
          sos: <button type="button" className="link-btn" onClick={openSos}>SOS</button>,
        })}
      </p>
    </div>
  );
}
