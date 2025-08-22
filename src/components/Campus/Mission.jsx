import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaLightbulb } from 'react-icons/fa';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';

const Mission = () => {
      const { schoolInfo, isLoading, isError } = useSchoolInfo();
    
      if (isLoading) return <p>Loading...</p>;
      if (isError) return <p>Error loading school info</p>;
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
           {schoolInfo?.mission}
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
            {schoolInfo?.vision}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Mission;
