"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowDownRight, ArrowRight, Camera, Check, Clapperboard, Film, Menu, MessageCircle, Play, Scissors, SlidersHorizontal, X } from "lucide-react";
import { packages, services } from "@/data/content";
import { ClientForm, EditorForm } from "@/components/brief-forms";
import { TestimonialPreview } from "@/components/testimonial-preview";

type Page = "home" | "services" | "packages" | "portfolio" | "about" | "process" | "contact" | "editors" | "privacy";
type Tone = "ivory" | "lavender";
const nav = [{ n: "Home", u: "/", p: "home" }, { n: "Services", u: "/services/", p: "services" }, { n: "Packages", u: "/packages/", p: "packages" }, { n: "Portfolio", u: "/portfolio/", p: "portfolio" }, { n: "About", u: "/about/", p: "about" }, { n: "How It Works", u: "/process/", p: "process" }, { n: "Contact", u: "/contact/", p: "contact" }] as const;
const easing = [0.22, 1, 0.36, 1] as const;
const reveal = { initial: { opacity: 0, y: 34 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .15 }, transition: { duration: .75, ease: easing } };
const tools = [{ name: "Premiere Pro", file: "premiere-pro-64.png" }, { name: "After Effects", file: "after-effects-64.png" }, { name: "DaVinci Resolve", file: "davinci-resolve.png" }, { name: "Final Cut Pro", file: "final-cut-pro.png" }, { name: "Audition", file: "audition-64.png" }, { name: "Media Encoder", file: "media-encoder.png" }, { name: "Photoshop", file: "photoshop-64.png" }];
const works = [{ title: "Landscape films", format: "16:9", image: "/images/service-3.png", text: "A wider canvas for brand stories, interviews and films with room to unfold." }, { title: "Vertical stories", format: "9:16", image: "/images/service-4.png", text: "Short, focused edits that feel natural in the palm of a hand." }, { title: "Event highlights", format: "EVENT", image: "/images/service-1.png", text: "The atmosphere, people and defining moments brought together." }, { title: "Long-form edits", format: "LONG FORM", image: "/images/service-5.png", text: "Space to build context, shape a narrative and stay with an idea." }];
const pageHero: Record<Exclude<Page, "home">, { no: string; tag: string; title: React.ReactNode; copy: string; image: string; alt: string }> = {
  services: { no: "01", tag: "THE WORK", title: <>More ways to make<br/><em>an impression.</em></>, copy: "From concept and camera to design, campaigns and the finished cut, find the creative team your brief needs.", image: "/images/services/production.png", alt: "Crew producing a brand film" },
  packages: { no: "02", tag: "THE OPTIONS", title: <>Good work starts<br/><em>with a clear scope.</em></>, copy: "Choose a practical starting point for the work you have now. We will agree the details before the first cut begins.", image: "/images/service-6.png", alt: "Creative team planning a film" },
  portfolio: { no: "03", tag: "THE SCREEN", title: <>Made to be seen.<br/><em>Built to be felt.</em></>, copy: "A home for real films, reels, events and stories. Client work will appear here when available to share.", image: "/images/service-1.png", alt: "Camera operator filming an event" },
  about: { no: "04", tag: "THE STUDIO", title: <>The craft behind<br/><em>the cut.</em></>, copy: "Editing Factory is built around a simple idea: footage becomes more powerful when every choice serves the story.", image: "/images/service-5.png", alt: "Editor shaping a documentary timeline" },
  process: { no: "05", tag: "THE METHOD", title: <>A clear path from<br/><em>camera to cut.</em></>, copy: "From the first file transfer to the last export, the process keeps your brief, feedback and final outcome in focus.", image: "/images/service-4.png", alt: "Vertical video being edited" },
  contact: { no: "06", tag: "THE FIRST FRAME", title: <>Tell us what<br/><em>you’re making.</em></>, copy: "A few details about the idea, footage and timing give us a useful place to begin.", image: "/images/service-2.png", alt: "Creator recording a short video" },
  editors: { no: "07", tag: "JOIN THE TEAM", title: <>Your craft belongs<br/><em>in the frame.</em></>, copy: "Share your experience, best work and availability to join our editor network.", image: "/images/editing-workstation.png", alt: "Professional editing workstation" },
  privacy: { no: "08", tag: "YOUR INFORMATION", title: <>A clear approach<br/><em>to your details.</em></>, copy: "How we use the information you choose to send us.", image: "/images/service-6.png", alt: "Studio workspace" },
};
function Brand() { return <Image className="v2-brand" src="/logos/editing-factory.png" width={220} height={220} alt="Editing Factory" priority />; }
function CtaLink({ href, children, outline = false }: { href: string; children: React.ReactNode; outline?: boolean }) { return <Link href={href} className={`v2-button ${outline ? "v2-button-outline" : ""}`}>{children}<ArrowDownRight size={19} /></Link>; }
function Kicker({ children }: { children: React.ReactNode }) { return <span className="v2-kicker"><i />{children}</span>; }
function Wave({ from, to }: { from: Tone; to: Tone }) { return <div className={`v2-wave v2-${from}`} aria-hidden="true"><svg viewBox="0 0 1440 92" preserveAspectRatio="none"><path className={`v2-fill-${to}`} d="M0,42 C187,100 352,-6 545,48 C738,102 890,-8 1080,48 C1238,92 1334,66 1440,26 L1440,92 L0,92 Z" /></svg></div>; }
function Heading({ label, title, copy }: { label: string; title: React.ReactNode; copy?: string }) { return <motion.div {...reveal} className="v2-heading"><div><Kicker>{label}</Kicker><h2>{title}</h2></div>{copy && <p>{copy}</p>}</motion.div>; }
function Header({ page, show }: { page: Page; show: boolean }) { const [open, setOpen] = useState(false); useEffect(() => setOpen(false), [page]); return <header className={`v2-header ${show ? "v2-header-show" : ""}`}><nav className="v2-nav" aria-label="Primary navigation"><div className="v2-nav-left">{nav.slice(0, 4).map(a => <Link className={page === a.p ? "active" : ""} href={a.u} key={a.u}>{a.n}</Link>)}</div><Link href="/" className="v2-nav-logo" aria-label="Editing Factory home"><Brand /></Link><div className="v2-nav-right">{nav.slice(4).map(a => <Link className={page === a.p ? "active" : ""} href={a.u} key={a.u}>{a.n}</Link>)}</div><button className="v2-menu-button" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></nav>{open && <div className="v2-mobile-nav">{nav.map(a => <Link key={a.u} href={a.u} onClick={() => setOpen(false)}>{a.n}<ArrowRight size={16} /></Link>)}</div>}</header>; }
function HomeHero() { const ref = useRef<HTMLElement>(null); const reduced = useReducedMotion(); const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] }); const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 100]); const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -55]); return <section ref={ref} className="v2-hero"><motion.div className="v2-hero-photo" style={{ y: imageY }}><Image src="/images/studio-hero.png" alt="Editor shaping a film at a studio workstation with a cinema camera nearby" fill priority sizes="100vw" /></motion.div><div className="v2-hero-shade" /><motion.div className="v2-hero-copy" style={{ y: copyY }}><motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .7 }}><Kicker>POST-PRODUCTION, WITH PERSPECTIVE</Kicker></motion.div><h1><span className="v2-mask"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: .15, duration: 1, ease: easing }}>YOU SHOOT.</motion.span></span><span className="v2-mask"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: .3, duration: 1, ease: easing }}>WE EDIT.</motion.span></span></h1><motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45, duration: .8 }}>From the first cut to the final frame, we turn your footage into video with clarity, feeling and purpose.</motion.p><motion.div className="v2-hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}><CtaLink href="/packages/">Explore Packages</CtaLink><CtaLink href="/contact/" outline>Start a Project</CtaLink></motion.div></motion.div><div className="v2-hero-meta"><span>EDITING FACTORY / FRAME BY FRAME</span><span>SCROLL TO EXPLORE <ArrowDown size={14} /></span></div><span className="v2-rec"><b /> REC &nbsp; 00:00:01:00</span></section>; }
function WordTicker() { const text = "YOU SHOOT. ✦ WE EDIT. ✦ CREATE. CUT. DELIVER. ✦ FRAME BY FRAME. ✦ "; return <div className="v2-word-ticker" aria-label={text}><div>{Array.from({ length: 4 }).map((_, i) => <span key={i}>{text}</span>)}</div></div>; }
function ToolStrip() { return <div className="v2-tools" aria-label="Creative software used by Editing Factory"><div className="v2-tools-title">THE TOOLS BEHIND THE TIMELINE <span>↘</span></div><div className="v2-tools-track">{Array.from({ length: 4 }).flatMap((_, k) => tools.map(t => <div className="v2-tool" key={`${k}-${t.name}`}><Image src={`/logos/${t.file}`} alt={k === 0 ? t.name : ""} width={64} height={64} /></div>))}</div><small>Product icons © Adobe, Apple and Blackmagic Design.</small></div>; }
function HomePackages() {
  return <section className="v2-section v2-lavender v2-home-packages">
    <div className="v2-container">
      <Heading label="01 / WAYS TO WORK" title={<>Six ways to make<br/><em>the next frame count.</em></>} copy="One video to test the process, eight edits for a campaign, an on-site team or a complete production. Start with the scope that fits your story." />
      <div className="v2-home-package-grid">
        {packages.map((p, i) => <motion.article {...reveal} className={`v2-home-package ${p.featured ? "featured" : ""}`} key={p.name}>
          <div className="v2-home-package-image"><Image src={`/images/service-${i + 1}.png`} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw"/><span>0{i + 1} / 06</span>{p.featured && <b>RECOMMENDED</b>}</div>
          <div className="v2-home-package-body"><span>{p.eyebrow}</span><h3>{p.name}</h3><p>{p.intro}</p><div><strong>{p.price}</strong><small>{p.unit}</small></div><Link href="/packages/">Explore package <ArrowDownRight size={18}/></Link></div>
        </motion.article>)}
      </div>
      <div className="v2-section-foot"><p>Every package follows a clear brief, with extra formats and longer edits scoped before work begins.</p><Link href="/packages/">Compare all six packages <ArrowRight size={18}/></Link></div>
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
function ProcessBand() { const steps = [{ t: "Shoot", d: "Capture footage with the final story in mind.", icon: Camera }, { t: "Send", d: "Share files, a brief and useful references.", icon: Film }, { t: "We Edit", d: "We build the cut and refine the details with you.", icon: Scissors }, { t: "Deliver", d: "Receive the finished video in the agreed format.", icon: Play }]; return <section className="v2-section v2-ivory"><div className="v2-container"><Heading label="04 / THE PROCESS" title={<>Simple process.<br/><em>Beautiful results.</em></>} copy="A clear handoff makes room for better creative decisions, from the initial brief to the final export."/><div className="v2-process-band">{steps.map((s, i) => <motion.div {...reveal} key={s.t}><span>0{i + 1} / 04 <s.icon size={29} strokeWidth={1.3}/></span><h3>{s.t}</h3><p>{s.d}</p></motion.div>)}</div><div className="v2-section-foot"><p>Want to see the handoff in more detail?</p><Link href="/process/">View the process <ArrowRight size={18}/></Link></div></div></section>; }
function GoldInterlude() { return <section className="v2-gold-wrap v2-ivory"><div className="v2-container v2-gold-interlude"><span>THE EDITING FACTORY PROMISE / 05</span><h2>YOUR FOOTAGE.<br/><em>OUR OBSESSION.</em></h2><p>From a single first cut to a full production, we give every frame the attention it deserves.</p><Link href="/packages/">Find your package <ArrowDownRight size={19}/></Link><i aria-hidden="true"/></div></section>; }
function Cta({ tone = "ivory", title = "Let’s make the next frame matter." }: { tone?: Tone; title?: string }) { return <section className={`v2-cta-wrap v2-${tone}`}><div className="v2-container"><motion.div {...reveal} className="v2-cta"><div><Kicker>YOUR STORY STARTS HERE</Kicker><h2>{title}</h2><p>Bring us the idea, the footage or a blank page. We will help work out the right way forward.</p><CtaLink href="/contact/">Start a Conversation</CtaLink></div><div className="v2-cta-art" aria-hidden="true"><i/><i/><Clapperboard size={110} strokeWidth={.75}/></div></motion.div></div></section>; }
function Home() { return <><HomeHero/><Wave from="ivory" to="lavender"/><WordTicker/><HomePackages/><Wave from="lavender" to="ivory"/><ScrollStudio/><Wave from="ivory" to="lavender"/><Work/><Wave from="lavender" to="ivory"/><ProcessBand/><GoldInterlude/><Wave from="ivory" to="lavender"/><TestimonialPreview/><Wave from="lavender" to="ivory"/><Cta/></>; }
function InnerHero({ page }: { page: Exclude<Page, "home"> }) { const h = pageHero[page]; return <section className="v2-inner-hero"><div className="v2-inner-photo"><Image src={h.image} alt={h.alt} fill priority sizes="(max-width:800px) 100vw, 54vw"/></div><div className="v2-inner-shade"/><div className="v2-inner-content"><Kicker>{h.no} / {h.tag}</Kicker><h1>{h.title}</h1><p>{h.copy}</p><span>EDITING FACTORY &nbsp; ↘ &nbsp; {h.tag}</span></div><b aria-hidden="true">{h.no}</b></section>; }
function ServicesPage() {
  return <><InnerHero page="services"/><Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender"><div className="v2-container">
      <Heading label="THE SERVICE INDEX / 01–09" title={<>Your idea, made<br/><em>for the world.</em></>} copy="Nine creative directions, one connected team. Every service is scoped around the audience, deliverables and result you need."/>
      <div className="v2-directory">{services.map((s, i) => <motion.article {...reveal} key={s.title}>
        <div className="v2-directory-image"><Image src={`/images/services/${s.image}`} alt={`${s.title} creative production visual`} fill sizes="(max-width:800px) 100vw, 40vw"/><span>EF / {String(i + 1).padStart(2, "0")}</span></div>
        <div className="v2-directory-copy"><span>{String(i + 1).padStart(2, "0")} / 09</span><h3>{s.title}</h3><h4>{s.tag}</h4><p>{s.description}</p><ul>{s.list.map(x => <li key={x}><ArrowRight size={14}/>{x}</li>)}</ul><Link href="/contact/">Discuss this service <ArrowDownRight size={18}/></Link></div>
      </motion.article>)}</div>
    </div></section><Wave from="lavender" to="ivory"/>
    <section className="v2-section v2-ivory"><div className="v2-container"><Heading label="ONE CONNECTED BRIEF" title={<>Across every format,<br/><em>one clear direction.</em></>} copy="Production, design and promotion work best when the aim is clear. Tell us what you are making, where it will live and who it needs to reach."/><div className="v2-format-grid"><div><span>01 / CREATE</span><h3>Make the material.</h3><p>Film, photograph, design or develop the visual concept with a team matched to the brief.</p></div><div><span>02 / SHAPE & SHARE</span><h3>Give it a destination.</h3><p>Turn raw material into a finished story, then plan how it reaches the right audience.</p></div></div></div></section>
    <Wave from="ivory" to="lavender"/><Cta tone="lavender" title="Bring us the brief. We’ll find the right team."/></>;
}
function PackagesPage() {
  return <>
    <InnerHero page="packages"/>
    <Wave from="ivory" to="lavender"/>
    <section className="v2-section v2-lavender">
      <div className="v2-container">
        <Heading label="THE COMPLETE PACKAGE INDEX / 01–06" title={<>Six ways to make<br/><em>the work happen.</em></>} copy="Every Editing Factory package is here, from a single paid edit to an on-site team or a film produced from the first idea."/>
        <div className="v2-price-grid">
          {packages.map((p, i) => <motion.article {...reveal} className={p.featured ? "featured" : ""} key={p.name}>
            <div className="v2-price-top"><span>0{i + 1} / {p.eyebrow}</span>{p.featured && <b>RECOMMENDED</b>}</div>
            <h3>{p.name}</h3><p>{p.intro}</p>
            <div className="v2-price"><strong>{p.price}</strong><span>{p.unit}</span></div>
            <Link href="/contact/">Discuss this package <ArrowDownRight size={18}/></Link>
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
function PortfolioPage() { return <><InnerHero page="portfolio"/><Wave from="ivory" to="lavender"/><Work full/><Wave from="lavender" to="ivory"/><section className="v2-section v2-ivory"><div className="v2-container v2-portfolio-note"><Kicker>A NOTE ON THE WORK</Kicker><h2>Only real work belongs here.</h2><p>These spaces show the intended presentation for future client videos. They are not sample projects or examples of delivered Editing Factory work. Approved films can replace each preview without changing the layout.</p><Link href="/contact/">Have a project to discuss? <ArrowRight size={18}/></Link></div></section><Wave from="ivory" to="lavender"/><Cta tone="lavender" title="A new story is waiting for its first frame."/></>; }
function AboutPage() { return <><InnerHero page="about"/><Wave from="ivory" to="lavender"/><section className="v2-section v2-lavender"><div className="v2-container v2-about-story"><div><Kicker>WHAT WE BELIEVE</Kicker><h2>The story comes first.<br/><em>Everything else follows.</em></h2></div><div><p>Editing is where raw material becomes a point of view. A strong cut does more than arrange clips. It reveals what matters, lets a moment land and gives the audience a reason to keep watching.</p><p>Editing Factory works across creator content, brand films, events and business communication. A short video needs focus; an event needs feeling; a longer film needs structure.</p><p>We begin by understanding the brief, then shape the footage with rhythm, sound, colour and graphics that support the message.</p></div></div></section><Wave from="lavender" to="ivory"/><section className="v2-section v2-ivory"><div className="v2-container"><Heading label="OUR EDITORIAL PRINCIPLES" title={<>Made with intention,<br/><em>not decoration.</em></>} copy="A small set of principles guides every edit, whatever the length or format."/><div className="v2-principles"><div><span>01</span><h3>Find the point</h3><p>What should someone understand or feel when the video ends? That answer guides the cut.</p></div><div><span>02</span><h3>Protect the moment</h3><p>Not every second needs an effect. Images, words and sound need room to work.</p></div><div><span>03</span><h3>Finish with care</h3><p>Captions, audio, colour, graphics and exports all shape the final experience.</p></div></div></div></section><Wave from="ivory" to="lavender"/><section className="v2-section v2-lavender"><div className="v2-container v2-about-visual"><div><Kicker>THE WORKING RELATIONSHIP</Kicker><h2>Built around<br/><em>your footage.</em></h2><p>Bring a clear brief or just the beginning of an idea. We can help define the format, choose an editing approach and agree on deliverables before work begins.</p><CtaLink href="/process/">How the process works</CtaLink></div><div><Image src="/images/studio-hero.png" alt="Video editor at work in a studio" fill sizes="(max-width:800px) 100vw, 50vw"/></div></div></section><Wave from="lavender" to="ivory"/><Cta title="Good footage deserves a good conversation."/></>; }
function ProcessPage() {
  const steps = [
    ["Brief submission", "Tell us the goal", "Share the audience, format, approximate duration, references, deadline and any brand or production requirements."],
    ["Footage transfer", "Get the material across", "Send organised footage and assets through an accessible shared folder. For a new shoot, we plan capture before transfer."],
    ["Quotation", "Agree on the scope", "We confirm deliverables, price, revisions and any work outside a published package."],
    ["Scheduling", "Put dates around the work", "The timeline covers kickoff, review windows, feedback and final export, with one clear approval contact."],
    ["First cut", "See the story take shape", "We assemble the strongest material and establish the structure, pace, sound and on-screen language."],
    ["Feedback", "Refine with purpose", "Send one consolidated list per revision round, within the approved brief, so changes stay clear and actionable."],
    ["Final delivery", "Ready for its screen", "We export the agreed format and make the final file available. Please download and back it up within 10 days."],
  ];
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
      <div className="v2-process-details">{steps.map((s, i) => <motion.div {...reveal} key={s[0]}><b>{String(i + 1).padStart(2, "0")}</b><div><span>{s[1]}</span><h3>{s[0]}</h3><p>{s[2]}</p></div><ArrowDownRight/></motion.div>)}</div>
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
      <a className="v2-contact-whatsapp" href="https://wa.me/919505555277" target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/> Chat on WhatsApp <ArrowDownRight size={18}/></a>
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
function PrivacyPage() {
  return <><InnerHero page="privacy"/><Wave from="ivory" to="lavender"/><section className="v2-section v2-lavender"><div className="v2-container v2-privacy"><Kicker>PRIVACY POLICY</Kicker><h2>Your details stay<br/><em>with your conversation.</em></h2><p>The website’s enquiry and editor forms prepare a WhatsApp message on your device. We receive the information only if you choose to send that message in WhatsApp. The forms do not upload answers to this website.</p><p>We use enquiry details to discuss your brief, quotation, availability and delivery. We use editor application details to review skills, work samples and potential assignments. We do not publish portfolios or application details without permission.</p><p>WhatsApp handles messages according to its own privacy terms. Please avoid sending confidential identity documents, banking details or private client footage in the first message. We can agree a suitable private handover when needed.</p><p>To ask about information you have sent, contact us at <a href="https://wa.me/919505555277">+91 95055 55277 on WhatsApp</a>.</p></div></section></>;
}
function FloatingActions() { return <div className="v2-floating-actions" aria-label="Quick actions"><Link href="/editors/">Become an Editor <ArrowDownRight size={16}/></Link><Link href="/contact/">Book Inquiry <ArrowDownRight size={16}/></Link></div>; }
function Footer() { return <><ToolStrip/><footer className="v2-footer"><div className="v2-container v2-footer-main"><div><Link href="/" aria-label="Editing Factory home"><Brand/></Link><p>You shoot. We edit.<br/>The rest is in the details.</p></div><div><span>EXPLORE</span>{nav.map(a => <Link key={a.u} href={a.u}>{a.n}</Link>)}<Link href="/editors/">Become an Editor</Link><Link href="/privacy/">Privacy</Link></div><div><span>START HERE</span><h3>Have something<br/>worth making?</h3><Link className="v2-footer-cta" href="/contact/">Start a conversation <ArrowDownRight size={18}/></Link><a className="v2-footer-whatsapp" href="https://wa.me/919505555277" target="_blank" rel="noopener noreferrer">WhatsApp: +91 95055 55277</a></div></div><div className="v2-container v2-footer-bottom"><span>© {new Date().getFullYear()} Editing Factory</span><span>YOU SHOOT. WE EDIT.</span><a href="#top">BACK TO THE FIRST FRAME ↑</a></div></footer></>; }
export function SitePageV2({ page }: { page: Page }) { return <div id="top"><Header page={page} show/><main>{page === "home" ? <Home/> : page === "services" ? <ServicesPage/> : page === "packages" ? <PackagesPage/> : page === "portfolio" ? <PortfolioPage/> : page === "about" ? <AboutPage/> : page === "process" ? <ProcessPage/> : page === "editors" ? <EditorsPage/> : page === "privacy" ? <PrivacyPage/> : <ContactPage/>}</main><Footer/><FloatingActions/></div>; }
