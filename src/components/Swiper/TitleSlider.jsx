import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // fade এর জন্য css
import { Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';
import useAxios from '../../assets/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';

const TitleSlider = () => {
  const { schoolInfo, isLoading, isError } = useSchoolInfo();
  const axios = useAxios();

  // Fetch Images
  const { data } = useQuery({
    queryKey: ['bannerImages'],
    queryFn: async () => {
      const res = await axios.get('/imageMedia');
      return res.data;
    },
    retry: 1,
  });

  const bannerImage = data || [];

  // শুধু banner === true গুলো নিবে
  const showcaseBanner = bannerImage.filter((bannerImg) => bannerImg.banner === true);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading school info</p>;

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden">
      {/* Swiper Background */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade" // fade effect
        fadeEffect={{ crossFade: true }} // smooth crossfade
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {showcaseBanner.map((banner, index) => (
          <SwiperSlide key={index}>
            <img
              src={banner.imageUrl}
              alt={banner.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay with School Info */}
      <div className="absolute inset-0 flex items-center z-50">
        <div className="flex items-center flex-col md:flex-row space-x-4 w-full md:w-auto h-full md:h-auto p-6 md:rounded-r-box bg-black/40">
          <img src={schoolInfo?.schoolLogo} className="w-20 h-20" alt="Logo" />
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-white">
              {schoolInfo?.schoolName_bn}
            </h1>
            <p className="text-white mt-2">
              {schoolInfo?.upazila}, {schoolInfo?.district} ইআইআইএন: {schoolInfo?.EIIN}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleSlider;
