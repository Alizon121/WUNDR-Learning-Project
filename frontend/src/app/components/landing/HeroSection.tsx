import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <Image
        src="/hero.png"
        alt="Kids outdoors"
        width={1200}
        height={600}
        className="w-full h-full object-cover object-bottom"
        priority
      />
        {/* Light translucent base */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none z-10" />

      {/* Text */}
      <div className="absolute z-10 text-center text-white px-4 top-[35%]">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 -mt-4"
        style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)' }}> More than Just Homeschooling</h1>
        <p className="text-xl md:text-2xl mt-4"
        style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Clubs, projects, nature, creativity — together.</p>
      </div>

      {/* Get Involved btn */}
      <div className="absolute inset-0 flex items-center justify-center top-[35%] z-10">
        <Link href="/get-involved">
          <button className="bg-wondergreen text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:bg-wonderleaf transition-colors duration-300 hover:scale-105 transform">
            Get Involved
          </button>
        </Link>
      </div>
    </section>
  );
}