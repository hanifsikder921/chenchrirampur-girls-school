import React from 'react';
import useAxios from '../../assets/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';



const ImageGallery = () => {

   const axios = useAxios();

   // Fetch Images
   const { data } = useQuery({
     queryKey: ['imageGallery'],
     queryFn: async () => {
       const res = await axios.get('/imageMedia');
       return res.data;
     },
     retry: 1,
   });

   const gallery = data || [];
     const galleryImages = gallery.filter((img) => img.gallery === true);

  return (
    <div className="w-full border border-gray-300 overflow-hidden my-6">
      <h2 className="text-base font-bold bg-green-800 text-white p-2">ইমেজ গ্যালারি</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {galleryImages.slice(0, 6).map((image) => (
          <div key={image.id} className="w-full group">
            <div className="relative pb-[100%] h-0 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src={image.imageUrl}
                alt={image.title || `Gallery image ${image.id}`}
                className="absolute top-0 left-0  w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* {image.title && <h3 className="mt-2 text-center font-medium">{image.title}</h3>} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
