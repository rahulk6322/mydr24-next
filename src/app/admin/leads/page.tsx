import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getService } from "@/data/services";
import { checkBasicAuth } from "@/lib/admin-auth";
import { listLeads } from "@/lib/leads-store";
import { formatMobile } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads (admin)", robots: { index: false, follow: false } };

const dateFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function AdminLeadsPage() {
  // src/proxy.ts already challenges for credentials; re-check here as defence in depth.
  if (!checkBasicAuth((await headers()).get("authorization"))) notFound();
  const leads = await listLeads();

  return (
    <section className="section" style={{ paddingTop: "var(--space-6)" }}>
      <div className="container">
        <div className="cluster" style={{ justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
          <div className="stack" style={{ gap: 4 }}>
            <span className="eyebrow">Admin</span>
            <h1 className="h2">Leads ({leads.length})</h1>
          </div>
          <div className="cluster">
            <a className="btn btn--secondary btn--sm" href="/api/admin/leads?format=csv">Download CSV</a>
            <a className="btn btn--ghost btn--sm" href="/api/admin/leads">JSON</a>
          </div>
        </div>
        {leads.length === 0 ? (
          <div className="card empty-state"><p className="muted">No leads yet. Submit the form on the home or contact page.</p></div>
        ) : (
          <div className="data-table-wrap" tabIndex={0} role="region" aria-label="Leads">
            <table className="data-table">
              <thead>
                <tr><th>Received (IST)</th><th>Ref</th><th>Name</th><th>Mobile</th><th>City / PIN</th><th>Language</th><th>Service</th><th>Source</th></tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td>{dateFmt.format(new Date(l.createdAt))}</td>
                    <td><code>{l.ref}</code></td>
                    <td>{l.name}</td>
                    <td><a className="link" href={`tel:+91${l.mobile}`}>{formatMobile(l.mobile)}</a></td>
                    <td>{l.city}</td>
                    <td>{l.language}</td>
                    <td>{getService(l.service)?.title.en ?? l.service}</td>
                    <td>{l.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="caption" style={{ marginTop: "var(--space-2)" }}>Personal data. Access is logged by your host; handle under the DPDP Act, 2023.</p>
      </div>
    </section>
  );
}
