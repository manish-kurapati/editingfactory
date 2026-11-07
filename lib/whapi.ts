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

export const welcomeMenu = `Hi! Welcome to *Editing Factory*. 🎬
*You Shoot. We Edit.*

How can we help you today?

1. Get my footage edited
2. Book an on-site editor
3. Request a shoot or full video production
4. Apply as a Video Editor Partner
5. Get help with an existing project

Reply with a number (1-5).`;

/** Questions for each menu option, sent together so the customer can answer in one reply. */
export const optionFlows: Record<string, { title: string; questions: string[]; closing?: string }> = {
  "1": {
    title: "Get my footage edited",
    questions: [
      "What would you like us to edit? Reels, podcasts, corporate films, testimonials, event videos, documentaries, ad films, or something else.",
      "How many videos do you need, and what’s the approximate final length of each?",
      "When do you need them?",
      "Do you have a footage link or editing package in mind? Both are optional.",
    ],
  },
  "2": {
    title: "Book an on-site editor",
    questions: [
      "What’s your event date and city or venue?",
      "What hours do you need the editor for?",
      "What would you like ready during the event? For example, reels, highlights, or a video for the closing session.",
      "Will your team provide the footage, or do you also need videography or photography?",
    ],
  },
  "3": {
    title: "Request a shoot or full production",
    questions: [
      "What do you need? Videography, photography, both, or complete video production.",
      "What are you making?",
      "Where and when is the shoot?",
      "What final videos or photos do you need, and by when?",
    ],
  },
  "4": {
    title: "Apply as a Video Editor Partner",
    questions: [
      "Are you available for remote projects, on-site assignments, or both?",
      "Which city are you based in?",
      "What do you specialise in?",
      "Please share your portfolio or showreel link.",
    ],
  },
  "5": {
    title: "Get help with a project",
    questions: [
      "Please share your project name or booking reference.",
      "What do you need help with? Delivery update, revisions, payment, or files.",
    ],
    closing: "We’re routing this to your client relationship manager, who will follow up here.",
  },
};

export function optionMessage(key: string) {
  const flow = optionFlows[key];
  if (!flow) return null;
  const qs = flow.questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
  return `*${flow.title}*\n\nPlease answer these in one message:\n\n${qs}${flow.closing ? `\n\n${flow.closing}` : ""}`;
}

export const faqs: { match: RegExp; reply: string }[] = [
  {
    match: /\b(cost|price|pricing|rate|rates|charges?|how much)\b/i,
    reply: "Share the type of video, how many you need, and the approximate final length. We’ll suggest a package and confirm the price, included revisions, and delivery date before we start.",
  },
  {
    match: /\b(urgent|urgently|asap|rush|quick(ly)?|fast)\b/i,
    reply: "Tell us when you need the first cut and whether the footage is ready. Our team will check availability and confirm what we can deliver in that time.",
  },
  {
    match: /\b(on[- ]?site|at the venue|during the event|live editing)\b/i,
    reply: "Book an editor for your event slot. They’ll work at the venue while the event is happening. Tell us which reels, highlights, or screen-ready videos you need during the event, and we’ll agree on the deliverables before booking.",
  },
  {
    match: /\b(monthly|every month|per month|retainer|subscription)\b/i,
    reply: "Yes. Tell us what you publish and roughly how many videos you need each month. We’ll suggest an editing plan for your schedule.",
  },
  {
    match: /\b(talk|speak|call|someone|human|person|team|contact)\b/i,
    reply: "Of course. Share what you need help with and our team will follow up here.",
  },
];

export const fallbackMessage = "Thanks for your message! Reply with a number (1-5) from the menu, or tell us what you need and our team will follow up here.";
