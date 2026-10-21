import Link from "next/link";
import { Icon } from "@/components/icons";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { dict } = await getI18n();
  return (
    <section className="section">
      <div className="container container--narrow">
        <div className="card empty-state">
          <span className="icon-tile icon-tile--lg"><Icon name="map-pin" size="lg" /></span>
          <h1 className="h2">{dict.notFound.title}</h1>
          <p className="muted">{dict.notFound.text}</p>
          <div className="cluster" style={{ justifyContent: "center" }}>
            <Link className="btn btn--primary" href="/">{dict.common.backHome}</Link>
            <Link className="btn btn--secondary" href="/contact">{dict.nav.contact}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
