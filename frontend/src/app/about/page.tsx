'use client'

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
      <section className="max-w-5xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-wondergreen mb-6 leading-tight">
            WonderHood
            <span className="block text-3xl md:text-4xl font-medium text-wonderleaf mt-2">
              More Than Just Homeschooling
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Creating joyful connections and real-life adventures for homeschool families in Colorado.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-wonderleaf/20 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-12 bg-gradient-to-b from-wonderleaf to-wondergreen rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-wondergreen">Our Story</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            WonderHood began with a small group of Colorado families who wanted more than just lessons at home — we wanted real friendships, hands-on adventures, and a supportive community for our kids! We organize hiking trips, STEM workshops, book and art clubs, and creative community projects for homeschoolers of all backgrounds.
          </p>
        </div>

        {/* Why We Do It Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-wondergreen mb-4">
              Why We Do It?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-wonderleaf to-wonderorange mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-wonderleaf/10 to-wondergreen/5 rounded-xl p-6 border-l-4 border-wonderleaf">
                <p className="text-gray-700 leading-relaxed">
                  At Wonderhood, we believe every child deserves the chance to discover their unique talents, develop life skills, and connect with others in a supportive, inspiring environment.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-wonderorange/10 to-wondersun/5 rounded-xl p-6 border-l-4 border-wonderorange">
                <p className="text-gray-700 leading-relaxed">
                  Our programs help kids not just learn, but grow as individuals—exploring arts, sciences, teamwork, leadership, and cultural experiences that go far beyond what's possible in traditional homeschooling.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-wondergreen/10 to-wonderleaf/5 rounded-xl p-6 border-l-4 border-wondergreen">
                <p className="text-gray-700 leading-relaxed">
                  We want every child to have access to friendships, group activities, mentorship, and opportunities to shine—no matter where or how they learn.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-wondersun/20 to-wonderorange/10 rounded-xl p-6 border-l-4 border-wondersun">
                <p className="text-gray-700 leading-relaxed">
                  Over time, we plan to open workshops and summer camps, and to offer support not just for children, but for their families too.
                </p>
              </div>
            </div>
          </div>

          {/* For Teens/College Volunteers */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-wondergreen/20 mt-10 group">
            <div className="w-12 h-12 bg-gradient-to-br from-wondergreen to-wonderleaf rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">🌟</span>
            </div>
            <h3 className="font-bold text-wondergreen text-xl mb-2">Volunteer Hours for Teens & College Students</h3>
            <p className="text-gray-700 mb-3">
              WonderHood offers volunteer opportunities for high school and college students to earn service hours, develop leadership skills, and make a difference in the community. Interested in volunteering or starting a new club? Apply or email us at{" "}
              <a
                href="mailto:wonderhood.project@gmail.com"
                className="text-wonderleaf underline hover:text-wondergreen"
              >
                wonderhood.project@gmail.com
              </a>
              .
            </p>
          </div>

          {/* Bottom Mission Statement */}
          <div className="mt-8 bg-gradient-to-r from-wondergreen to-wonderleaf rounded-2xl p-8 text-white text-center">
            <p className="text-lg md:text-xl leading-relaxed">
              By connecting families, building community, and creating real opportunities, WonderHood aims to fill the gaps in home education—and add even more to children's lives.
            </p>
          </div>
        </div>

        {/* How to Join Section */}
        <div className="bg-gradient-to-br from-wondersun/30 via-wonderbg to-white rounded-2xl p-8 md:p-12 shadow-lg border-2 border-wonderorange/30 mb-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-28 h-28 bg-wonderorange/40 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-wonderleaf/40 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-wonderorange to-wondersun rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">!</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-wondergreen">How to Join</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                Membership is <span className="font-bold text-wondergreen bg-wondersun/30 px-2 py-1 rounded">free</span> for all homeschool families with kids ages <span className="font-bold text-wonderorange">10–18</span>.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-2">
                Just sign up form for your child and join any club, or contact us with questions — you're always welcome!
              </p>
            </div>
            
            <div className="text-center">
              <a
                href="mailto:wonderhood.project@gmail.com"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-wonderleaf to-wondergreen text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span>✉</span>
                wonderhood.project@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Get Involved Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-wondergreen mb-4">
              Get Involved
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-wonderorange to-wonderleaf mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Volunteer Card */}
           <Link href="/volunteer" className="group block">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-wonderleaf/20 hover:border-wonderleaf transition-colors duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-wonderleaf to-wondergreen rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl">🙋‍♀️</span>
                </div>
                <h3 className="font-bold text-wondergreen text-xl mb-2">Volunteer</h3>
                <p className="text-gray-700">Help organize events or lead a club.</p>
              </div>
            </Link>

            {/* Partnership Card */}
            <Link href="/partnership" className="group block">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-wonderorange/40 hover:border-wonderorange transition-colors duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 via-wonderorange to-wondersun rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl drop-shadow">🤝</span>
                </div>
                <h3 className="font-bold text-wondergreen text-xl mb-2">Partnership</h3>
                <p className="text-gray-700">Community orgs, let&apos;s create together!</p>
              </div>
            </Link>

            {/* Donate Card */}
            <Link href="/support" className="group block">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-wondergreen/20 hover:border-wondergreen transition-colors duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-wondergreen to-wonderleaf rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl">💚</span>
                </div>
                <h3 className="font-bold text-wondergreen text-xl mb-2">Donate</h3>
                <p className="text-gray-700 mb-3">
                  Your support makes our programs possible and is tax-deductible.
                </p>
                <span className="text-wonderorange font-semibold hover:text-wondergreen transition-colors duration-300 underline">
                  Support WonderHood →
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-wonderleaf/20">
          <p className="text-lg text-gray-600 mb-4">
            Questions? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:wonderhood.project@gmail.com" 
              className="text-wonderleaf hover:text-wondergreen font-semibold transition-colors duration-300"
            >
              wonderhood.project@gmail.com
            </a>
            <span className="hidden sm:block text-gray-400">|</span>
            <span className="text-gray-600">Follow us on social media!</span>
          </div>
        </div>
      </section>
    </div>
  );
}
