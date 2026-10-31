import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Editing Factory — You Shoot. We Edit.", description: "Professional video editing for creators, brands, events, and businesses." };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
