import React from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';

const AboutUs = () => {
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
        আমাদের সম্পর্কে
      </motion.h1>

      {/* কনটেন্ট কার্ড */}
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-6 md:p-10 text-gray-700 leading-relaxed"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* স্কুলের নাম */}
        <div className="flex items-center mb-5">
          <FaSchool className="text-blue-600 text-2xl mr-3" />
          <h2 className="text-xl md:text-2xl font-semibold">{schoolInfo?.schoolName_bn}</h2>
        </div>

        {/* ঠিকানা */}
        <div className="flex items-start mb-4">
          <FaMapMarkerAlt className="text-green-600 text-xl mr-3 mt-1" />
          <p className="text-base md:text-lg">{schoolInfo?.address}</p>
        </div>

        {/* প্রতিষ্ঠা সাল */}
        <div className="flex items-start mb-4">
          <FaCalendarAlt className="text-orange-500 text-xl mr-3 mt-1" />
          <p className="text-base md:text-lg">স্থাপিত: {schoolInfo?.establishedYear} ইং</p>
        </div>

        {/* বর্ণনা */}
        <motion.p
          className="text-justify text-base md:text-lg mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {schoolInfo?.aboutUs}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AboutUs;
