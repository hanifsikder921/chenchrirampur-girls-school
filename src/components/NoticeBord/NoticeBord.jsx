import React from 'react';
import { FaPlay } from 'react-icons/fa'; // For bullet icons

const notices = [
  '২০২৫ শিক্ষাবর্ষের ক্লাস ৬-১০ এর শিক্ষার্থীদের জন্য নতুন বই বিতরণ আগামী সোমবার শুরু হবে।',
  'বিদ্যালয়ের বার্ষিক ক্রীড়া প্রতিযোগিতা ২৫শে আগস্ট অনুষ্ঠিত হবে - সকলকে প্রস্তুত থাকার নির্দেশ দেওয়া হলো।',
  'শিক্ষার্থীদের জন্য স্বাস্থ্য পরীক্ষা ২০শে আগস্ট থেকে শুরু হবে। নির্ধারিত দিনে উপস্থিত থাকা আবশ্যক।',
  'সপ্তাহব্যাপী পরিস্কার পরিচ্ছন্নতা অভিযান শুরু হবে ১৮ই আগস্ট থেকে - সক্রিয় অংশগ্রহণ প্রত্যাশা করা হচ্ছে।',
  '২০২৫ সালের প্রথম সাময়িক পরীক্ষা শুরু হবে ১লা সেপ্টেম্বর - সময়সূচি শীঘ্রই জানানো হবে।',
];


const NoticeBord = () => {
  return (
    <div className=" mx-auto bg-gray-50 shadow   p-4 my-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          src="https://i.ibb.co.com/DDH1K0JR/globe-removebg-preview.png"
          alt="Globe Icon"
          className="w-10 h-10 mr-3"
        />
        <h2 className="text-xl font-bold text-gray-800">নোটিশ বোর্ড</h2>
      </div>

      {/* Notice List */}
      <ul className="space-y-2 text-gray-500">
        {notices.map((notice, index) => (
          <li key={index} className="flex items-start">
            <FaPlay className="text-green-600 mt-1 mr-2 text-xs" />
            <p className="hover:underline cursor-pointer text-sm">{notice}</p>
          </li>
        ))}
      </ul>

      {/* Button */}
      <div className="text-right mt-4">
        <button className="bg-gray-700 text-white px-4 py-1 text-sm rounded hover:bg-gray-800 cursor-pointer">
          সকল
        </button>
      </div>
    </div>
  );
};

export default NoticeBord;
