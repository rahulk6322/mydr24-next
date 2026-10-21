import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { LeadInput } from "./validation";

// Lead persistence: JSON file (local / self-hosted) + in-memory fallback + optional webhook.
// Replace with a database (Postgres, Supabase, DynamoDB…) for production; callers only use
// saveLead() and listLeads().

export type Lead = LeadInput & {
  id: string;
  ref: string;
  createdAt: string;
  source: string;
  userAgent?: string;
};

const FILE = path.resolve(process.cwd(), process.env.LEADS_FILE || ".data/leads.json");
const memory = globalThis as unknown as { __mydr24Leads?: Lead[] };

// Serialise file writes inside this process.
let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readFileLeads(): Promise<Lead[]> {
  try {
    const parsed: unknown = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Array.isArray(parsed) ? (parsed as Lead[]) : [];
  } catch {
    return [];
  }
}

function newRef(): string {
  return `MD24-${randomBytes(4).readUInt32BE(0).toString(36).toUpperCase().padStart(6, "0").slice(-6)}`;
}

export async function saveLead(input: LeadInput, meta: { source: string; userAgent?: string }): Promise<Lead> {
  const lead: Lead = {
    ...input,
    id: randomUUID(),
    ref: newRef(),
    createdAt: new Date().toISOString(),
    source: meta.source.slice(0, 40) || "web",
    userAgent: meta.userAgent?.slice(0, 200),
  };

  memory.__mydr24Leads = [lead, ...(memory.__mydr24Leads ?? [])].slice(0, 1000);

  await withLock(async () => {
    try {
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      const all = await readFileLeads();
      await fs.writeFile(FILE, JSON.stringify([lead, ...all], null, 2), "utf8");
    } catch (error) {
      console.warn("[leads] File store unavailable; lead kept in memory only.", error);
    }
  });

  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "lead.created", lead }),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) console.error(`[leads] Webhook responded ${res.status}`);
    } catch (error) {
      console.error("[leads] Webhook failed", error);
    }
  }

  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  const byId = new Map<string, Lead>();
  for (const lead of [...(await readFileLeads()), ...(memory.__mydr24Leads ?? [])]) byId.set(lead.id, lead);
  return [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
