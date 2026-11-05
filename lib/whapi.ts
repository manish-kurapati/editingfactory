import { packages } from "@/data/content";

export async function sendText(to: string, body: string) {
  const token = process.env.WHAPI_TOKEN;
  if (!token) return false;
  const res = await fetch(`${process.env.WHAPI_API_URL ?? "https://gate.whapi.cloud"}/messages/text`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ to, body }),
  });
  return res.ok;
}

/** Digits only with country code. 10-digit numbers are treated as Indian. */
export function normalizePhone(raw: string) {
  let digits = raw.replace(/\D/g, "").replace(/^00/, "");
  if (digits.length === 10) digits = `91${digits}`;
  return digits.length >= 11 && digits.length <= 15 ? digits : null;
}

export const thankYouMessage = "Thank you for contacting Editing Factory.";
export const teamMessage = "Thank you! Our team will contact you shortly.";
export const packageMenu = () =>
  `Please choose a package by replying with its number:\n\n${packages.map((p, i) => `${i + 1}. ${p.name} — ${p.price} ${p.unit}`).join("\n")}`;
