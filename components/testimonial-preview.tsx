"use client";

import { Star } from "lucide-react";

const first = [
  { name: "Aarav Mehta", text: "The team understood the pace we wanted from the first brief. Feedback was handled quickly, and the final videos felt clean, sharp and true to our brand." },
  { name: "Nisha Kapoor", text: "Our raw footage came from different shoot days, but the finished series felt completely consistent. Communication stayed clear throughout every revision." },
  { name: "Rohan Shah", text: "They found the important moments without losing the energy of the event. The highlight film felt natural, polished and ready to share." },
];
const second = [
  { name: "Priya Nair", text: "The handover was simple, deadlines were clear and every export arrived in the formats we needed. It felt like working with an extension of our own team." },
  { name: "Kabir Sethi", text: "We started with a rough idea. Editing Factory helped shape the story, plan the shoot and carry the same direction all the way into the final cut." },
];
function Row({ cards, reverse = false }: { cards: typeof first; reverse?: boolean }) {
  return <div className={`v2-testimonial-row ${reverse ? "reverse" : ""}`}>
    <div className="v2-testimonial-track">{[0, 1].flatMap(copy => cards.map((card, index) => <article key={`${copy}-${index}`} aria-hidden={copy === 1}>
      <div className="v2-testimonial-stars" aria-hidden="true">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor"/>)}</div>
      <p>{card.text}</p><small>{card.name}</small>
    </article>))}</div>
  </div>;
}
export function TestimonialPreview() {
  return <section className="v2-testimonial-section v2-lavender" aria-label="Client reviews">
    <div className="v2-container"><span className="v2-testimonial-kicker">CLIENT REVIEWS</span><h2>Good work gets<br/><em>people talking.</em></h2></div>
    <Row cards={first}/><Row cards={second} reverse/>
  </section>;
}
