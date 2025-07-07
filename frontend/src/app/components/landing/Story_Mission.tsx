import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function Story_Mission(){

    return (
        <section className='w-full px-6 py-16 bg-white text-wondergreen'>
            <div className='max-w-7xl mx-auto grid md:grid-cols-2 gap-8 content-center min-h-[400px]'>
                {/* Left: Text Content */}
                <div className='flex flex-col justify-center h-full'>
                    <h2 className='text-5xl font-bold text-wondergreen mb-6'>
                        Our Story & Mission
                    </h2>
                    <p className='text-lg mb-4'>
                        WonderHood was born from a simple need: homeschool families in small
                        mountain towns deserve rich, community-centered experiences for their children.
                    </p>
                    <p className='text-lg'>
                        We create opportunities for homeschool kids to learn together through
                        outdoor exploration, practical life skills, creative arts, and
                        technology — all while building lasting friendships and confidence.
                    </p>
                </div>

                {/* Right: Photo Carousel */}
                <div className="flex items-center h-full mb-6">
                    <div className="w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-md">
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                        >
                            <SwiperSlide>
                            <img
                                src="/ourStory/story1.png"
                                alt="Kids event"
                                className="w-full h-full object-cover"
                            />
                            </SwiperSlide>
                            <SwiperSlide>
                            <img
                                src="/ourStory/story2.png"
                                alt="Kids outdoors"
                                className="w-full h-full object-cover"
                            />
                            </SwiperSlide>
                            <SwiperSlide>
                            <img
                                src="/ourStory/story3.png"
                                alt="Indoor learning"
                                className="w-full h-full object-cover"
                            />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>

            </div>

        </section>
    )

}