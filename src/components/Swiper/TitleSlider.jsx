import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';

import logo from '../../../public/logo.png';
import { Swiper, SwiperSlide } from 'swiper/react';

const TitleSlider = () => {
  const bgImages = [
    'https://i.ibb.co.com/R4jQqd5G/mainbanner.jpg',
    'https://i.ibb.co.com/gLXrpPfG/banner1.jpg',
  ];

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden">
      {/* Swiper Background */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {bgImages.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 flex items-center  z-50">
        <div className="flex items-center flex-col md:flex-row space-x-4 w-full md:w-auto h-full md:h-auto  p-6 rounded-r-box bg-black/40">
          <img src={logo} className="w-20 h-20" alt="Logo" />
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-white ">
              চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয়
            </h1>
            <p className="text-white mt-2">কাঠালিয়া, ঝালকাঠি। ইআইআইএন: ১০১৭৩৬</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleSlider;
