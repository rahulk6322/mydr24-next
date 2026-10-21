"use client";

import { createContext, useContext } from "react";
import type { ServiceSlug } from "@/data/services";

export type ServiceRequest = { service: ServiceSlug; n: number };

export type UIContextValue = {
  openSos: () => void;
  /** Open the booking bottom sheet, optionally pre-selecting a service. */
  openBooking: (service?: ServiceSlug) => void;
  /** Pre-select a service in every lead form on the page (used by in-page CTAs). */
  requestService: (service: ServiceSlug) => void;
  serviceRequest: ServiceRequest | null;
};

export const UIContext = createContext<UIContextValue | null>(null);

export function useUI(): UIContextValue {
  const value = useContext(UIContext);
  if (!value) throw new Error("useUI must be used inside <UIProvider>");
  return value;
}
