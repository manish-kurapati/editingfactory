import { NextResponse } from "next/server";
import { faqs, fallbackMessage, optionFlows, optionMessage, sendText, welcomeMenu } from "@/lib/whapi";

type Incoming = { from_me?: boolean; from?: string; chat_id?: string; type?: string; text?: { body?: string } };

export async function POST(request: Request) {
  let body: { messages?: Incoming[] };
  try { body = await request.json(); } catch { return NextResponse.json({ ok: true }); }
  const owner = process.env.WHAPI_TO;

  for (const m of body.messages ?? []) {
    if (m.from_me || m.type !== "text" || !m.chat_id || m.from === owner) continue;
    if (m.chat_id.endsWith("@g.us")) continue; // ignore group chats
    const text = m.text?.body?.trim() ?? "";
    if (!text) continue;

    try {
      const digit = text.match(/^([1-5])[.)]?$/)?.[1];
      if (digit) {
        await sendText(m.chat_id, optionMessage(digit)!);
        if (owner) await sendText(owner, `*Menu option selected*\n\n+${m.from}: ${digit}. ${optionFlows[digit].title}`);
        continue;
      }

      if (/^(hi|hello|hey|menu|start|help)\b/i.test(text)) {
        await sendText(m.chat_id, welcomeMenu);
        continue;
      }

      const faq = faqs.find(f => f.match.test(text));
      if (faq) {
        await sendText(m.chat_id, faq.reply);
        if (owner) await sendText(owner, `*Customer question*\n\n+${m.from}: ${text.slice(0, 500)}`);
        continue;
      }

      // Longer free-text answers (e.g. replies to the questions) go to the team.
      if (owner) await sendText(owner, `*New WhatsApp message*\n\n+${m.from}: ${text.slice(0, 1500)}`);
      if (text.length < 40) await sendText(m.chat_id, fallbackMessage);
    } catch {}
  }
  return NextResponse.json({ ok: true });
}
