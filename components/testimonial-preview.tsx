"use client";

import { Star } from "lucide-react";

const first = [
  { label: "For creators", text: "An edit that keeps the original voice while giving every second a reason to be there." },
  { label: "For brands", text: "A clear story, consistent visual language and a finish built for the people watching." },
  { label: "For events", text: "The atmosphere, the people and the moments that make the day worth remembering." },
];
const second = [
  { label: "For production teams", text: "A reliable creative partner from organised footage handover through the final export." },
  { label: "For new ideas", text: "Thoughtful planning and production when the project starts with a blank page." },
];
function Row({ cards, reverse = false }: { cards: typeof first; reverse?: boolean }) {
  return <div className={`v2-testimonial-row ${reverse ? "reverse" : ""}`}>
    <div className="v2-testimonial-track">{[0, 1].flatMap(copy => cards.map((card, index) => <article key={`${copy}-${index}`} aria-hidden={copy === 1}>
      <span className="v2-sample-tag">SAMPLE LAYOUT · REVIEW PLACEHOLDER</span>
      <div className="v2-testimonial-stars" aria-label="Five-star visual placeholder">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor"/>)}</div>
      <p>{card.text}</p><small>{card.label}</small>
    </article>))}</div>
  </div>;
}
export function TestimonialPreview() {
  return <section className="v2-testimonial-section v2-lavender" aria-label="Testimonial layout preview">
    <div className="v2-container"><span className="v2-testimonial-kicker">WORDS WE HOPE TO EARN / A PREVIEW</span><h2>Good work gets<br/><em>people talking.</em></h2><p>This is a preview of the testimonial wall. Verified client quotes can take these places as projects are completed.</p></div>
    <Row cards={first}/><Row cards={second} reverse/>
  </section>;
}
