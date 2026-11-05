import { NextResponse } from "next/server";
import { packages } from "@/data/content";
import { sendText, teamMessage } from "@/lib/whapi";

type Incoming = { from_me?: boolean; from?: string; chat_id?: string; type?: string; text?: { body?: string } };

export async function POST(request: Request) {
  let body: { messages?: Incoming[] };
  try { body = await request.json(); } catch { return NextResponse.json({ ok: true }); }
  const owner = process.env.WHAPI_TO;

  for (const m of body.messages ?? []) {
    if (m.from_me || m.type !== "text" || !m.chat_id || m.from === owner) continue;
    const text = m.text?.body?.trim() ?? "";
    if (!/^\d{1,2}$/.test(text)) continue; // only react to a package number
    const chosen = packages[Number(text) - 1];
    if (!chosen) continue;
    await sendText(m.chat_id, teamMessage);
    if (owner) await sendText(owner, `*Package selected*\n\n+${m.from}: ${chosen.name} (${chosen.price} ${chosen.unit})`);
  }
  return NextResponse.json({ ok: true });
}
