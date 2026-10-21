"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section">
      <div className="container container--narrow">
        <div className="card empty-state" role="alert">
          <h1 className="h2">Something went wrong</h1>
          <p className="muted">
            Please try again. If you need medical help now, call <a className="link" href={`tel:${site.helplineTel}`}>{site.helplineDisplay}</a>, or{" "}
            <a className="link" href="tel:112">112</a> in an emergency.
          </p>
          <button className="btn btn--primary" type="button" onClick={reset}>Try again</button>
        </div>
      </div>
    </section>
  );
}
