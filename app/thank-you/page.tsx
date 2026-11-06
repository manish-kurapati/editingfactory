import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { whatsappDisplay, whatsappUrl } from "@/data/contact";

export const metadata: Metadata = { title: "Thank you | Editing Factory", robots: { index: false } };

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const editor = type === "editor";
  return <main className="thanks-page">
    <div className="thanks-card">
      <Link href="/" aria-label="Editing Factory home"><Image src="/logos/editing-factory.png" width={96} height={96} alt="Editing Factory"/></Link>
      <span className="thanks-check" aria-hidden="true">✓</span>
      <h1>Thank you for filling out the form.</h1>
      <p>{editor ? "We have received your application. Our team will review your work and get back to you shortly." : "We have received your enquiry. Our team will get back to you shortly."}</p>
      <p className="thanks-sub">We’ve also sent you a message on WhatsApp.</p>
      <div className="thanks-actions">
        <Link className="v2-button" href="/">Back to home</Link>
        <a className="v2-button v2-button-outline" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/> {whatsappDisplay}</a>
      </div>
    </div>
  </main>;
}
