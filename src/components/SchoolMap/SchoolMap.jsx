import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiNavigation, FiExternalLink, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';

const SchoolMap = () => {
  const { schoolInfo, isLoading, isError } = useSchoolInfo();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl  shadow-md p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4">
            <FiLoader className="h-6 w-6 mx-auto text-blue-500" />
          </div>
          <p className="text-gray-600">Loading school location...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12">
          <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Map</h3>
          <p className="text-gray-600 text-center">Unable to load school location information.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <FiMapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">School Location</h2>
            <p className="text-gray-600">{schoolInfo?.schoolName_bn} এর অবস্থান</p>
          </div>
        </div>

        {schoolInfo?.mapEmbedLink && (
          <a
            href={schoolInfo.mapEmbedLink.replace('/embed', '')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FiExternalLink className="mr-2" />
            Open in Maps
          </a>
        )}
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200">
        {schoolInfo?.mapEmbedLink ? (
          <iframe
            title="School Location"
            src={schoolInfo.mapEmbedLink}
            className="w-full h-[450px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-[450px] bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <FiMapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No map available</p>
            </div>
          </div>
        )}

        {/* Overlay Directions Button */}
        {schoolInfo?.mapEmbedLink && (
          <div className="absolute bottom-4 right-4">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                schoolInfo.schoolName_bn
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-white text-gray-800 rounded-md shadow-lg hover:shadow-xl transition-all hover:bg-blue-50 border border-gray-200"
            >
              <FiNavigation className="mr-2 text-blue-600" />
              Get Directions
            </a>
          </div>
        )}
      </div>

      {/* Additional Information */}
      {schoolInfo?.address && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <FiMapPin className="mr-2 text-gray-500" />
            Address
          </h3>
          <p className="text-gray-700">{schoolInfo?.address}</p>
        </div>
      )}
    </motion.div>
  );
};

export default SchoolMap;
