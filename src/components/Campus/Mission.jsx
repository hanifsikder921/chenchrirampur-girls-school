import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaLightbulb } from 'react-icons/fa';

const Mission = () => {
  return (
    <div className="w-11/12 mx-auto py-10">
      {/* শিরোনাম */}
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-700"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        মিশন ও উদ্দেশ্য
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* মিশন */}
        <motion.div
          className="bg-white shadow-lg rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center mb-4">
            <FaBullseye className="text-red-600 text-3xl mr-3" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">আমাদের মিশন</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
            আমাদের মিশন হলো শিক্ষার্থীদেরকে মানসম্মত শিক্ষা প্রদান করা, যাতে তারা জ্ঞান, নৈতিকতা এবং
            দক্ষতার সমন্বয়ে আত্মনির্ভরশীল ও দায়িত্বশীল নাগরিক হিসেবে গড়ে উঠতে পারে। শিক্ষার্থীদের
            সার্বিক উন্নয়ন, চরিত্র গঠন এবং আধুনিক প্রযুক্তি নির্ভর শিক্ষা প্রদান আমাদের মূল লক্ষ্য।
          </p>
        </motion.div>

        {/* উদ্দেশ্য */}
        <motion.div
          className="bg-white shadow-lg rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center mb-4">
            <FaLightbulb className="text-yellow-500 text-3xl mr-3" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">আমাদের উদ্দেশ্য</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
            আমাদের উদ্দেশ্য হলো একটি শিক্ষাবান্ধব পরিবেশ সৃষ্টি করা যেখানে শিক্ষার্থীরা মুক্তচিন্তা,
            সৃজনশীলতা ও উদ্ভাবনী ক্ষমতা বিকাশ করতে পারে। সমাজ, দেশ ও জাতির প্রতি দায়িত্বশীল হয়ে
            একবিংশ শতাব্দীর চ্যালেঞ্জ মোকাবেলায় তারা যেন প্রস্তুত হতে পারে, সেটিই আমাদের প্রধান
            উদ্দেশ্য।
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Mission;
