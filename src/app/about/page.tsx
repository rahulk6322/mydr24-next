import type { Metadata } from "next";
import Link from "next/link";
import { TrustBadge } from "@/components/cards";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { getI18n } from "@/i18n/server";
import { getLiveStats } from "@/lib/availability";
import { delay } from "@/lib/format";

// Page body copy is English-only for now; navigation and chrome follow the selected language.
export const metadata: Metadata = {
  title: "About",
  description: "Accufly Healthcare builds MyDR24 to bring timely, trusted medical care to rural, semi-urban and underserved India.",
};

const VALUES = [
  { icon: "heart-pulse", tone: "primary", title: "Patients before process", text: "Every decision starts with what is safest and simplest for the patient and their family." },
  { icon: "shield-check", tone: "blue", title: "Earned trust", text: "Verified doctors, honest timelines and no outcome guarantees we can't keep." },
  { icon: "users", tone: "gold", title: "Respect & dignity", text: "Care that respects language, culture, gender and age, especially for elders." },
] as const;

const TEAM = [
  { initials: "FN", name: "Founder Name", role: "Founder & CEO" },
  { initials: "CM", name: "Dr. Clinical Lead", role: "Chief Medical Officer", warm: true },
  { initials: "TL", name: "Tech Lead", role: "CTO" },
  { initials: "OP", name: "Ops Lead", role: "Head of Field Operations", warm: true },
];

export default async function AboutPage() {
  const { dict } = await getI18n();
  const stats = getLiveStats();

  return (
    <>
      <PageHero
        title={<>Healthcare shouldn&apos;t depend on your <span className="text-gradient">PIN code</span></>}
        lead="Accufly Healthcare builds MyDR24 so families in small towns and villages get the same timely, trusted medical guidance that metro cities take for granted."
        crumbs={[{ label: dict.nav.about }]}
        homeLabel={dict.nav.home}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <section className="section" style={{ paddingTop: "var(--space-6)" }} aria-label="Impact at a glance">
        <div className="container">
          <div className="stat-grid">
            <div className="card" data-reveal><p className="stat__value">65%</p><p className="small muted">of Indians live in rural areas<sup>†</sup></p></div>
            <div className="card" data-reveal style={delay(60)}><p className="stat__value text-gradient">{stats.citiesServed}+</p><p className="small muted">cities &amp; towns served*</p></div>
            <div className="card" data-reveal style={delay(120)}><p className="stat__value">12+</p><p className="small muted">languages supported*</p></div>
            <div className="card" data-reveal style={delay(180)}><p className="stat__value">24×7</p><p className="small muted">doctor availability*</p></div>
          </div>
          <p className="caption" style={{ marginTop: "var(--space-1-5)" }}>†Approximate, Census of India. *Illustrative figures; replace with verified data before launch.</p>
        </div>
      </section>

      <section className="section section--elevated" aria-labelledby="mission-title">
        <div className="container">
          <div className="grid" style={{ alignItems: "center", rowGap: "var(--space-5)" }}>
            <div className="lg-6 stack" style={{ gap: "var(--space-3)" }} data-reveal>
              <span className="eyebrow">Our mission</span>
              <h2 className="h2" id="mission-title">Hybrid care that works for Bharat</h2>
              <p className="lead">We combine AI-assisted triage, teleconsultation, partner clinics and trained field staff. The result is care that works on a ₹7,000 phone, on a 2G network, in your own language.</p>
              <p className="muted">AI helps us route requests, translate and flag risk early. Every diagnosis and prescription is made by a registered medical practitioner.</p>
            </div>
            <div className="lg-6" data-reveal>
              <div className="card card--glass stack" style={{ gap: "var(--space-2)" }}>
                {[
                  { icon: "sparkle", tile: "icon-tile", title: "AI-assisted, doctor-led", text: "AI supports intake and routing. Clinical decisions stay with doctors." },
                  { icon: "signal", tile: "icon-tile icon-tile--blue", title: "Low-bandwidth first", text: "Audio fallback, IVR and callbacks for feature phones." },
                  { icon: "map-pin", tile: "icon-tile icon-tile--gold", title: "Local partners", text: "Clinics, labs, pharmacies and ambulance networks near you." },
                ].map((item) => (
                  <div key={item.title} className="trust-badge" style={{ display: "flex" }}>
                    <span className={item.tile}><Icon name={item.icon as "sparkle" | "signal" | "map-pin"} /></span>
                    <div><p className="trust-badge__title">{item.title}</p><p className="trust-badge__text">{item.text}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="values-title">
        <div className="container">
          <div className="section__head section__head--center" data-reveal>
            <span className="eyebrow">What we stand for</span>
            <h2 className="h2" id="values-title">Our values</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div key={v.title} data-reveal style={delay(i * 80)}>
                <TrustBadge icon={v.icon} tone={v.tone} title={v.title} text={v.text} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--elevated" aria-labelledby="team-title">
        <div className="container">
          <div className="section__head" data-reveal>
            <span className="eyebrow">Leadership</span>
            <h2 className="h2" id="team-title">The team behind MyDR24</h2>
            <p className="muted">Placeholder profiles. Replace with Accufly Healthcare leadership.</p>
          </div>
          <div className="team-grid">
            {TEAM.map((m) => (
              <div key={m.name} className="card doctor-card" data-reveal>
                <div className="doctor-card__head">
                  <span className={`avatar${m.warm ? " avatar--gold" : ""}`}>{m.initials}</span>
                  <div><h3 className="doctor-card__name">{m.name}</h3><p className="small muted">{m.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card cta-band" data-reveal>
            <h2 className="h2">Partner with us</h2>
            <p className="lead" style={{ maxWidth: "56ch" }}>Are you a hospital, clinic, NGO, CSR team or state health programme? Let&apos;s take care further, together.</p>
            <div className="cluster" style={{ justifyContent: "center" }}>
              <Link className="btn btn--primary btn--lg" href="/contact#lead">Get in touch</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
