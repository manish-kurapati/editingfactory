"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Check, ExternalLink, MessageCircle } from "lucide-react";
import { FormActionButton, FormActionsProvider } from "@/components/form-actions";
import { TestimonialPreview } from "@/components/testimonial-preview";
import { linkedinUrl, whatsappDisplay, whatsappUrl } from "@/data/contact";
import { packages } from "@/data/content";

const services = [
  { number: "01", title: "Video Editing", copy: "Reels, interviews, podcasts, events and long-form stories shaped with purposeful pacing, clean sound, colour and captions." },
  { number: "02", title: "Motion & Brand Graphics", copy: "Titles, lower thirds, logo animation and graphic callouts that keep every video recognisably yours." },
  { number: "03", title: "Complete Production", copy: "Concept, scripting, filming and post-production for brand films, corporate stories, promotions and documentaries." },
];

const tools = [
  ["Premiere Pro", "premiere-pro-64.png"],
  ["After Effects", "after-effects-64.png"],
  ["DaVinci Resolve", "davinci-resolve.png"],
  ["Final Cut Pro", "final-cut-pro.png"],
  ["Audition", "audition-64.png"],
  ["Media Encoder", "media-encoder.png"],
  ["Photoshop", "photoshop-64.png"],
] as const;

function BookButton({ className = "" }: { className?: string }) {
  return <FormActionButton kind="client" className={`campaign-book ${className}`}>Book Inquiry <ArrowDownRight size={18}/></FormActionButton>;
}

function CampaignTools() {
  return <section className="campaign-tools" aria-label="Software used by Editing Factory">
    <div className="campaign-tools-heading"><span>TOOLS BEHIND THE TIMELINE</span><p>Professional workflows for every frame, sound and export.</p></div>
    <div className="campaign-tools-window"><div className="campaign-tools-track">{[0, 1].flatMap(copy => tools.map(([name, file]) => <div className="campaign-tool" key={`${copy}-${name}`} aria-hidden={copy === 1}><Image src={`/logos/${file}`} alt={copy === 0 ? name : ""} width={58} height={58}/><span>{name}</span></div>))}</div></div>
  </section>;
}

export function CampaignLanding({ campaign }: { campaign: "NRI" | "Regional" }) {
  return <FormActionsProvider compactClientSource={campaign}>
    <div className="campaign-page" id="top">
      <header className="campaign-header">
        <Link href={campaign === "NRI" ? "/nri/" : "/regional/"} aria-label="Editing Factory landing page"><Image src="/logos/editing-factory.png" width={78} height={78} alt="Editing Factory"/></Link>
      </header>
      <BookButton className="campaign-book-fixed"/>

      <main>
        <section className="campaign-hero">
          <Image src="/images/studio-hero.png" alt="Professional editor working at a studio workstation" fill priority sizes="100vw"/>
          <div className="campaign-hero-fade"/>
          <div className="campaign-hero-copy">
            <h1>INDIA’S FIRST<small>ON-DEMAND EDITING STUDIO<br/>FOR <em>EVERY</em> STORY.</small></h1>
            <BookButton className="campaign-book-light"/>
          </div>
        </section>

        <div className="campaign-ticker" aria-label="You shoot. We edit."><div>{Array.from({length: 10}).map((_, i) => <span key={i}>YOU SHOOT. <b>WE EDIT.</b> <i>✦</i></span>)}</div></div>

        <section className="campaign-section campaign-services">
          <div className="campaign-section-head"><span>WHAT WE DO</span><h2>Your footage.<br/><em>Finished with purpose.</em></h2><p>Editing support for creators, businesses, agencies and production teams—online or on site.</p></div>
          <div className="campaign-service-grid">{services.map(service => <article key={service.title}><span>{service.number}</span><h3>{service.title}</h3><p>{service.copy}</p></article>)}</div>
        </section>

        <section className="campaign-section campaign-packages">
          <div className="campaign-section-head"><span>PACKAGES</span><h2>Start with what<br/><em>fits right now.</em></h2><p>Clear starting points for one video or a complete branded series.</p></div>
          <div className="campaign-package-grid">{packages.map((item, index) => <article className={item.featured ? "featured" : ""} key={item.name}>{item.featured && <b>POPULAR</b>}<span>0{index + 1} / 06</span><h3>{item.name}</h3><strong>{item.price}</strong><small>{item.unit}</small><p>{item.intro}</p><ul>{item.features.slice(0, 4).map(point => <li key={point}><Check size={15}/>{point}</li>)}</ul><BookButton/></article>)}</div>
        </section>

        <section className="campaign-section campaign-about">
          <div><span>ABOUT EDITING FACTORY</span><h2>Experienced hands.<br/><em>A fresh way to work.</em></h2></div>
          <div><p>Editing Factory is a Hyderabad-based video editing and production platform built for creators, agencies, businesses and production teams in India and abroad.</p><p>Led by more than two decades of broadcast and post-production experience, our work brings together clear briefs, dependable delivery and editors who understand the story behind the footage.</p><div className="campaign-about-points"><span>20+ years of industry experience</span><span>Remote and on-site editing</span><span>Editing, motion, sound and colour</span></div></div>
        </section>

        <TestimonialPreview/>
        <CampaignTools/>

        <section className="campaign-final">
          <span>READY WHEN YOU ARE</span><h2>Let’s make the next<br/>frame matter.</h2><p>Tell us what you’re making. We’ll recommend the right way to begin.</p><BookButton className="campaign-book-light"/>
        </section>
      </main>

      <footer className="campaign-footer">
        <div><Image src="/logos/editing-factory.png" width={72} height={72} alt="Editing Factory"/><p>YOU SHOOT. <b>WE EDIT.</b></p></div>
        <div className="campaign-footer-links"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/> {whatsappDisplay}</a><a href={linkedinUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={18}/> LinkedIn</a><Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link></div>
        <small>© {new Date().getFullYear()} Editing Factory · Moonlight Media Services Private Limited</small>
      </footer>
    </div>
  </FormActionsProvider>;
}
