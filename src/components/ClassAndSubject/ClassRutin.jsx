import React, { useState, useEffect } from 'react';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';

const ClassRutin = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { schoolInfo, isLoading, isError } = useSchoolInfo();

  useEffect(() => {
    // Reset states when schoolInfo changes
    setImageLoaded(false);
    setImageError(false);

    if (!schoolInfo?.classRoutin) return;

    const img = new Image();
    img.src = schoolInfo.classRoutin;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
  }, [schoolInfo?.classRoutin]);

  const openImageInNewTab = () => {
    if (schoolInfo?.classRoutin) {
      window.open(schoolInfo.classRoutin, '_blank', 'noopener,noreferrer');
    }
  };

  // Show loading state while schoolInfo is loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg my-4">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping"></div>
          <div className="absolute inset-2 bg-blue-500 rounded-full"></div>
        </div>
        <p className="text-gray-600 text-lg">স্কুল তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  // Show error state if there's an error loading schoolInfo
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg my-4">
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
          স্কুল তথ্য লোড করতে সমস্যা হচ্ছে
        </h2>
        <p className="text-gray-600 text-center">
          দুঃখিত, স্কুল তথ্য লোড করা যায়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
        </p>
      </div>
    );
  }

  // Check if classRoutin exists
  if (!schoolInfo?.classRoutin) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg my-4">
        <div className="text-yellow-500 mb-4">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">ক্লাস রুটিন পাওয়া যায়নি</h2>
        <p className="text-gray-600 text-center">
          এই স্কুলের জন্য এখনো কোনো ক্লাস রুটিন আপলোড করা হয়নি।
        </p>
      </div>
    );
  }

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
            <img
              src={schoolInfo.classRoutin}
              alt="ক্লাস রুটিন ২০২৫"
              className="w-full h-auto object-contain rounded-lg shadow-md"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>

      {imageLoaded && (
        <div className="w-full flex items-center justify-center mt-4">
          <button
            onClick={openImageInNewTab}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              ></path>
            </svg>
            ফুলস্ক্রিনে দেখুন
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassRutin;
