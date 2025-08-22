import React from 'react';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiLoader,
  FiBookOpen,
} from 'react-icons/fi';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';

const Footer = () => {
  const { schoolInfo, isLoading, isError } = useSchoolInfo();

  if (isLoading) {
    return (
      <div className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4">
              <FiLoader className="h-6 w-6 mx-auto text-white" />
            </div>
            <p className="text-gray-300">Loading school information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !schoolInfo) {
    return (
      <div className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">Error loading school information</p>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 text-white"
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Information */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              {schoolInfo.schoolLogo && (
                <img
                  src={schoolInfo.schoolLogo}
                  alt={schoolInfo.schoolName_en}
                  className="h-12 w-12 mr-3 object-contain"
                />
              )}
              <div>
                <h3 className="text-xl font-bold">{schoolInfo.schoolName_en}</h3>
                <p className="text-gray-300">{schoolInfo.schoolName_bn}</p>
                স্থাপিতঃ {schoolInfo.establishedYear} ইং
              </div>
            </div>

            <div className="flex items-center text-gray-300 mb-2">
              <FiMapPin className="mr-2 flex-shrink-0" />
              <span>{schoolInfo.address}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <div className="flex flex-col">
                <span className="flex items-center gap-1">
                  <FiBookOpen className="mr-2 flex-shrink-0" /> ইআইআইএনঃ {schoolInfo.EIIN}
                </span>
                <span className="flex items-center gap-1">
                  <FiBookOpen className="mr-2 flex-shrink-0" /> এমপিও কোডঃ {schoolInfo.MPOCode}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <FiPhone className="mr-2 flex-shrink-0" />
                <span>{schoolInfo.phone}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FiMail className="mr-2 flex-shrink-0" />
                <span>{schoolInfo.email}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FiGlobe className="mr-2 flex-shrink-0" />
                <span>{schoolInfo.website}</span>
              </div>
            </div>
          </div>

          {/* Leadership & Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Leadership</h4>
            <div className="space-y-3 mb-6">
              <div>
                <p className="font-medium">প্রধান শিক্ষক</p>
                <p className="text-gray-300">{schoolInfo.principal}</p>
              </div>
              <div>
                <p className="font-medium">সভাপতি</p>
                <p className="text-gray-300">{schoolInfo.precident}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              © {currentYear} {schoolInfo.schoolName_en}. All rights reserved.
            </p>
            <div className="flex items-center text-gray-300 text-sm justify-center flex-col">
              <div className="flex space-x-4">
                <a
                  href={schoolInfo?.socialMedia?.facebook}
                  target="_blank"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FiFacebook className="h-6 w-6" />
                </a>
                <a
                  href={schoolInfo?.socialMedia?.twitter}
                  target="_blank"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FiTwitter className="h-6 w-6" />
                </a>
                <a
                  href={schoolInfo?.socialMedia?.youtube}
                  target="_blank"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FiYoutube className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
