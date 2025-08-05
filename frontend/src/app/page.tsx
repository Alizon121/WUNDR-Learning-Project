"use client";

import HeroSection from "@/components/landing/HeroSection";
import Story_Mission from "@/components/landing/Story_Mission";
import ImpactStats from "@/components/landing/ImpactNumbers";
import OurPrograms from "@/components/landing/OurPrograms"

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <ImpactStats />
      <Story_Mission />
      <OurPrograms />
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-wonderleaf/30 mt-12 max-w-7xl mx-auto flex items-start gap-8 mt-2">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-wondergreen to-wonderleaf rounded-full flex items-center justify-center">
          <span className="text-white text-3xl">🌟</span>
        </div>
        <div>
          <h3 className="font-bold text-wondergreen text-2xl mb-2">
            Volunteer Hours for Teens & College Students
          </h3>
          <p className="text-gray-700 text-lg">
            WonderHood offers volunteer opportunities for high school and college students to earn service hours, develop leadership skills, and make a difference in the community. <br />
            <span className="block mt-2">
              Interested in volunteering or starting a new club?&nbsp;
              <a
                href="mailto:wonderhood.project@gmail.com"
                className="text-wonderleaf underline hover:text-wondergreen font-medium"
              >
                Email us!
              </a>
            </span>
          </p>
        </div>
      </div>

    </main>
  )
}
