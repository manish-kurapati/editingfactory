import type { Metadata } from "next";
import { SitePageV2 } from "@/components/site-page-v2";

export const metadata: Metadata = {
  title: "Become an Editing Partner | Editing Factory",
  description: "Apply to join the Editing Factory editing partner network for freelance, full-time or on-site work.",
};

export default function EditingPartnerPage() { return <SitePageV2 page="editors"/>; }
