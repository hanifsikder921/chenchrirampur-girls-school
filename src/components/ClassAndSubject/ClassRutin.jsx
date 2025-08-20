import React, { useState, useEffect } from 'react';

const ClassRutin = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = 'https://i.ibb.co/mV04dTRF/class-rutin-2025.jpg';

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
  }, [imageUrl]);

  const openImageInNewTab = () => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="my-4">
      <div className="mx-auto">
        {!imageLoaded && !imageError && (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-lg">রুটিন লোড হচ্ছে...</p>
            <p className="text-gray-400 text-sm mt-2">অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন</p>
          </div>
        )}

        {imageError && (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              রুটিন লোড করতে সমস্যা হচ্ছে
            </h2>
            <p className="text-gray-600 text-center">
              দুঃখিত, ক্লাস রুটিনটি লোড করা যায়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
            </p>
          </div>
        )}

        {imageLoaded && (
          <div className="overflow-hidden transition-all duration-500 transform">
            <img src={imageUrl} alt="ক্লাস রুটিন ২০২৫" className="w-full h-auto object-contain" />
          </div>
        )}
      </div>

      {imageLoaded && (
        <div className='w-full  flex items-center justify-center'>
          <button
            onClick={openImageInNewTab}
            className="px-4 py-2  bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fullscreen View
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassRutin;
