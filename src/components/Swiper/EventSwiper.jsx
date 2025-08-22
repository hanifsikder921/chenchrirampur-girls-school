import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import useAxios from '../../assets/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';

export default function EventSwiper() {
  const axios = useAxios();

  // Fetch Images
  const { data } = useQuery({
    queryKey: ['feturedImage'],
    queryFn: async () => {
      const res = await axios.get('/imageMedia');
      return res.data;
    },
    retry: 1,
  });

  const feturedImage = data || [];

  const showcaseBanner = feturedImage.filter((fetured) => fetured.feature === true);

  return (
    <Swiper
      navigation={true}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      modules={[Pagination, Navigation, Autoplay]}
      className="mySwiper w-full "
    >
      {showcaseBanner.map((slide) => (
        <SwiperSlide key={slide._id} className="relative">
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full md:h-96 h-48 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <h2 className="text-white md:text-2xl text-sm text-center line-clamp-2 md:font-bold font-semibold absolute bottom-0 md:py-6 py-2 bg-black/30 w-full ">
              {slide.title}
            </h2>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
