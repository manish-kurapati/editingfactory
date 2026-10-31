import { notFound } from "next/navigation";
import { SitePage } from "@/components/site-page";
const pages = ["services", "packages", "portfolio", "about", "process", "contact"] as const;
export function generateStaticParams() { return pages.map(slug => ({ slug })); }
export default async function Page({ params }: { params: Promise<{slug:string}> }) { const {slug}=await params; if (!pages.includes(slug as typeof pages[number])) notFound(); return <SitePage page={slug} />; }
