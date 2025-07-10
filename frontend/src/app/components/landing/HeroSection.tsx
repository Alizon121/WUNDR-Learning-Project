import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function HeroSection() {

  return (
    <section className="relative h-[45vh] w-full overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        spaceBetween={0}
        slidesPerView={1}
        className="h-[45vh] swiper-custom-pagination"

      >
        {/* Slide 1 */}
       <SwiperSlide>
        {/* Slide 1 — уже был */}
        <div className="relative h-full w-full">
            <Image
            src="/hero.png"
            alt="Kids outdoors"
            fill
            className="object-cover object-[center_40%] h-full w-full"
            priority
            />
            <div className="absolute inset-0 bg-white/10 z-10 pointer-events-none" />
            <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 z-10 text-white text-center px-4 whitespace-nowrap">
            <h1 className="text-4xl md:text-6xl font-bold"
                style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)' }}>
                More than Just Homeschooling
            </h1>
            <p className="text-xl md:text-2xl mt-4"
                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                Clubs, projects, nature, creativity — together.
            </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center top-[50%] z-10">
            <Link href="/get-involved">
                <button className="bg-wondergreen text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:bg-wonderleaf transition-colors duration-300 hover:scale-105 transform">
                Get Involved
                </button>
            </Link>
            </div>
        </div>
        </SwiperSlide>

        <SwiperSlide>
        {/* Slide 2 */}
        <div className="relative h-full w-full">
            <Image
            src="/test4.png"
            alt="Kids outdoors"
            fill
            // className="object-cover object-[center_50%]"
            className="object-cover object-[center_25%] h-full w-full"
            priority
            />
            <div className="absolute inset-0 bg-white/10 z-10 pointer-events-none" />
            <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 z-10 text-white text-center px-4 whitespace-nowrap">
            <h1 className="text-4xl md:text-6xl font-bold"
                style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)' }}>
                A Place to Belong, Explore, and Create
            </h1>
            <p className="text-xl md:text-2xl mt-6"
                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                For homeschoolers seeking fun, friendships, and meaningful adventures.
            </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center top-[50%] z-10">
            <Link href="/get-involved">
                <button className="bg-wondergreen text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:bg-wonderleaf transition-colors duration-300 hover:scale-105 transform mt-4">
                Get Involved
                </button>
            </Link>
            </div>
        </div>
        </SwiperSlide>

        <SwiperSlide>
        {/* Slide 3 */}
        <div className="relative h-full w-full">
            <Image
            src="/hero3.png"
            alt="Kids outdoors"
            fill
            // className="object-cover object-[center_35%]"
            className="object-cover object-[center_35%] h-full w-full"
            priority
            />
            <div className="absolute inset-0 bg-white/10 z-10 pointer-events-none" />
            <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 z-10 text-white text-center px-4 whitespace-nowrap">
            <h1 className="text-4xl md:text-6xl font-bold"
                style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)' }}>
                Where Homeschool Kids Connect & Grow
            </h1>
            <p className="text-xl md:text-2xl mt-6"
                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                Creative activities, new friendships, real-life experiences.
            </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center top-[50%] z-10">
            <Link href="/get-involved">
                <button className="bg-wondergreen text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:bg-wonderleaf transition-colors duration-300 hover:scale-105 transform mt-6">
                Get Involved
                </button>
            </Link>
            </div>
        </div>
        </SwiperSlide>

      </Swiper>
    </section>
  );
}
