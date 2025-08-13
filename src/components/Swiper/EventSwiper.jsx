import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

export default function EventSwiper() {
  const slides = [
    {
      img: 'https://i.ibb.co.com/vxBYFXgk/banner3.jpg',
      title: 'জলবায়ু পরিবর্তন ও সচেতনতামূলক বিতর্ক প্রতিযোগিতা',
    },
    {
      img: 'https://i.ibb.co.com/JWrR4Yz5/banner2.jpg',
      title: 'জলবায়ু পরিবর্তন ও সচেতনতামূলক কর্মসূচি',
    },
    { img: 'https://i.ibb.co.com/G3BQj02p/accident.jpg', title: 'মাইলস্টোনে বিমান দুর্ঘটনায় নিহতদের জন্য দোয়া প্রার্থনা' },
    { img: 'https://i.ibb.co.com/gLXrpPfG/banner1.jpg', title: 'দৈনিক সমাবেশ' },
  ];

  return (
    <Swiper
      pagination={{ type: 'fraction' }}
      navigation={true}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      modules={[Pagination, Navigation, Autoplay]}
      className="mySwiper w-full "
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className="relative">
          <img src={slide.img} alt={slide.title} className="w-full h-96 object-cover" />
          <div className="absolute inset-0 flex items-center  justify-center bg-black/30">
            <h2 className="text-white text-2xl font-bold absolute bottom-0 py-6 ">{slide.title}</h2>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
