import { NextResponse, type NextRequest } from "next/server";
import { DOCTORS, isSpeciality, SPECIALITIES } from "@/data/doctors";
import { isLanguageName } from "@/data/languages";
import { doctorsWithStatus } from "@/lib/availability";

export const dynamic = "force-dynamic";

/** GET /api/doctors?speciality=cardiology&language=Hindi&online=1 — live availability (simulated). */
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const speciality = q.get("speciality");
  const language = q.get("language");
  const onlineOnly = q.get("online") === "1";

  const doctors = doctorsWithStatus(DOCTORS)
    .filter(({ doctor, status }) =>
      (!isSpeciality(speciality) || doctor.speciality === speciality) &&
      (!isLanguageName(language) || doctor.languages.includes(language)) &&
      (!onlineOnly || status.state === "online"))
    .map(({ doctor, status }) => ({
      id: doctor.id,
      name: doctor.name,
      speciality: doctor.speciality,
      specialityLabel: SPECIALITIES[doctor.speciality].en,
      qualification: doctor.qualification,
      years: doctor.years,
      languages: doctor.languages,
      status: status.state,
      nextAvailableHourIST: status.nextHour ?? null,
    }));

  return NextResponse.json(
    { count: doctors.length, doctors, simulated: true, generatedAt: new Date().toISOString() },
    { headers: { "cache-control": "no-store" } },
  );
}
