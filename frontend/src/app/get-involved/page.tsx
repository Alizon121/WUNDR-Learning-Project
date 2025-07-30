'use client'

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function GetInvolved() {
  return (
    <div>
      {/* HEADER */}
      <section className="relative bg-wondergreen bg-gradient-to-br from-wondergreen to-wonderleaf py-16 px-2 text-center text-white shadow-lg overflow-hidden">

        {/* Animated circles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <span className="absolute top-8 left-1/4 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute top-10 left-1/2 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute top-12 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute bottom-1/3 left-60 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute top-1/3 right-12 w-4 h-4 rounded-full bg-white/15 animate-pulse-slow" />
          <span className="absolute bottom-8 left-1/3 w-3 h-3 rounded-full bg-white/10 animate-float" />
          <span className="absolute bottom-8 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute bottom-10 right-1/3 w-5 h-5 rounded-full bg-white/10 animate-float-slow" />
          <span className="absolute top-1/4 right-60 w-3 h-3 rounded-full bg-white/10 animate-float-slow" />
          <span className="absolute bottom-20 right-80 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute bottom-16 right-40 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
        </div>
        {/* Header Content */}
        <div className="relative z-10 font-segoe">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Get Involved with WonderHood
          </h1>
          <p className="text-1xl md:text-2xl font-medium max-w-2xl mx-auto mb-0">
            Join our community and help create meaningful learning <br />
            experiences for homeschooling families
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="bg-wonderbg min-h-screen pb-16">
        {/* Intro Text */}
        <section className="py-12">
          <p className="text-xl md:text-2xl text-center max-w-7xl mx-auto text-gray-700 mb-12">
            There are many ways to support and participate in our mission to empower families through connection, creativity, and community-based learning. Choose the path that resonates with you!
          </p>

          {/* CARDS GRID */}
          <section className="w-full max-w-7.2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
            {/* Family Enrollment Card */}
            {/* <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden">
              <div className="absolute left-0 top-0 h-2 w-full bg-wondergreen rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>
              <div className="flex items-center gap-6 mb-6">
                <span className="block w-20 h-20 rounded-full bg-wondergreen flex items-center justify-center text-4xl text-white shrink-0">
                    👨‍👩‍👧‍👦
                </span>
                <h2 className="text-3xl font-bold text-wondergreen">
                    WonderHood Kids Enrollment
                </h2>
                </div>
              <p className="text-lg text-gray-700 mb-5">
                Join a vibrant community where kids connect, learn, and create together through clubs, adventures, and hands-on projects.
              </p>
              <ul className="mb-6 space-y-1 text-lg">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Access to fun clubs & group activities</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Outdoor adventures & nature programs</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Creative workshops and projects</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Community events and exciting field trips</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Parent support and connection</li>
              </ul>
              <button className="w-full py-3 rounded-full text-xl font-bold text-white bg-gradient-to-r from-wondergreen to-wonderleaf shadow hover:from-wonderleaf hover:to-wondergreen transition-colors">
                Enroll Your Family
              </button>
            </div> */}
            {/* Volunteer */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden">
              <div className="absolute left-0 top-0 h-2 w-full bg-wondergreen rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>
              <div className="flex items-center gap-6 mb-6">
                <span className="block w-20 h-20 rounded-full bg-wondergreen flex items-center justify-center text-4xl text-white shrink-0">
                    🙋‍♀️
                </span>
                <h2 className="text-3xl font-bold text-wondergreen">
                    Volunteer
                </h2>
                </div>
              <p className="text-lg text-gray-700 mb-5">
                Share your skills and passions by leading clubs, assisting with events, or mentoring families.
              </p>
              <ul className="mb-6 space-y-1 text-lg">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Lead specialized clubs or workshops</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Assist at community events</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Mentor new homeschooling families</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Help with outdoor activities</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Support administrative tasks</li>
              </ul>
              <button className="w-full py-3 rounded-full text-xl font-bold text-white bg-gradient-to-r from-wondergreen to-wonderleaf shadow hover:from-wonderleaf hover:to-wondergreen transition-colors">
                Become a Volunteer
              </button>
            </div>
            {/* Partnership */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden">
              <div className="absolute left-0 top-0 h-2 w-full bg-wondergreen rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>
              <div className="flex items-center gap-6 mb-6">
                <span className="block w-20 h-20 rounded-full bg-wondergreen flex items-center justify-center text-4xl text-white shrink-0">
                    🤝
                </span>
                <h2 className="text-3xl font-bold text-wondergreen">
                    Partnership
                </h2>
                </div>

              <p className="text-lg text-gray-700 mb-5">
                Partner with us as an organization to provide resources, venues, or educational opportunities.
              </p>
              <ul className="mb-6 space-y-1 text-lg">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Educational program collaboration</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Venue partnerships for events</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Resource and material sharing</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Expert guest speaking</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Community outreach programs</li>
              </ul>
              <button className="w-full py-3 rounded-full text-xl font-bold text-white bg-gradient-to-r from-wondergreen to-wonderleaf shadow hover:from-wonderleaf hover:to-wondergreen transition-colors">
                Explore Partnership
              </button>
            </div>
            {/* Make a Donation */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden">
              <div className="absolute left-0 top-0 h-2 w-full bg-wondergreen rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>
              <div className="flex items-center gap-6 mb-6">
                <span className="block w-20 h-20 rounded-full bg-wondergreen flex items-center justify-center text-4xl text-white shrink-0">
                    💝
                </span>
                <h2 className="text-3xl font-bold text-wondergreen">
                    Make a Donation
                </h2>
                </div>

              <p className="text-lg text-gray-700 mb-5">
                Support our mission with a financial contribution to help us reach more families and expand our programs.
              </p>
              <ul className="mb-6 space-y-1 text-lg">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Support program development</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Provide scholarships for families</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Fund equipment and materials</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Enable new club creation</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Support community events</li>
              </ul>
              <button className="w-full py-3 rounded-full text-xl font-bold text-white bg-gradient-to-r from-wondergreen to-wonderleaf shadow hover:from-wonderleaf hover:to-wondergreen transition-colors">
                Enroll Your Family
              </button>
            </div>
          </section>
        </section>

        {/* Become a Sponsor */}
        <div className="relative z-10 font-segoe text-center mt-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 ">
            Become a Sponsor
          </h1>
          <p className='text-center text-gray-700 text-xl md:text-2xl mb-10'>Partner with us to make a lasting impact on homeschooling families in our community</p>
        </div>

        <section className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {/* Program Sponsor */}
            <div className="group relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-4 flex items-center">
                <span className="block w-14 h-14 rounded-full bg-wonderleaf/30 flex items-center justify-center text-3xl mr-3">
                    🎓
                </span>
                <div>
                    <div className="text-lg font-semibold text-wondergreen leading-tight mt-4">Program Sponsor</div>
                    <div className="text-2xl font-bold text-wondergreen ml-7">$500+</div>
                </div>
                </div>
                <ul className="mb-4 space-y-2 text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Sponsor clubs or workshops</li>
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Logo on program materials</li>
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Recognition at events</li>
                </ul>
                <div className="italic text-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Your gift helps run our core programs!</div>
            </div>

            {/* Event Sponsor */}
            <div className="group relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-4 flex items-center">
                <span className="block w-14 h-14 rounded-full bg-wonderleaf/30 flex items-center justify-center text-3xl mr-3">
                    🎉
                </span>
                <div>
                    <div className="text-lg font-semibold text-wondergreen leading-tight mt-4">Event Sponsor</div>
                    <div className="text-2xl font-bold text-wondergreen ml-4">$1000+</div>
                </div>
                </div>
                <ul className="mb-4 space-y-2 text-gray-700 leading-relaxed">
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Sponsor community events</li>
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Brand visibility at events</li>
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Social media recognition</li>
                </ul>
                <div className="italic text-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Get featured at our biggest events!</div>
            </div>

            {/* Adventure Sponsor */}
           <div className="group relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-4 flex items-center">
                <span className="block w-14 h-14 rounded-full bg-wonderleaf/30 flex items-center justify-center text-3xl mr-3">
                    🏕️
                </span>
                <div>
                    <div className="text-lg font-semibold text-wondergreen leading-tight mt-4">Adventure Sponsor</div>
                    <div className="text-2xl font-bold text-wondergreen ml-7">$1500+</div>
                </div>
                </div>
                <ul className="mb-4 space-y-2 text-gray-700 leading-relaxed">
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Sponsor community events</li>
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Brand visibility at events</li>
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Social media recognition</li>
                </ul>
                <div className="italic text-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Get featured at our biggest events!</div>
            </div>

            {/* Creative Sponsor */}
            <div className="group relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-4 flex items-center">
                <span className="block w-14 h-14 rounded-full bg-wonderleaf/30 flex items-center justify-center text-3xl mr-3">
                     🎨 
                </span>
                <div>
                    <div className="text-lg font-semibold text-wondergreen leading-tight mt-4">Creative Sponsor</div>
                    <div className="text-2xl font-bold text-wondergreen ml-7">$750+</div>
                </div>
                </div>
                <ul className="mb-4 space-y-2 text-gray-700 leading-relaxed">
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Sponsor community events</li>
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Brand visibility at events</li>
                <li className="flex items-center gap-2"><span className="text-wondergreen text-xl">✔</span> Social media recognition</li>
                </ul>
                <div className="italic text-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Get featured at our biggest events!</div>
            </div>
        </section>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-10">
            <button className="px-10 py-3 rounded-full text-xl font-bold text-white bg-gradient-to-r from-wondergreen to-wonderleaf shadow hover:from-wonderleaf hover:to-wondergreen transition-colors">
                Become a Sponsor
            </button>
            <button className="px-10 py-3 rounded-full text-xl font-bold border-2 border-wondergreen text-wondergreen bg-white hover:bg-wonderleaf/10 flex items-center gap-2 transition-colors">
                <svg width="22" height="25" fill="none" stroke="currentColor" strokeWidth="2" className="inline"><path d="M12 17v-8m0 8l4-4m-4 4l-4-4M20 21a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16z"/></svg>
                Download Sponsor Package
            </button>
        </div>
        
      </main>
    </div>
  );
}
