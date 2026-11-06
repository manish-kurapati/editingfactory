/** Appends one lead to the Google Sheet through the Apps Script web app. Returns false if not configured or failed. */
export async function appendToSheet(type: string, fields: [string, string][]) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEET_SECRET;
  if (!url || !secret) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids a CORS preflight; Apps Script reads the raw body
      body: JSON.stringify({ secret, type, fields }),
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
