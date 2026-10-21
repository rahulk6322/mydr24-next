import type { LeadField } from "./validation";

export type LeadState =
  | { status: "idle" }
  | { status: "error"; errors: LeadField[]; message?: "rate" | "server" }
  | { status: "success"; ref: string; mobile: string };

export const initialLeadState: LeadState = { status: "idle" };
