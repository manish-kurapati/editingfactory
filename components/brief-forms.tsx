"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownRight, MessageCircle } from "lucide-react";
import { packages, services } from "@/data/content";
import { whatsappNumber } from "@/data/contact";

const field = (data: FormData, name: string) => data.getAll(name).map(String).filter(Boolean).join(", ");
function useEnquiry(heading: string, extra?: Record<string, string>, kind: "client" | "editor" = "client") {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    Object.entries(extra ?? {}).forEach(([k, v]) => data.set(k, v));
    const fields = Array.from(new Set(Array.from(data.keys()))).filter(key => key !== "consent" && key !== "Declaration" && key !== "website").map(key => [key, field(data, key)]);
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ heading, kind, fields, website: data.get("website") }) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      router.push(`/thank-you/?type=${kind}`);
    } catch {
      setStatus("error");
    }
  }
  const notice = status === "error" ? <p className="v2-form-note" role="alert">We could not send this right now. Please try again, or <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">message us on WhatsApp</a>.</p> : null;
  return { status, submit, notice, sending: status === "sending" || status === "sent" };
}
const Honeypot = () => <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}/>;
function Select({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) {
  return <label>{label}<select name={name} required={required} defaultValue=""><option value="" disabled>Select one</option>{options.map(option => <option key={option}>{option}</option>)}</select></label>;
}
function Choices({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <fieldset className="v2-choices"><legend>{label}</legend>{options.map(option => <label key={option}><input type="checkbox" name={name} value={option}/><span>{option}</span></label>)}</fieldset>;
}

export function ClientForm({ defaultPackage = "", source }: { defaultPackage?: string; source?: string }) {
  const { submit, notice, sending } = useEnquiry("Editing Factory — new project enquiry", source ? { Source: source } : undefined);
  return <form className="v2-form v2-brief-form v2-compact-form" onSubmit={submit}><Honeypot/>
    <p>Tell us what you need. We’ll confirm scope, price and schedule before anything is booked.</p>
    <div className="v2-form-row">
      <label>Full name *<input name="Full name" required autoComplete="name" placeholder="Your name"/></label>
      <label>WhatsApp number *<input name="WhatsApp number" required type="tel" autoComplete="tel" placeholder="Include country code"/></label>
    </div>
    <div className="v2-form-row">
      <Select label="What do you need? *" name="Service" required options={["Video editing", "On-site editing", ...services.map(s => s.title)]}/>
      <label>Package *<select name="Package" required defaultValue={defaultPackage}><option value="" disabled>Select one</option>{[...packages.map(p => p.name), "Custom project", "Recommend a package"].map(option => <option key={option}>{option}</option>)}</select></label>
    </div>
    <label>Tell us briefly about the project *<textarea name="Project brief" required rows={3} placeholder="Video type, quantity and preferred delivery date"/></label>
    <label className="v2-consent"><input type="checkbox" name="consent" required/><span>I agree to be contacted about this enquiry, including by WhatsApp message, and have read the <Link href="/privacy/">Privacy Policy</Link>.</span></label>
    <button className="v2-button" type="submit" disabled={sending}>{sending ? "Sending…" : "Send enquiry"} <MessageCircle size={18}/></button>{notice}
  </form>;
}

export function EditorForm() {
  const [engagement, setEngagement] = useState<string[]>([]);
  const { submit, notice, sending } = useEnquiry("Editing Factory — editor application", undefined, "editor");
  return <form className="v2-form v2-brief-form" onSubmit={submit}><Honeypot/>
    <div className="v2-form-title"><span>BECOME AN EDITING PARTNER</span><span>EF / TEAM</span></div>
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
