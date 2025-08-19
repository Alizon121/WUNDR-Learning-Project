import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function Story_Mission(){

    return (
    <section className="w-full text-wondergreen bg-[#FAF7ED]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[400px] px-4 sm:px-6 lg:px-8 py-10">
        {/* Left: Text */}
        <div className="flex flex-col justify-center">
         {/* Title and line - centered on mobile, left-aligned on desktop */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-wondergreen mb-4 md:mb-6 leading-tight">
              Our Story & Mission
            </h2>
            <div className="h-1 w-3/4 md:w-3/4 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md mb-6" />
          </div>

          {/* Paragraphs - centered on mobile, left-aligned on desktop */}
          <div className="text-center md:text-left">
            <p className="text-base sm:text-lg md:text-xl mb-4 leading-relaxed">
              WonderHood was born from a simple need: homeschool families in small mountain towns
              deserve rich, community-centered experiences for their children.
            </p>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed">
              We create opportunities for homeschool kids to learn together through outdoor exploration,
              practical life skills, creative arts, and technology — all while building lasting friendships
              and confidence.
            </p>
          </div>
        </div>

        {/* Right: Image carousel */}
        <div className="flex h-full items-center justify-center md:justify-start lg:ml-14">
          <div className="
              relative
              w-full max-w-[560px]
              aspect-[5/3] sm:aspect-[16/9]
              lg:w-[500px] lg:h-[300px] lg:aspect-auto
              rounded-2xl overflow-hidden shadow-md mt-4
            ">
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              loop
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              modules={[Autoplay]}
              className="w-full h-full"
            >
                {/* Slide 1 */}
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src="/ourStory/story1.png"
                    alt="Kids event"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </SwiperSlide>

                {/* Slide 2 */}
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src="/ourStory/story2.png"
                    alt="Kids outdoors"
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>

                {/* Slide 3 */}
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src="/ourStory/story3.png"
                    alt="Indoor learning"
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );

}