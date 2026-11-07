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

export const welcomeMenu = `Hi! Welcome to *Editing Factory*. 🎬
*You Shoot. We Edit.*

What can we help you with?

1️⃣ Editing Packages & Prices
2️⃣ Start a Video Editing Project
3️⃣ Book On-Site Event Editors
4️⃣ Other Services – Video Production, Print Design, AI Videos, Influencer Marketing, Social Media Promotions and Media Buying
5️⃣ Become an Editing Partner
6️⃣ Get Help with an Existing Project

Reply with a number or service name. Type *MENU* to come back here or *HELP* to chat with our team`;

/** Questions for each menu option, sent together so the customer can answer in one reply. */
export const optionFlows: Record<string, { title: string; questions: string[]; closing?: string }> = {
  "1": { title: "Editing packages & prices", questions: [] },
  "2": {
    title: "Start a Video Editing Project",
    questions: [
      "What would you like us to edit? Reels, podcasts, corporate films, testimonials, event videos, documentaries, ad films, or something else.",
      "How many videos do you need, and what’s the approximate final length of each?",
      "When do you need them?",
      "Do you have a footage link or editing package in mind? Both are optional.",
    ],
  },
  "3": {
    title: "Book on-site event editors",
    questions: [
      "What’s your event date and city or venue?",
      "What hours do you need the editor for?",
      "What would you like ready during the event? For example, reels, highlights, or a video for the closing session.",
      "Will your team provide the footage, or do you also need videography or photography?",
    ],
  },
  "4": {
    title: "Other services",
    questions: [
      "What do you need? Video production, photography, print design, AI videos, influencer marketing, social media promotions or media buying.",
      "What is it for, and what are you making?",
      "Where and when (if a shoot is involved)?",
      "What final deliverables do you need, and by when?",
    ],
  },
  "5": {
    title: "Become an editing partner",
    questions: [
      "Are you available for remote projects, on-site assignments, or both?",
      "Which city are you based in?",
      "What do you specialise in?",
      "Please share your portfolio or showreel link.",
    ],
  },
  "6": {
    title: "Get help with an existing project",
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
  if (key === "1") {
    const list = packages.map(p => `*${p.name}* — ${p.price} ${p.unit}\n${p.intro}`).join("\n\n");
    return `*Editing Packages & Prices*\n\n${list}\n\nReply *2* to start a project, or *HELP* to chat with our team.`;
  }
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

export const fallbackMessage = "Thanks for your message! Reply with a number (1-6) from the menu, or tell us what you need and our team will follow up here.";

/** Service names accepted instead of a number. */
export const optionAliases: [RegExp, string][] = [
  [/^(editing )?(packages?|prices?|pricing)( (&|and) prices?)?$/i, "1"],
  [/^(start )?(a )?(video )?editing( project)?$/i, "2"],
  [/^on[- ]?site( editors?)?$/i, "3"],
  [/^(other services|video production|print design|ai videos?|influencer marketing|social media promotions?|media buying)$/i, "4"],
  [/^(editing |editor )?partner$|^become an editing partner$/i, "5"],
  [/^(existing )?project help$|^help with (an )?(existing )?project$/i, "6"],
];
