import { notFound, redirect } from "next/navigation";
import { SitePageV2 } from "@/components/site-page-v2";
const pages = ["services", "packages", "portfolio", "about", "process", "contact", "editors", "privacy", "terms", "cancellation", "files"] as const;
export function generateStaticParams() { return pages.map(slug => ({ slug })); }
export default async function Page({ params }: { params: Promise<{slug:string}> }) { const {slug}=await params; if (slug === "editors") redirect("/editing-partner/"); if (!pages.includes(slug as typeof pages[number])) notFound(); return <SitePageV2 page={slug as typeof pages[number]} />; }
