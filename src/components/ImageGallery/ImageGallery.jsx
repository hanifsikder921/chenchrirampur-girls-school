import React from 'react';

const galleryImages = [
  {
    id: 1,
    imgUrl: 'https://i.ibb.co.com/gLXrpPfG/banner1.jpg',
    title: 'ছবি ১',
  },
  {
    id: 2,
    imgUrl: 'https://i.ibb.co.com/G3BQj02p/accident.jpg',
    title: 'ছবি ২',
  },
  {
    id: 3,
    imgUrl: 'https://i.ibb.co.com/JWrR4Yz5/banner2.jpg',
    title: 'ছবি ৩',
  },
  {
    id: 4,
    imgUrl: 'https://i.ibb.co.com/RTVfyJKM/TREE.jpg',
    title: 'ছবি ৪',
  },
  {
    id: 5,
    imgUrl: 'https://i.ibb.co.com/pjSpWhyZ/sss.jpg',
    title: 'ছবি ৫',
  },
  {
    id: 6,
    imgUrl: 'https://i.ibb.co.com/yD68mGL/beayty.jpg',
    title: 'ছবি ৬',
  },
];

const ImageGallery = () => {
  return (
    <div className="w-full border border-gray-300 overflow-hidden my-6">
      <h2 className="text-base font-bold bg-lime-600 text-white p-2">ইমেজ গ্যালারি</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {galleryImages.map((image) => (
          <div key={image.id} className="w-full group">
            <div className="relative pb-[100%] h-0 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src={image.imgUrl}
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
