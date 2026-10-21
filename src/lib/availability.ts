import type { Doctor } from "@/data/doctors";
import { DOCTORS } from "@/data/doctors";
import { hash, istMinutes } from "./format";

// SIMULATED availability + live stats. Swap these functions for real data
// (doctor presence service, analytics API) without touching the UI.

export type DoctorState = "online" | "busy" | "offline";
export type DoctorStatus = { state: DoctorState; nextHour?: number; nextIsTomorrow?: boolean };

function onShift(shift: [number, number], hour: number): boolean {
  const [start, end] = shift;
  return start <= end ? hour >= start && hour < end : hour >= start || hour < end;
}

export function getDoctorStatus(doctor: Doctor, now: Date = new Date()): DoctorStatus {
  const hour = Math.floor(istMinutes(now) / 60);
  if (!onShift(doctor.shift, hour)) {
    const start = doctor.shift[0];
    return { state: "offline", nextHour: start, nextIsTomorrow: start <= hour };
  }
  // ~1 in 4 on-shift doctors are "in a consult", re-rolled every 10 minutes.
  const bucket = Math.floor(now.getTime() / 600_000);
  return { state: hash(`${doctor.id}:${bucket}`) % 4 === 0 ? "busy" : "online" };
}

const STATE_ORDER: Record<DoctorState, number> = { online: 0, busy: 1, offline: 2 };

export function doctorsWithStatus(doctors: Doctor[] = DOCTORS, now: Date = new Date()) {
  return doctors
    .map((doctor) => ({ doctor, status: getDoctorStatus(doctor, now) }))
    .sort((a, b) => STATE_ORDER[a.status.state] - STATE_ORDER[b.status.state]);
}

export type LiveStats = {
  doctorsOnline: number;
  avgConnectSeconds: number;
  citiesServed: number;
  updatedAt: string;
  simulated: true;
};

// Relative demand by IST hour (0–23).
const DAY_CURVE = [0.35, 0.3, 0.28, 0.28, 0.3, 0.38, 0.5, 0.65, 0.8, 0.92, 1, 1, 0.97, 0.95, 0.95, 0.97, 1, 1, 0.98, 0.95, 0.9, 0.8, 0.62, 0.45];

export function getLiveStats(now: Date = new Date()): LiveStats {
  const curve = DAY_CURVE[Math.floor(istMinutes(now) / 60)] ?? 0.8;
  const bucket = Math.floor(now.getTime() / 300_000); // changes every 5 minutes
  return {
    doctorsOnline: Math.round(520 * curve + ((hash(`s${bucket}`) % 41) - 20)),
    avgConnectSeconds: Math.round(78 + (1 - curve) * 30 + (hash(`c${bucket}`) % 15)),
    citiesServed: 120,
    updatedAt: now.toISOString(),
    simulated: true,
  };
}
