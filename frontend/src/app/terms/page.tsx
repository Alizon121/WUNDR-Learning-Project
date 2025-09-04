import type { Metadata } from "next";
import Terms from "@/components/footer/Terms";

export const metadata: Metadata = {
  title: "Terms of Service — WonderHood",
  description: "Rules for using WonderHood’s website, programs, and events.",
};

export default function TermsPage() {
  return <Terms />;
}
