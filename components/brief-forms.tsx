"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDownRight, MessageCircle } from "lucide-react";
import { packages, services } from "@/data/content";
import { whatsappNumber } from "@/data/contact";

const field = (data: FormData, name: string) => data.getAll(name).map(String).filter(Boolean).join(", ");
function useEnquiry(heading: string, extra?: Record<string, string>, kind: "client" | "editor" = "client") {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    Object.entries(extra ?? {}).forEach(([k, v]) => data.set(k, v));
    const fields = Array.from(new Set(Array.from(data.keys()))).filter(key => key !== "consent" && key !== "website").map(key => [key, field(data, key)]);
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ heading, kind, fields, website: data.get("website") }) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }
  const fallback = () => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(heading)}`;
  const notice = status === "error" ? <p className="v2-form-note" role="alert">We could not send this right now. Please try again, or <a href={fallback()} target="_blank" rel="noopener noreferrer">message us on WhatsApp</a>.</p> : null;
  return { status, submit, notice, sending: status === "sending", reset: () => setStatus("idle") };
}
const Honeypot = () => <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}/>;
function Select({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) {
  return <label>{label}<select name={name} required={required} defaultValue=""><option value="" disabled>Select one</option>{options.map(option => <option key={option}>{option}</option>)}</select></label>;
}
function Choices({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <fieldset className="v2-choices"><legend>{label}</legend>{options.map(option => <label key={option}><input type="checkbox" name={name} value={option}/><span>{option}</span></label>)}</fieldset>;
}

function Thanks({ onReset, compact = false }: { onReset: () => void; compact?: boolean }) {
  return <div className={`v2-form v2-brief-form v2-thanks${compact ? " v2-compact-form" : ""}`} role="status" style={{ textAlign: "center", padding: "40px 24px" }}>
    <MessageCircle size={40} style={{ color: "#176d4f" }}/>
    <h3 style={{ margin: "16px 0 8px", fontSize: 24 }}>Thank you!</h3>
    <p>Your message has been sent to Editing Factory on WhatsApp. We will get back to you shortly.</p>
    <button className="v2-button" type="button" onClick={onReset} style={{ marginTop: 16 }}>Send another</button>
  </div>;
}

export function ClientForm() {
  const [chosen, setChosen] = useState<string[]>([]);
  const shooting = chosen.some(value => ["Drone Videography and Photography", "Complete Video Production"].includes(value));
  const editing = chosen.some(value => /Editing|Video Production|AI Video/.test(value));
  const { submit, notice, sending, status, reset } = useEnquiry("Editing Factory — new project enquiry");
  if (status === "sent") return <Thanks onReset={() => { reset(); setChosen([]); }}/>;
  return <form className="v2-form v2-brief-form" onSubmit={submit}><Honeypot/>
    <div className="v2-form-title"><span>BOOK AN INQUIRY</span><span>EF / CLIENT</span></div>
    <p>Tell us what you need. We’ll discuss the scope, price and schedule before any booking is confirmed.</p>
    <div className="v2-form-step"><span>01</span><strong>Your details</strong></div>
    <div className="v2-form-row"><label>Full name *<input name="Full name" required placeholder="Your name"/></label><label>WhatsApp number *<input name="WhatsApp number" required type="tel" placeholder="Include country code"/></label></div>
    <div className="v2-form-row"><label>Email address<input name="Email" type="email" placeholder="Optional"/></label><label>Company or brand<input name="Company" placeholder="Optional"/></label></div>
    <div className="v2-form-step"><span>02</span><strong>Project details</strong></div>
    <Select label="You are *" name="Client type" required options={["Agency", "Production house", "Photographer or videographer", "Event organiser", "Creator", "Business", "Individual", "Other"]}/>
    <fieldset className="v2-choices"><legend>Services required *</legend>{["Video editing", "On-site editing", ...services.map(s => s.title)].map(value => <label key={value}><input type="checkbox" name="Services" value={value} checked={chosen.includes(value)} onChange={e => setChosen(e.target.checked ? [...chosen, value] : chosen.filter(x => x !== value))}/><span>{value}</span></label>)}</fieldset>
    {chosen.length === 0 && <p className="v2-field-hint">Choose at least one service.</p>}
    <Select label="Package interested in *" name="Package" required options={[...packages.map(p => p.name), "Custom project", "Recommend a package"]}/>
    <div className="v2-form-row"><Select label="Final video duration" name="Duration" options={["Up to 60 seconds", "1–3 minutes", "3–5 minutes", "5–10 minutes", "Over 10 minutes", "Multiple", "Not sure"]}/><label>Number of videos<input name="Video quantity" placeholder="Or not sure"/></label></div>
    <div className="v2-form-row"><Select label="Preferred format" name="Format" options={["Horizontal", "Vertical", "Both", "Need guidance"]}/><label>Ideal delivery date<input name="Delivery date" placeholder="Date or flexible"/></label></div>
    {editing && <div className="v2-form-row"><Select label="Is footage ready?" name="Footage ready" options={["Yes", "Partly", "Not yet"]}/><label>Footage link<input name="Footage link" type="url" placeholder="Optional shared folder"/></label></div>}
    {shooting && <div className="v2-form-row"><label>Shoot or event date<input name="Shoot date" placeholder="Date or undecided"/></label><label>Venue and city<input name="Venue and city" placeholder="Where will it happen?"/></label></div>}
    <label>Tell us about the project *<textarea name="Project brief" required rows={5} placeholder="Message, audience, deliverables and useful references"/></label>
    <label>Reference video or brief link<input name="Reference link" type="url" placeholder="Optional"/></label>
    <div className="v2-form-step"><span>03</span><strong>Send your enquiry</strong></div>
    <label className="v2-consent"><input type="checkbox" name="consent" required/><span>I have read the <Link href="/privacy/">Privacy Policy</Link> and agree to be contacted about this enquiry, including by WhatsApp message.</span></label>
    <button className="v2-button" type="submit" disabled={chosen.length === 0 || sending}>{sending ? "Sending…" : "Send enquiry"} <MessageCircle size={18}/></button>{notice}
    <p className="v2-form-note">Your answers are sent straight to our WhatsApp. This does not confirm a booking.</p>
  </form>;
}

export function CompactClientForm({ source }: { source: string }) {
  const { submit, notice, sending, status, reset } = useEnquiry("Editing Factory — landing page enquiry", { "Landing page": source });
  if (status === "sent") return <Thanks compact onReset={reset}/>;
  return <form className="v2-form v2-brief-form v2-compact-form" onSubmit={submit}><Honeypot/>
    <p>Share the essentials. We’ll reply on WhatsApp.</p>
    <div className="v2-form-row">
      <label>Full name *<input name="Full name" required autoComplete="name" placeholder="Your name"/></label>
      <label>WhatsApp number *<input name="WhatsApp number" required type="tel" autoComplete="tel" placeholder="Include country code"/></label>
    </div>
    <Select label="What do you need? *" name="Service" required options={["Video editing", "Social media videos", "Corporate or brand film", "Event editing", "Complete video production", "Not sure yet"]}/>
    <label>Tell us briefly about the project *<textarea name="Project brief" required rows={3} placeholder="Video type, quantity and preferred delivery date"/></label>
    <label className="v2-consent"><input type="checkbox" name="consent" required/><span>I agree to be contacted about this enquiry, including by WhatsApp message, and have read the <Link href="/privacy/">Privacy Policy</Link>.</span></label>
    <button className="v2-button" type="submit" disabled={sending}>{sending ? "Sending…" : "Send enquiry"} <MessageCircle size={18}/></button>{notice}
  </form>;
}

export function EditorForm() {
  const [engagement, setEngagement] = useState<string[]>([]);
  const { submit, notice, sending, status, reset } = useEnquiry("Editing Factory — editor application", undefined, "editor");
  if (status === "sent") return <Thanks onReset={() => { reset(); setEngagement([]); }}/>;
  return <form className="v2-form v2-brief-form" onSubmit={submit}><Honeypot/>
    <div className="v2-form-title"><span>BECOME AN EDITOR</span><span>EF / TEAM</span></div>
    <p>Apply for freelance, full-time or on-site work. Share only samples you are authorised to show.</p>
    <div className="v2-form-step"><span>01</span><strong>Your details</strong></div>
    <div className="v2-form-row"><label>Full name *<input name="Full name" required/></label><label>WhatsApp number *<input name="WhatsApp number" type="tel" required placeholder="Include country code"/></label></div>
    <div className="v2-form-row"><label>Email address *<input name="Email" type="email" required/></label><label>City and state *<input name="Location" required/></label></div>
    <div className="v2-form-step"><span>02</span><strong>Skills and availability</strong></div>
    <fieldset className="v2-choices"><legend>Preferred engagement *</legend>{["Freelance", "Full-time employment", "On-site event assignments"].map(value => <label key={value}><input type="checkbox" name="Engagement" value={value} checked={engagement.includes(value)} onChange={e => setEngagement(e.target.checked ? [...engagement, value] : engagement.filter(x => x !== value))}/><span>{value}</span></label>)}</fieldset>
    <div className="v2-form-row"><Select label="Editing experience *" name="Experience" required options={["Under 1 year", "1–3 years", "3–5 years", "Over 5 years"]}/><Select label="Availability *" name="Availability" required options={["Available now", "Part-time", "Notice period", "Selected dates"]}/></div>
    <Choices label="Core skills" name="Skills" options={["Video editing", "Motion graphics", "Colour", "Audio", "Multicamera", "Subtitles", "VFX", "3D"]}/>
    <Choices label="Software" name="Software" options={["Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut Pro", "Avid", "CapCut", "Blender", "Other"]}/>
    <div className="v2-form-row"><label>Languages you edit in *<input name="Languages" required placeholder="e.g. Telugu, Hindi, English"/></label><Select label="Your editing system" name="Editing system" options={["Laptop", "Desktop", "Both", "No personal system"]}/></div>
    <div className="v2-form-step"><span>03</span><strong>Show us your work</strong></div>
    <label>Main portfolio or showreel link *<input name="Portfolio" type="url" required placeholder="https://"/></label>
    <label>Best editing sample link *<input name="Best sample" type="url" required placeholder="https://"/></label>
    <label>What did you personally do on these samples? *<textarea name="Personal contribution" required rows={3}/></label>
    <div className="v2-form-row"><label>Motion graphics sample<input name="Motion graphics sample" type="url" placeholder="If relevant"/></label><label>CV or résumé link<input name="CV" type="url" placeholder="Optional accessible link"/></label></div>
    {engagement.includes("On-site event assignments") && <Select label="Can you bring an editing laptop?" name="On-site laptop" options={["Yes", "No"]}/>}
    {engagement.length > 0 && <label>Expected rate or salary and availability<textarea name="Rates and schedule" rows={2} placeholder="Hourly/project rate, monthly salary or eight-hour day rate, as relevant"/></label>}
    <div className="v2-form-step"><span>04</span><strong>Review and send</strong></div>
    <label className="v2-consent"><input type="checkbox" name="Declaration" required/><span>My details are accurate and I have correctly described my contribution to each sample.</span></label>
    <label className="v2-consent"><input type="checkbox" name="consent" required/><span>I have read the <Link href="/privacy/">Privacy Policy</Link> and agree to be contacted about my application, including by WhatsApp message.</span></label>
    <button className="v2-button" type="submit" disabled={engagement.length === 0 || sending}>{sending ? "Sending…" : "Send application"} <ArrowDownRight size={18}/></button>{notice}
    <p className="v2-form-note">Your application is sent straight to our WhatsApp. Applications are reviewed privately; submitting does not guarantee work.</p>
  </form>;
}
