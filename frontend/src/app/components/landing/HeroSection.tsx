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
        {/* Светлая полупрозрачная подложка */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none z-10" />

      {/* CTA кнопка */}
      <div className="absolute inset-0 flex items-end justify-center mb-36 z-10">
        <Link href="/get-involved">
          <button className="bg-wondergreen text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:bg-wonderleaf transition-colors duration-300 hover:scale-105 transform">
            Get Involved
          </button>
        </Link>
      </div>
    </section>
  );
}