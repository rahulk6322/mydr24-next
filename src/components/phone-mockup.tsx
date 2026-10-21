import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export type PhoneScreen = "consult" | "sos" | "appointments";

const muted = { color: "#CBD5E1" };

const SCREENS: Record<PhoneScreen, { label: string; tab: number; body: ReactNode }> = {
  consult: {
    label: "MyDR24 app, Quick Consult screen: Talk to a Doctor Now button with a doctor online",
    tab: 0,
    body: (
      <>
        <div>
          <p className="app-sub">Namaste, Ramesh 👋</p>
          <p className="app-title">How are you feeling today?</p>
        </div>
        <div className="app-card app-card--teal">
          <div className="app-row">
            <Icon name="video" />
            <strong>Quick Consult</strong>
            <span className="app-pill" style={{ marginLeft: "auto" }}>● Live</span>
          </div>
          <p className="app-sub" style={muted}>A doctor typically joins in under 2 min</p>
          <span className="app-btn">Talk to a Doctor Now</span>
        </div>
        <div className="app-card">
          <div className="app-row">
            <span className="avatar avatar--sm">AS</span>
            <span>
              <strong>Dr. A. Sharma</strong>
              <br />
              <span className="app-sub">General Physician · हिन्दी, English</span>
            </span>
          </div>
        </div>
        <div className="app-card"><div className="app-row"><Icon name="signal" /><span className="app-sub" style={muted}>Works on 2G/3G · audio fallback</span></div></div>
        <div className="app-card"><div className="app-row"><Icon name="pill" /><span className="app-sub" style={muted}>e-Prescription in your language</span></div></div>
      </>
    ),
  },
  sos: {
    label: "MyDR24 app, SOS screen: large SOS button sharing location with the response team",
    tab: -1,
    body: (
      <>
        <div>
          <p className="app-sub">Emergency</p>
          <p className="app-title">Hold for 3 seconds</p>
        </div>
        <div className="app-sos-ring">SOS</div>
        <div className="app-card">
          <div className="app-row">
            <Icon name="map-pin" />
            <span><strong>Sharing live location</strong><br /><span className="app-sub">Near Sitapur Road, UP</span></span>
          </div>
        </div>
        <div className="app-card"><div className="app-row"><Icon name="users" /><span className="app-sub" style={muted}>Family contacts alerted (2)</span></div></div>
        <span className="app-btn app-btn--sos">Call 112</span>
      </>
    ),
  },
  appointments: {
    label: "MyDR24 app, Appointments screen: upcoming video and home-visit bookings",
    tab: 1,
    body: (
      <>
        <div>
          <p className="app-sub">Appointments</p>
          <p className="app-title">Upcoming</p>
        </div>
        <div className="app-card app-card--teal">
          <div className="app-row"><Icon name="calendar" /><strong>Tomorrow, 10:30 AM</strong></div>
          <div className="app-row">
            <span className="avatar avatar--sm avatar--gold">PK</span>
            <span><strong>Dr. P. Kulkarni</strong><br /><span className="app-sub" style={muted}>Cardiology · Video</span></span>
          </div>
        </div>
        <div className="app-card">
          <div className="app-row"><Icon name="home-care" /><strong>Sat, 4:00 PM</strong></div>
          <span className="app-sub">Home visit · Nurse · BP &amp; sugar check for Amma</span>
        </div>
        <div className="app-card"><div className="app-row"><Icon name="bell" /><span className="app-sub" style={muted}>Reminder by SMS &amp; WhatsApp</span></div></div>
        <span className="app-btn">Book new appointment</span>
      </>
    ),
  },
};

const TABS: IconName[] = ["stethoscope", "calendar", "chat", "doctor"];

export function PhoneMockup({ screen = "consult", size }: { screen?: PhoneScreen; size?: "sm" }) {
  const s = SCREENS[screen];
  return (
    <div className={`phone${size ? ` phone--${size}` : ""}`} role="img" aria-label={s.label}>
      <div className="phone__screen">
        <span className="phone__notch" />
        <div className="phone__status" aria-hidden="true">
          <span>9:41</span>
          <span>4G ▂▄▆</span>
        </div>
        <div className="phone__body">{s.body}</div>
        <div className="app-tabbar" aria-hidden="true">
          {TABS.map((name, i) => (
            <span key={name} className={i === s.tab ? "is-active" : undefined}>
              <Icon name={name} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
