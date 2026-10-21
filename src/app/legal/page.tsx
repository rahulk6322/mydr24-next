import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getI18n } from "@/i18n/server";
import { site } from "@/lib/site";

// STUB content for layout only. Final text must be drafted and approved by Accufly Healthcare's legal counsel.
export const metadata: Metadata = {
  title: "Privacy & Terms",
  description: "MyDR24 privacy policy, terms of use and medical disclaimer.",
  robots: { index: false, follow: true },
};

const TOC = [
  ["privacy", "Privacy policy"],
  ["data", "Data we collect"],
  ["rights", "Your rights (DPDP Act)"],
  ["terms", "Terms of use"],
  ["disclaimer", "Medical disclaimer"],
  ["grievance", "Grievance officer"],
] as const;

export default async function LegalPage() {
  const { dict } = await getI18n();
  return (
    <>
      <PageHero
        title="Privacy & Terms"
        lead="Stub content for layout only. Final text must be drafted and approved by Accufly Healthcare's legal counsel."
        crumbs={[{ label: dict.footer.legal }]}
        homeLabel={dict.nav.home}
        breadcrumbLabel={dict.common.breadcrumb}
      >
        <span className="badge badge--gold" style={{ justifySelf: "start" }}>Draft · Last updated: placeholder</span>
      </PageHero>
      <section className="section" style={{ paddingTop: "var(--space-6)" }}>
        <div className="container">
          <div className="legal">
            <nav className="legal__toc card" aria-label="On this page">
              {TOC.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
            </nav>
            <article className="prose">
              <h2 className="h3" id="privacy">Privacy policy</h2>
              <p>This policy explains how {site.company} (“we”) collects, uses and protects personal data when you use {site.name}. [Legal to complete: Data Fiduciary details, scope and effective date.]</p>
              <h2 className="h3" id="data">Data we collect</h2>
              <ul>
                <li>Contact details you provide, such as name, mobile number, city or PIN code and preferred language.</li>
                <li>Health information shared during consultations, with your explicit consent.</li>
                <li>Technical data needed to deliver the service, such as device type and approximate location for SOS.</li>
              </ul>
              <h2 className="h3" id="rights">Your rights under the DPDP Act, 2023</h2>
              <p>You may access, correct or erase your personal data, withdraw consent and nominate a person to exercise these rights on your behalf. [Legal to complete: process and timelines.]</p>
              <h2 className="h3" id="terms">Terms of use</h2>
              <p>By using {site.name} you agree to these terms. Teleconsultations are provided by independent registered medical practitioners in line with the Telemedicine Practice Guidelines. [Legal to complete.]</p>
              <h2 className="h3" id="disclaimer">Medical disclaimer</h2>
              <p>{site.name} is not an emergency service. In an emergency, call 112 or 108. Information on this website is general and is not a substitute for professional medical advice. Outcomes vary and no specific result is guaranteed.</p>
              <h2 className="h3" id="grievance">Grievance officer</h2>
              <p>Name: [placeholder] · Email: <a className="link" href={`mailto:${site.grievanceEmail}`}>{site.grievanceEmail}</a> · Address: [placeholder]</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
