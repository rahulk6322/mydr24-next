import Link from "next/link";
import { SERVICES } from "@/data/services";
import { tr } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { site } from "@/lib/site";
import { Brand } from "./brand";
import { Icon } from "./icons";
import { StoreBadges } from "./store";

export async function Footer() {
  const { dict, locale } = await getI18n();
  const t = dict.footer;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Brand id="f" />
            <p className="small muted" style={{ maxWidth: "38ch" }}>{t.blurb}</p>
            <StoreBadges />
          </div>
          <div className="footer__col">
            <h2 className="footer__heading">{t.services}</h2>
            <ul className="footer__links">
              {SERVICES.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`}>{tr(s.title, locale).split(" / ")[0]}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h2 className="footer__heading">{t.company}</h2>
            <ul className="footer__links">
              <li><Link href="/about">{t.about}</Link></li>
              <li><Link href="/doctors">{t.doctors}</Link></li>
              <li><Link href="/#how">{t.how}</Link></li>
              <li><Link href="/#faq">{t.faq}</Link></li>
              <li><Link href="/contact">{t.contact}</Link></li>
              <li><Link href="/design-system">{t.designSystem}</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h2 className="footer__heading">{t.legal}</h2>
            <ul className="footer__links">
              <li><Link href="/legal#privacy">{t.privacy}</Link></li>
              <li><Link href="/legal#terms">{t.terms}</Link></li>
              <li><Link href="/legal#disclaimer">{t.disclaimer}</Link></li>
              <li><Link href="/legal#grievance">{t.grievance}</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h2 className="footer__heading">{t.reach}</h2>
            <ul className="footer__links">
              <li><a href={`tel:${site.helplineTel}`}>{site.helplineDisplay}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><a href={`tel:${site.emergencyTel}`}>{t.emergency}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__disclaimer" role="note">
          <Icon name="alert" />
          <p><strong>{t.disclaimerTitle}</strong> {t.disclaimerText}</p>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {site.company}. {t.rights}</span>
          <span>{t.madeFor} 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}
