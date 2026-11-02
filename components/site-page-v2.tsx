"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowDownRight, ArrowRight, CalendarDays, Camera, Check, Clapperboard, FileText, Film, FolderUp, Menu, MessageCircle, MessageSquare, Play, ReceiptText, Scissors, Send, SlidersHorizontal, X } from "lucide-react";
import { packages, services } from "@/data/content";
import { ClientForm, EditorForm } from "@/components/brief-forms";
import { TestimonialPreview } from "@/components/testimonial-preview";
import { VideoPortfolio } from "@/components/video-portfolio";
import { CameraGallery } from "@/components/camera-gallery";
import { policies } from "@/data/policies";
import { workflow } from "@/data/workflow";
import { enquiryWhatsappUrl, whatsappUrl } from "@/data/contact";
import { FormActionButton, FormActionsProvider } from "@/components/form-actions";

type Page = "home" | "services" | "packages" | "portfolio" | "about" | "process" | "contact" | "editors" | "privacy" | "terms" | "cancellation" | "files";
type Tone = "ivory" | "lavender";
const nav = [{ n: "Home", u: "/", p: "home" }, { n: "Services", u: "/services/", p: "services" }, { n: "Packages", u: "/packages/", p: "packages" }, { n: "Portfolio", u: "/portfolio/", p: "portfolio" }, { n: "About", u: "/about/", p: "about" }, { n: "How It Works", u: "/process/", p: "process" }, { n: "Contact", u: "/contact/", p: "contact" }] as const;
const easing = [0.22, 1, 0.36, 1] as const;
const reveal = { initial: { opacity: 0, y: 34 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .15 }, transition: { duration: .75, ease: easing } };
const tools = [{ name: "Premiere Pro", file: "premiere-pro-64.png" }, { name: "After Effects", file: "after-effects-64.png" }, { name: "DaVinci Resolve", file: "davinci-resolve.png" }, { name: "Final Cut Pro", file: "final-cut-pro.png" }, { name: "Audition", file: "audition-64.png" }, { name: "Media Encoder", file: "media-encoder.png" }, { name: "Photoshop", file: "photoshop-64.png" }];
const works = [{ title: "Landscape films", format: "16:9", image: "/images/service-3.png", text: "A wider canvas for brand stories, interviews and films with room to unfold." }, { title: "Vertical stories", format: "9:16", image: "/images/service-4.png", text: "Short, focused edits that feel natural in the palm of a hand." }, { title: "Event highlights", format: "EVENT", image: "/images/service-1.png", text: "The atmosphere, people and defining moments brought together." }, { title: "Long-form edits", format: "LONG FORM", image: "/images/service-5.png", text: "Space to build context, shape a narrative and stay with an idea." }];
const pageHero: Record<Exclude<Page, "home">, { no: string; tag: string; title: React.ReactNode; copy: string; image: string; alt: string }> = {
  services: { no: "01", tag: "THE WORK", title: <>More ways to make<br/><em>an impression.</em></>, copy: "From concept and camera to design, campaigns and the finished cut, find the creative team your brief needs.", image: "/images/services/production.jpg", alt: "Crew producing a brand film" },
  packages: { no: "02", tag: "THE OPTIONS", title: <>Good work starts<br/><em>with a clear scope.</em></>, copy: "Choose a practical starting point for the work you have now. We will agree the details before the first cut begins.", image: "/images/service-6.png", alt: "Creative team planning a film" },
  portfolio: { no: "03", tag: "THE SCREEN", title: <>Made to be seen.<br/><em>Built to be felt.</em></>, copy: "A home for real films, reels, events and stories. Client work will appear here when available to share.", image: "/images/service-1.png", alt: "Camera operator filming an event" },
  about: { no: "04", tag: "THE STUDIO", title: <>The craft behind<br/><em>the cut.</em></>, copy: "Your on-demand video editing platform. Online. On-site. All in one place.", image: "/images/service-5.png", alt: "Editor shaping a documentary timeline" },
  process: { no: "05", tag: "THE METHOD", title: <>A clear path from<br/><em>camera to cut.</em></>, copy: "From the first file transfer to the last export, the process keeps your brief, feedback and final outcome in focus.", image: "/images/service-4.png", alt: "Vertical video being edited" },
  contact: { no: "06", tag: "THE FIRST FRAME", title: <>Tell us what<br/><em>you’re making.</em></>, copy: "A few details about the idea, footage and timing give us a useful place to begin.", image: "/images/service-2.png", alt: "Creator recording a short video" },
  editors: { no: "07", tag: "JOIN THE TEAM", title: <>Your craft belongs<br/><em>in the frame.</em></>, copy: "Share your experience, best work and availability to join our editor network.", image: "/images/editing-workstation.png", alt: "Professional editing workstation" },
  privacy: { no: "08", tag: "YOUR INFORMATION", title: <>A clear approach<br/><em>to your details.</em></>, copy: "How we use the information you choose to send us.", image: "/images/service-6.png", alt: "Studio workspace" },
  terms: { no: "09", tag: "SERVICE TERMS", title: <>Clear scope.<br/><em>Better work.</em></>, copy: "The terms that support each brief, quotation and delivery.", image: "/images/service-6.png", alt: "Creative team planning work" },
  cancellation: { no: "10", tag: "CANCELLATION & REFUNDS", title: <>Plans can change.<br/><em>Terms stay clear.</em></>, copy: "How cancellations, rescheduling and refunds are handled.", image: "/images/service-6.png", alt: "Creative team planning work" },
  files: { no: "11", tag: "FILE HANDLING", title: <>Your files.<br/><em>Handled with care.</em></>, copy: "Transfer, delivery and the ten-day retention period.", image: "/images/service-6.png", alt: "Creative team planning work" },
};
function Brand() { return <Image className="v2-brand" src="/logos/editing-factory.png" width={220} height={220} alt="Editing Factory" priority />; }
function CtaLink({ href, children, outline = false }: { href: string; children: React.ReactNode; outline?: boolean }) { const className = `v2-button ${outline ? "v2-button-outline" : ""}`; return href === "/contact/" ? <FormActionButton kind="client" className={className}>{children}<ArrowDownRight size={19}/></FormActionButton> : <Link href={href === "/packages/" ? "/packages/#package-collection" : href} className={className}>{children}<ArrowDownRight size={19}/></Link>; }
function Kicker({ children }: { children: React.ReactNode }) { return <span className="v2-kicker"><i />{children}</span>; }
function Wave({ from, to }: { from: Tone; to: Tone }) { return <div className={`v2-wave v2-${from}`} aria-hidden="true"><svg viewBox="0 0 1440 92" preserveAspectRatio="none"><path className={`v2-fill-${to}`} d="M0,42 C187,100 352,-6 545,48 C738,102 890,-8 1080,48 C1238,92 1334,66 1440,26 L1440,92 L0,92 Z" /></svg></div>; }
function Heading({ label, title, copy }: { label: string; title: React.ReactNode; copy?: string }) { return <motion.div {...reveal} className="v2-heading"><div><Kicker>{label}</Kicker><h2>{title}</h2></div>{copy && <p>{copy}</p>}</motion.div>; }
function Header({ page, show }: { page: Page; show: boolean }) { const [open, setOpen] = useState(false); useEffect(() => setOpen(false), [page]); return <header className={`v2-header ${show ? "v2-header-show" : ""}`}><nav className="v2-nav" aria-label="Primary navigation"><div className="v2-nav-left">{nav.slice(0, 4).map(a => <Link className={page === a.p ? "active" : ""} href={a.u} key={a.u}>{a.n}</Link>)}</div><Link href="/" className="v2-nav-logo" aria-label="Editing Factory home"><Brand /></Link><div className="v2-nav-right">{nav.slice(4).map(a => <Link className={page === a.p ? "active" : ""} href={a.u} key={a.u}>{a.n}</Link>)}</div><button className="v2-menu-button" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></nav>{open && <div className="v2-mobile-nav">{nav.map(a => <Link key={a.u} href={a.u} onClick={() => setOpen(false)}>{a.n}<ArrowRight size={16} /></Link>)}</div>}</header>; }
function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 100]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -55]);
  return <section ref={ref} className="v2-hero">
    <motion.div className="v2-hero-photo" style={{ y: imageY }}><Image src="/images/studio-hero.png" alt="Editor shaping a film at a studio workstation with a cinema camera nearby" fill priority sizes="100vw"/></motion.div>
    <div className="v2-hero-shade"/>
    <motion.div className="v2-hero-copy" style={{ y: copyY }}>
      <h1 className="v2-hero-headline"><span className="v2-mask"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: .15, duration: 1, ease: easing }}>INDIA’S FIRST</motion.span></span><span className="v2-hero-headline-sub">ON-DEMAND EDITING STUDIO<br/>FOR <em>EVERY</em> <mark>STORY.</mark></span></h1>
      <motion.div className="v2-hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}><CtaLink href="/packages/">Explore Packages</CtaLink><CtaLink href="/contact/" outline>Start a Project</CtaLink></motion.div>
      <div className="v2-hero-tagline">YOU SHOOT. <strong>WE EDIT.</strong></div>
    </motion.div>
    <div className="v2-hero-meta"><span>EDITING FACTORY / FRAME BY FRAME</span><span>SCROLL TO EXPLORE <ArrowDown size={14}/></span></div><span className="v2-rec"><b/> REC &nbsp; 00:00:01:00</span>
  </section>;
}
function WordTicker() { return <div className="v2-word-ticker" aria-label="You shoot. We edit."><div>{Array.from({ length: 12 }).map((_, i) => <span className="v2-ticker-phrase" key={i}>YOU SHOOT. <b>WE EDIT.</b><i aria-hidden="true">✦</i></span>)}</div></div>; }
function ToolStrip() { return <div className="v2-tools" aria-label="Creative software used by Editing Factory"><div className="v2-tools-title">THE TOOLS BEHIND THE TIMELINE <span>↘</span></div><div className="v2-tools-track">{Array.from({ length: 4 }).flatMap((_, k) => tools.map(t => <div className="v2-tool" key={`${k}-${t.name}`}><Image src={`/logos/${t.file}`} alt={k === 0 ? t.name : ""} width={64} height={64} /></div>))}</div><small>Product icons © Adobe, Apple and Blackmagic Design.</small></div>; }
function HomePackages() {
  return <section id="packages" className="v2-section v2-lavender v2-home-packages">
    <div className="v2-container">
      <Heading label="01 / WAYS TO WORK" title={<>A starting point for<br/><em>your next story.</em></>} copy="Compare all six Editing Factory packages, from one paid edit to an on-site team or complete production." />
      <div className="v2-home-package-grid">
        {packages.map((p, i) => <motion.article {...reveal} className={`v2-home-package ${p.featured ? "featured" : ""}`} key={p.name}>
          <div key="image" className="v2-home-package-image"><Image src={`/images/service-${i + 1}.png`} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw"/><span>0{i + 1} / 06</span>{p.featured && <b>RECOMMENDED</b>}</div>
          <div key="body" className="v2-home-package-body"><span>{p.eyebrow}</span><h3>{p.name}</h3><p>{p.intro}</p><div><strong>{p.price}</strong><small>{p.unit}</small></div><ul>{p.features.map(feature => <li key={feature}><Check size={15}/>{feature}</li>)}</ul><FormActionButton kind="client" className="v2-home-package-action">Discuss this package <ArrowDownRight size={18}/></FormActionButton></div>
        </motion.article>)}
      </div>
      <div className="v2-section-foot"><p>Every package follows a clear brief, with extra formats and longer edits scoped before work begins.</p><Link href="/packages/#package-collection">Read the full package details <ArrowRight size={18}/></Link></div>
    </div>
  </section>;
}
function ScrollStudio() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const headX = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 205]);

  return <section ref={ref} className="v2-section v2-ivory">
    <div className="v2-container v2-studio-grid">
      <div>
        <Kicker>02 / FROM RAW TO REMARKABLE</Kicker>
        <h2>The magic lives<br/>in the <em>middle.</em></h2>
        <p>Between pressing record and pressing play is a thousand small decisions. We find the strongest moments, build the rhythm and make every frame work harder.</p>
        <div className="v2-stages">
          <div><span>01</span><strong>Find the story</strong><p>Review the material and give it a clear direction.</p></div>
          <div><span>02</span><strong>Shape the cut</strong><p>Build pace, flow and meaning through purposeful choices.</p></div>
          <div><span>03</span><strong>Finish the frame</strong><p>Refine sound, colour, graphics and exports.</p></div>
        </div>
      </div>
      <div className="v2-camera-stage">
        <Image className="v2-stage-photo" src="/images/editing-workstation.png" alt="A film editor working at a professional editing station" fill sizes="(max-width: 820px) 100vw, 55vw"/>
        <div className="v2-stage-shade" aria-hidden="true"/>
        <div className="v2-stage-top"><span>THE EDITING ROOM</span><span>01 / 03</span></div>
        <div className="v2-timeline" aria-hidden="true"><div className="v2-ticks"/><div className="v2-clips"><i/><i/><i/><i/><i/></div><motion.b style={{ x: headX }}/></div>
        <div className="v2-stage-bottom"><Scissors size={20}/><span>THE FRAME BECOMES THE STORY</span><span>00:00:12:24</span></div>
      </div>
    </div>
  </section>;
}
function Work({ full = false }: { full?: boolean }) { return <section className="v2-section v2-lavender"><div className="v2-container"><Heading label="03 / THE SCREEN" title={<>Every frame tells <em>a story.</em></>} copy="The portfolio is reserved for real Editing Factory projects. These spaces are ready for approved films when they are available."/><div className="v2-work-grid">{works.slice(0, full ? 4 : 2).map((w, i) => <motion.article {...reveal} className={`v2-work v2-work-${i}`} key={w.title}><div className="v2-work-image"><Image src={w.image} alt={`Editorial visual for ${w.title}; project preview coming soon`} fill sizes="(max-width:700px) 100vw, 50vw"/><span>{w.format}</span><i>+</i></div><div className="v2-work-copy"><span>0{i + 1} / PREVIEW SPACE</span><h3>{w.title}</h3><p>{w.text}</p></div></motion.article>)}</div><div className="v2-section-foot"><p>Real project videos will replace these visual spaces as they become available.</p>{!full && <Link href="/portfolio/">Explore the portfolio <ArrowRight size={18}/></Link>}</div></div></section>; }
const workflowIcons = [FileText, FolderUp, ReceiptText, CalendarDays, Clapperboard, MessageSquare, Send];
function WorkflowList() { return <div className="v2-workflow-grid">{workflow.map((step, i) => { const Icon = workflowIcons[i]; return <div className="v2-workflow-step" key={step.title}><div className="v2-workflow-icon"><Icon size={29} strokeWidth={1.4}/></div><span>{String(i + 1).padStart(2, "0")} / 07</span><h3>{step.title}</h3><p>{step.detail}</p></div>; })}</div>; }
function ProcessBand() { return <section className="v2-section v2-ivory"><div className="v2-container"><Heading label="03 / HOW IT WORKS" title={<>One clear line<br/><em>from brief to screen.</em></>} copy="All seven milestones, from the first brief to final delivery."/><WorkflowList/><div className="v2-section-foot"><p>See every milestone, from quotation to final feedback.</p><Link href="/process/">How it works & FAQs <ArrowRight size={18}/></Link></div></div></section>; }
function GoldInterlude() { return <section className="v2-gold-wrap v2-ivory"><div className="v2-container v2-gold-interlude"><span>THE EDITING FACTORY PROMISE / 05</span><h2>YOUR FOOTAGE.<br/><em>OUR OBSESSION.</em></h2><p>From a single first cut to a full production, we give every frame the attention it deserves.</p><Link href="/packages/#package-collection">Find your package <ArrowDownRight size={19}/></Link><i aria-hidden="true"/></div></section>; }
function Cta({ tone = "ivory", title = "Let’s make the next frame matter." }: { tone?: Tone; title?: string }) { return <section className={`v2-cta-wrap v2-${tone}`}><div className="v2-container"><motion.div {...reveal} className="v2-cta"><div><Kicker>YOUR STORY STARTS HERE</Kicker><h2>{title}</h2><p>Bring us the idea, the footage or a blank page. We will help work out the right way forward.</p><CtaLink href="/contact/">Start a Conversation</CtaLink></div><div className="v2-cta-art" aria-hidden="true"><i/><i/><Clapperboard size={110} strokeWidth={.75}/></div></motion.div></div></section>; }
function Home() { return <><HomeHero/><Wave from="ivory" to="lavender"/><WordTicker/><HomePackages/><Wave from="lavender" to="ivory"/><ScrollStudio/><ProcessBand/><GoldInterlude/><Wave from="ivory" to="lavender"/><TestimonialPreview/><Wave from="lavender" to="ivory"/><Cta/></>; }
function InnerHero({ page }: { page: Exclude<Page, "home"> }) { const h = pageHero[page]; return <section className="v2-inner-hero"><div className="v2-inner-photo"><Image src={h.image} alt={h.alt} fill priority sizes="(max-width:800px) 100vw, 54vw"/></div><div className="v2-inner-shade"/><div className="v2-inner-content"><Kicker>{h.no} / {h.tag}</Kicker><h1>{h.title}</h1><p>{h.copy}</p><span>EDITING FACTORY &nbsp; ↘ &nbsp; {h.tag}</span></div><b aria-hidden="true">{h.no}</b></section>; }
function ServicesPage() {
  return <><InnerHero page="services"/><Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender"><div className="v2-container">
      <Heading label={`THE SERVICE INDEX / 01–${String(services.length).padStart(2, "0")}`} title={<>Your idea, made<br/><em>for the world.</em></>} copy="Creative directions, one connected team. Every service is scoped around the audience, deliverables and result you need."/>
      <div className="v2-directory">{services.map((s, i) => <motion.article {...reveal} key={s.title}>
        <div className="v2-directory-image"><Image src={`/images/services/${s.image}`} alt={`${s.title} creative production visual`} fill sizes="(max-width:800px) 100vw, 40vw"/><span>EF / {String(i + 1).padStart(2, "0")}</span></div>
        <div className="v2-directory-copy"><span>{String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span><h3>{s.title}</h3><h4>{s.tag}</h4><p>{s.description}</p><ul>{s.list.map(x => <li key={x}><ArrowRight size={14}/>{x}</li>)}</ul><FormActionButton kind="client" className="v2-directory-action">Discuss this service <ArrowDownRight size={18}/></FormActionButton></div>
        {s.title === "Complete Video Production" && <CameraGallery/>}
      </motion.article>)}</div>
    </div></section><Wave from="lavender" to="ivory"/>
    <section className="v2-section v2-ivory"><div className="v2-container"><Heading label="ONE CONNECTED BRIEF" title={<>Across every format,<br/><em>one clear direction.</em></>} copy="Production, design and promotion work best when the aim is clear. Tell us what you are making, where it will live and who it needs to reach."/><div className="v2-format-grid"><div><span>01 / CREATE</span><h3>Make the material.</h3><p>Film, photograph, design or develop the visual concept with a team matched to the brief.</p></div><div><span>02 / SHAPE & SHARE</span><h3>Give it a destination.</h3><p>Turn raw material into a finished story, then plan how it reaches the right audience.</p></div></div></div></section>
    <Wave from="ivory" to="lavender"/><Cta tone="lavender" title="Bring us the brief. We’ll find the right team."/></>;
}
function PackagesPage() {
  return <>
    <InnerHero page="packages"/>
    <Wave from="ivory" to="lavender"/>
    <section id="package-collection" className="v2-section v2-lavender">
      <div className="v2-container">
        <Heading label="THE COMPLETE PACKAGE INDEX / 01–06" title={<>Six ways to make<br/><em>the work happen.</em></>} copy="Every Editing Factory package is here, from a single paid edit to an on-site team or a film produced from the first idea."/>
        <div className="v2-price-grid">
          {packages.map((p, i) => <motion.article {...reveal} className={p.featured ? "featured" : ""} key={p.name}>
            <div className="v2-price-top"><span>0{i + 1} / {p.eyebrow}</span>{p.featured && <b>RECOMMENDED</b>}</div>
            <h3>{p.name}</h3><p>{p.intro}</p>
            <div className="v2-price"><strong>{p.price}</strong><span>{p.unit}</span></div>
            <FormActionButton kind="client" className="v2-price-action">Discuss this package <ArrowDownRight size={18}/></FormActionButton>
            <ul>{p.features.map(f => <li key={f}><Check size={16}/>{f}</li>)}</ul>
          </motion.article>)}
        </div>
      </div>
    </section>
    <Wave from="lavender" to="ivory"/>
    <section className="v2-section v2-ivory">
      <div className="v2-container">
        <Heading label="THE PRACTICAL DETAILS" title={<>A clear brief.<br/><em>A better final cut.</em></>} copy="The advertised prices cover their stated scope. We confirm deliverables, timing and booking terms before payment."/>
        <div className="v2-detail-grid">
          <div><span>01 / FORMAT</span><h3>One format each</h3><p>Choose horizontal 16:9 or vertical 9:16 per video. Additional format versions receive a separate quote.</p></div>
          <div><span>02 / FEEDBACK</span><h3>Consolidated rounds</h3><p>Each round is one feedback list within the approved brief. New concepts, added footage and deliverables are quoted separately. Dedicated revisions count toward monthly hours; Originals and On-Site follow their quotations.</p></div>
          <div><span>03 / DURATION</span><h3>Longer edits by quote</h3><p>Final duration, source-footage volume, graphics, audio and deadline shape longer-video pricing. The advertised 60-second package prices do not include longer edits.</p></div>
          <div><span>04 / DELIVERY</span><h3>Files and tax</h3><p>Files stay available for 10 days after delivery, so download and back them up. Applicable GST is extra on all prices.</p></div>
        </div>
      </div>
    </section>
    <Wave from="ivory" to="lavender"/>
    <Cta tone="lavender" title="Ready to find the right way to work?"/>
  </>;
}
function PortfolioPage() { return <><InnerHero page="portfolio"/><Wave from="ivory" to="lavender"/><VideoPortfolio/><Wave from="lavender" to="ivory"/><section className="v2-section v2-ivory"><div className="v2-container v2-portfolio-note"><Kicker>MORE STORIES TO COME</Kicker><h2>A growing collection.</h2><p>These first films are live now. More vertical and horizontal projects will be added as final files are supplied and approved for the portfolio.</p><FormActionButton kind="client" className="v2-portfolio-action">Have a project to discuss? <ArrowRight size={18}/></FormActionButton></div></section><Wave from="ivory" to="lavender"/><Cta tone="lavender" title="A new story is waiting for its first frame."/></>; }
function AboutDocumentSections() {
  return <>
    <section className="v2-section v2-ivory"><div className="v2-container v2-about-feature v2-about-founder">
      <div><Kicker>EXPERIENCE BEHIND THE VISION</Kicker><h2>Editing is in<br/><em>our foundation.</em></h2><strong aria-label="Editing career began in 2003">2003</strong></div>
      <div><p>Editing Factory is founded by Sasi Ponnekanti, whose editing career began in 2003. His experience spans TV9, TV5, NTV and Sakshi TV — major Telugu television channels, including editorial and creative leadership roles.</p><p>His work extends to numerous corporate films, documentaries, promotional videos and public-awareness films for corporate organisations, State Governments and Central Government departments and institutions.</p><p>That experience shapes our approach: understand the audience, find the story and deliver work that serves the brief. It also drives our belief that video editors deserve recognition as creative partners in the production industry.</p></div>
    </div></section><Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender"><div className="v2-container"><Heading label="PROFESSIONAL EDITING" title={<>Every stage of<br/><em>your story.</em></>} copy="A single edit, ongoing monthly support or additional capacity for your production team."/>
      <div className="v2-about-offerings"><article><span>01 / FORMATS</span><h3>Stories of every size</h3><p>From Instagram Reels and YouTube Shorts to podcasts, interviews, corporate videos, brand films, wedding highlights and documentaries.</p></article><article><span>02 / POST-PRODUCTION</span><h3>The finished cut</h3><p>Video editing, motion graphics, colour correction and grading, audio cleanup, sound design, captions and format adaptation.</p></article><article><span>03 / CLEAR SCOPE</span><h3>Know the plan</h3><p>Whether you need one edit or continuing support, we agree on scope, deliverables, revisions, price and schedule before work begins.</p></article></div>
    </div></section><Wave from="lavender" to="ivory"/>
    <section className="v2-section v2-ivory"><div className="v2-container v2-about-feature v2-about-event"><div><Kicker>BOOK AN EDITING TEAM AT YOUR EVENT</Kicker><h2>Your event.<br/><em>Our editing team.</em></h2><p className="v2-about-strapline">Your content priorities, on site.</p></div><div><p>Our on-site video editing service lets you reserve laptop-equipped editors at your venue and plan their work around the outputs you need during the booked time.</p><p>Working with footage supplied by your shoot team, our editors can prepare social media Reels, speaker clips, promotional cuts and event highlights. Video quantities, durations and delivery schedules are agreed according to team size, booked hours and editing complexity.</p><p>As the event unfolds, you can coordinate priorities with the team — bringing editing directly into your event production workflow.</p><FormActionButton kind="client" className="v2-about-editor-action">Discuss on-site editing <ArrowDownRight size={18}/></FormActionButton></div></div></section><Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender"><div className="v2-container v2-about-feature"><div><Kicker>EDITORS AS CREATIVE PARTNERS</Kicker><h2>The people behind<br/><em>the cut.</em></h2></div><div><p>Editing Factory is being built around respect for editing talent. We welcome video editors and motion graphics professionals to apply through our platform and share their portfolios, skills and availability.</p><p>Through clear briefs, agreed commercial terms and structured feedback, we aim to create professional working relationships where editors can contribute creatively, strengthen their craft and access opportunities across markets.</p><FormActionButton kind="editor" className="v2-about-editor-action">Become an Editor <ArrowDownRight size={18}/></FormActionButton></div></div></section><Wave from="lavender" to="ivory"/>
    <section className="v2-section v2-ivory"><div className="v2-container"><Heading label="BEYOND POST-PRODUCTION" title={<>Before the footage<br/><em>reaches the edit.</em></>} copy="Creative support from first concept to the channels where the work appears."/><div className="v2-about-beyond"><p>For clients who need support before editing, we offer photography, videography and complete production — from concept development and scripting to shooting and final delivery.</p><ul><li>AI video production</li><li>Coffee table books and print design</li><li>Influencer marketing</li><li>Social media promotions</li><li>Media buying</li></ul></div></div></section><Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender"><div className="v2-container v2-about-feature"><div><Kicker>LOCAL ROOTS / GLOBAL AMBITION</Kicker><h2>Based in Hyderabad.<br/><em>Built to reach further.</em></h2></div><div><p>We are developing workflows for international video editing projects through organised footage handovers, clear feedback and consistent quality review.</p><p>Our ambition is to build lasting relationships with clients and editors across India, the USA, UK, Australia and beyond.</p></div></div></section><Wave from="lavender" to="ivory"/>
    <section className="v2-section v2-ivory"><div className="v2-container v2-about-vision"><Kicker>OUR VISION</Kicker><p>To meet the digital world’s growing need for high-quality video production and fast, dependable delivery by connecting clients with skilled editors and production teams.</p><p>Through remote collaboration and on-site editing, we aim to help clients bring their stories to audiences sooner — while giving editors recognition, professional standards and opportunities to grow as creative partners.</p></div></section><Wave from="ivory" to="lavender"/>
  </>;
}
function AboutPage() { return <><InnerHero page="about"/><Wave from="ivory" to="lavender"/><section className="v2-section v2-lavender"><div className="v2-container v2-about-story"><div><Kicker>ABOUT EDITING FACTORY</Kicker><h2>Your on-demand<br/><em>video editing platform.</em></h2><p className="v2-about-strapline">Online. On-site. All in one place.</p></div><div><p>Editing Factory is a Hyderabad-based video editing and production platform connecting clients with professional editors and creative teams. We provide remote video editing, on-site event editing and complete video production for creators, agencies, production houses, businesses and individuals.</p><p>Built with global ambitions, our focus markets include India, the USA, UK and Australia. Our goal is to make professional editing easier to access, with clear communication, quality work and dependable delivery.</p><p>Editing Factory is operated by Moonlight Media Services Private Limited.</p></div></div></section><Wave from="lavender" to="ivory"/><AboutDocumentSections/><section className="v2-section v2-lavender"><div className="v2-container v2-about-closing"><Kicker>LET’S CREATE TOGETHER</Kicker><h2>Have footage ready to edit?<br/>Need a team at your event?<br/><em>Planning a complete production?</em></h2><p>Share your brief. Let’s plan your next video.</p><FormActionButton kind="client" className="v2-button">Start a project <ArrowDownRight size={18}/></FormActionButton><strong>Editing Factory — You Shoot. We Edit.</strong></div></section></>; }
function ProcessPage() {
  const faqs = [
    ["How do I send footage?", "Share a cloud folder link with access enabled. Organised folders and a short brief help us get started faster."],
    ["Can you work with footage I have not shot yet?", "Yes. We can discuss the brief, recommend coverage and quote photography, videography or complete production."],
    ["What counts as a revision?", "One consolidated feedback list within the approved scope counts as one round. New concepts, added footage or formats are quoted separately."],
    ["Can I request a longer video or both formats?", "Yes. Longer edits and additional horizontal or vertical versions are scoped and quoted before production."],
    ["When is my booking confirmed?", "After we agree the quotation, schedule and commercial terms. Sending an enquiry alone does not reserve a slot."],
    ["How long are final files available?", "Download and back them up within 10 days after delivery."],
  ];
  return <><InnerHero page="process"/><Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender"><div className="v2-container"><Heading label="HOW IT WORKS / 01–07" title={<>A clear path from<br/><em>brief to delivery.</em></>} copy="Every stage has a purpose, so you know what happens next and what we need from you."/>
      <WorkflowList/>
    </div></section><Wave from="lavender" to="ivory"/><ScrollStudio/><Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender"><div className="v2-container"><Heading label="COMMON QUESTIONS" title={<>Good questions.<br/><em>Clear answers.</em></>} copy="A few practical details before you send the first brief."/>
      <div className="v2-faqs">{faqs.map(([q, a], i) => <details key={q}><summary><span>{String(i + 1).padStart(2, "0")}</span>{q}<b>+</b></summary><p>{a}</p></details>)}</div>
    </div></section><Wave from="lavender" to="ivory"/><Cta title="Ready to put the first frame in motion?"/></>;
}
function ContactPage() {
  return <><InnerHero page="contact"/><Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender"><div className="v2-container v2-contact-layout"><div>
      <Kicker>BOOK AN INQUIRY</Kicker><h2>Tell us about<br/><em>the frame you have in mind.</em></h2>
      <p>Video, photography, campaigns or a full production: give us the essentials and we’ll help shape the next step.</p>
      <a className="v2-contact-whatsapp" href={enquiryWhatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/> Chat on WhatsApp <ArrowDownRight size={18}/></a>
      <p className="v2-contact-number">+91 95055 55277</p><div className="v2-contact-steps"><span>01 / YOUR BRIEF</span><span>02 / OUR QUOTE</span><span>03 / THE SCHEDULE</span></div>
    </div><ClientForm/></div></section><Wave from="lavender" to="ivory"/>
    <section className="v2-section v2-ivory"><div className="v2-container"><Heading label="A USEFUL STARTING POINT" title={<>What to include<br/><em>in the first brief.</em></>} copy="A few details help us recommend the right team, package and production plan."/><div className="v2-detail-grid"><div><Camera/><h3>The material</h3><p>What has already been shot and whether you need photography, videography or drone coverage.</p></div><div><SlidersHorizontal/><h3>The direction</h3><p>The audience, channel, references and the feeling you want to leave.</p></div><div><Clapperboard/><h3>The deliverables</h3><p>Video count, duration, format, printed outputs or campaign scope.</p></div><div><Film/><h3>The timing</h3><p>Event date, review milestones and ideal final delivery.</p></div></div></div></section>
    <Wave from="ivory" to="lavender"/><Cta tone="lavender" title="Unsure which package fits? Let’s begin there."/></>;
}
function EditorsPage() {
  return <><InnerHero page="editors"/><Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender"><div className="v2-container v2-contact-layout"><div><Kicker>EDITORS AS CREATIVE PARTNERS</Kicker><h2>Make the cut.<br/><em>Build what’s next.</em></h2><p>Editing Factory welcomes video editors and motion graphics professionals for freelance projects, full-time roles and on-site assignments. Share your strongest work and tell us what you contributed.</p><p>We review portfolios privately, discuss commercial terms before an engagement and contact shortlisted applicants directly.</p></div><EditorForm/></div></section>
    <Wave from="lavender" to="ivory"/><Cta title="Good editing deserves a good team."/></>;
}
function PolicyPage({ page }: { page: keyof typeof policies }) { const policy = policies[page]; return <><InnerHero page={page}/><Wave from="ivory" to="lavender"/><section className="v2-section v2-lavender"><div className="v2-container v2-policy"><Kicker>EDITING FACTORY / MOONLIGHT MEDIA SERVICES PRIVATE LIMITED</Kicker><h2>{policy.title}</h2><p className="v2-policy-intro">{policy.intro}</p><div className="v2-policy-sections">{policy.sections.map(([heading, body], index) => <section key={heading}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{heading}</h3><p>{body}</p></div></section>)}</div><div className="v2-policy-contact"><h3>Questions or requests?</h3><p>Contact Editing Factory on WhatsApp at <a href={whatsappUrl}>+91 95055 55277</a>. Additional email, grievance contact and business address details will be added when supplied.</p></div></div></section></>; }
function WhatsAppLogo() { return <svg className="v2-whatsapp-logo" viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>; }
function FloatingActions() { return <div className="v2-floating-actions" aria-label="Quick actions"><FormActionButton kind="editor">Become an Editor <ArrowDownRight size={16}/></FormActionButton><FormActionButton kind="client" className="v2-floating-enquiry"><WhatsAppLogo/> Book Enquiry <ArrowDownRight size={16}/></FormActionButton></div>; }
function SocialLogo({ kind }: { kind: "facebook" | "youtube" | "instagram" }) { return <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{kind === "facebook" ? <path fill="currentColor" stroke="none" d="M14 8h3V4.5c-.52-.07-2.3-.23-4.42-.23C8.16 4.27 7 6.9 7 10.2V13H4v4h3v7h4.5v-7h3.35l.65-4H11.5v-2.4C11.5 9.45 11.82 8 14 8Z"/> : kind === "youtube" ? <><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path fill="currentColor" stroke="none" d="m10 9 5 3-5 3V9Z"/></> : <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></>}</svg>; }
function Footer() { return <><ToolStrip/><footer className="v2-footer"><div className="v2-container v2-footer-main"><div><Link href="/" aria-label="Editing Factory home"><Brand/></Link><p>YOU SHOOT. <span className="v2-tagline-edit">WE EDIT.</span><br/>The rest is in the details.</p><div className="v2-footer-socials" aria-label="Editing Factory social media"><a href="https://www.facebook.com/EditingFactoryOrginal/" target="_blank" rel="noopener noreferrer" aria-label="Editing Factory on Facebook"><SocialLogo kind="facebook"/></a><a href="https://www.youtube.com/@EditingFactory-p7e" target="_blank" rel="noopener noreferrer" aria-label="Editing Factory on YouTube"><SocialLogo kind="youtube"/></a><a href="https://www.instagram.com/editingfactory.studio?exln=MTQzem9uYXl2cGdydQ==" target="_blank" rel="noopener noreferrer" aria-label="Editing Factory on Instagram"><SocialLogo kind="instagram"/></a></div></div><div><span>EXPLORE</span>{nav.map(a => <Link key={a.u} href={a.u}>{a.n}</Link>)}<FormActionButton kind="editor" className="v2-footer-editor">Become an Editor</FormActionButton><Link href="/privacy/">Privacy Policy</Link><Link href="/terms/">Service Terms</Link><Link href="/cancellation/">Cancellation & Refunds</Link><Link href="/files/">File Handling</Link></div><div><span>START HERE</span><h3>Have something<br/>worth making?</h3><FormActionButton kind="client" className="v2-footer-cta">Start a conversation <ArrowDownRight size={18}/></FormActionButton><a className="v2-footer-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp: +91 95055 55277</a></div></div><div className="v2-container v2-footer-bottom"><span>© {new Date().getFullYear()} Editing Factory</span><span>YOU SHOOT. <span className="v2-tagline-edit">WE EDIT.</span></span><a href="#top">BACK TO THE FIRST FRAME ↑</a></div></footer></>; }
export function SitePageV2({ page }: { page: Page }) { return <FormActionsProvider><div id="top"><Header page={page} show/><main>{page === "home" ? <Home/> : page === "services" ? <ServicesPage/> : page === "packages" ? <PackagesPage/> : page === "portfolio" ? <PortfolioPage/> : page === "about" ? <AboutPage/> : page === "process" ? <ProcessPage/> : page === "editors" ? <EditorsPage/> : page === "privacy" || page === "terms" || page === "cancellation" || page === "files" ? <PolicyPage page={page}/> : <ContactPage/>}</main><Footer/><FloatingActions/></div></FormActionsProvider>; }
