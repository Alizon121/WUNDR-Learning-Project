"use client";

import HeroSection from "./components/landing/HeroSection";
import Story_Mission from "./components/landing/Story_Mission";
import ImpactStats from "./components/landing/ImpactNumbers";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <ImpactStats />
      <Story_Mission />
    </main>
  )
}
