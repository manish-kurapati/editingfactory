import type { Metadata } from "next";
import { CampaignLanding } from "@/components/campaign-landing";

export const metadata: Metadata = {
  title: "Video Editing & Production | Editing Factory",
  description: "Professional video editing and production for creators, brands, agencies and businesses.",
};

export default function RegionalLandingPage() {
  return <CampaignLanding campaign="Regional"/>;
}
