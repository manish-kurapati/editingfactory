import { NextResponse } from "next/server";
import { packages } from "@/data/content";
import { normalizePhone, packageMenu, sendText, teamMessage, thankYouMessage } from "@/lib/whapi";

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: Request) {
  const token = process.env.WHAPI_TOKEN;
  const to = process.env.WHAPI_TO;
  if (!token || !to) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 500 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });

  let payload: { heading?: unknown; fields?: unknown; website?: unknown; kind?: unknown };
  try { payload = await request.json(); } catch { return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 }); }

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (payload.website) return NextResponse.json({ ok: true });

  const heading = typeof payload.heading === "string" ? payload.heading.slice(0, 120) : "Editing Factory enquiry";
  if (!Array.isArray(payload.fields)) return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 });
  const lines = payload.fields.slice(0, 40).flatMap((entry: unknown) => {
    if (!Array.isArray(entry) || entry.length !== 2) return [];
    const [key, value] = entry;
    return typeof key === "string" && typeof value === "string" && value.trim() ? [`*${key.slice(0, 60)}:* ${value.slice(0, 2000)}`] : [];
  });
  if (lines.length === 0) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });

  const NL = String.fromCharCode(10);
  const sent = await sendText(to, `*${heading}*${NL}${NL}${lines.join(NL)}`);
  if (!sent) return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });

  // Automated replies to the visitor (best effort: the enquiry itself already reached us).
  const get = (name: string) => (payload.fields as unknown[][]).find(f => f[0] === name)?.[1];
  const visitor = typeof get("WhatsApp number") === "string" ? normalizePhone(get("WhatsApp number") as string) : null;
  if (visitor) {
    try {
      await sendText(visitor, thankYouMessage);
      const chosen = get("Package");
      const hasPackage = typeof chosen === "string" && packages.some(p => p.name === chosen);
      if (payload.kind === "editor" || hasPackage) await sendText(visitor, teamMessage);
      else await sendText(visitor, packageMenu());
    } catch {}
  }
  return NextResponse.json({ ok: true });
}
