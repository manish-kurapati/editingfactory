"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDownRight, MessageCircle } from "lucide-react";
import { packages, services } from "@/data/content";
import { whatsappNumber } from "@/data/contact";

const field = (data: FormData, name: string) => data.getAll(name).map(String).filter(Boolean).join(", ");
function sendToWhatsapp(data: FormData, heading: string) {
  const lines = Array.from(new Set(Array.from(data.keys()))).filter(key => key !== "consent").map(key => `${key}: ${field(data, key)}`).filter(line => !line.endsWith(": "));
  window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${heading}\n\n${lines.join("\n")}`)}`);
}
function Select({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) {
  return <label>{label}<select name={name} required={required} defaultValue=""><option value="" disabled>Select one</option>{options.map(option => <option key={option}>{option}</option>)}</select></label>;
}
function Choices({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <fieldset className="v2-choices"><legend>{label}</legend>{options.map(option => <label key={option}><input type="checkbox" name={name} value={option}/><span>{option}</span></label>)}</fieldset>;
}

export function ClientForm() {
  const [chosen, setChosen] = useState<string[]>([]);
  const shooting = chosen.some(value => ["Drone Videography and Photography", "Complete Video Production"].includes(value));
  const editing = chosen.some(value => /Editing|Video Production|AI Video/.test(value));
  function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); sendToWhatsapp(new FormData(e.currentTarget), "Editing Factory — new project enquiry"); }
  return <form className="v2-form v2-brief-form" onSubmit={submit}>
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
    <label className="v2-consent"><input type="checkbox" name="consent" required/><span>I have read the <Link href="/privacy/">Privacy Policy</Link> and agree to be contacted about this enquiry.</span></label>
    <button className="v2-button" type="submit" disabled={chosen.length === 0}>Continue on WhatsApp <MessageCircle size={18}/></button>
    <p className="v2-form-note">WhatsApp opens with your answers. Tap Send there to submit. This does not confirm a booking.</p>
  </form>;
}

export function EditorForm() {
  const [engagement, setEngagement] = useState<string[]>([]);
  function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); sendToWhatsapp(new FormData(e.currentTarget), "Editing Factory — editor application"); }
  return <form className="v2-form v2-brief-form" onSubmit={submit}>
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
    <label className="v2-consent"><input type="checkbox" name="consent" required/><span>I have read the <Link href="/privacy/">Privacy Policy</Link> and agree to be contacted about my application.</span></label>
    <button className="v2-button" type="submit" disabled={engagement.length === 0}>Send application on WhatsApp <ArrowDownRight size={18}/></button>
    <p className="v2-form-note">WhatsApp opens with your answers. Tap Send there to apply. Applications are reviewed privately; submitting does not guarantee work.</p>
  </form>;
}
