import type { Metadata } from "next";
import "./globals.css";
import "./editorial.css";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SiteIntro } from "@/components/site-intro";
export const metadata: Metadata = { title: "Editing Factory — You Shoot. We Edit.", description: "Professional video editing for creators, brands, events, and businesses." };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body><SiteIntro/>{children}<WhatsAppFloat/></body></html>; }
