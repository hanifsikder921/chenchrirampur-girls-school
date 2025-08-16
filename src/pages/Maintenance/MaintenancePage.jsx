import React from 'react';
import { Link } from 'react-router';
import { IoConstructOutline, IoHome, IoServerOutline, IoTimeOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center">
      <motion.div
        className="max-w-lg w-full mx-auto bg-white p-8 rounded-xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated construction icon */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <IoConstructOutline className="text-7xl text-amber-500 mx-auto mb-6" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">Scheduled Maintenance</h1>
        <p className="text-gray-600 mb-6 text-lg">
          We're performing scheduled maintenance to improve your experience.
        </p>

        {/* Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center space-x-3">
              <IoServerOutline className="text-2xl text-blue-600" />
              <span className="font-medium text-blue-800">System Status</span>
            </div>
            <div className="mt-2 text-sm text-blue-600">Maintenance in progress</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="flex items-center justify-center space-x-3">
              <IoTimeOutline className="text-2xl text-amber-600" />
              <span className="font-medium text-amber-800">Estimated Time</span>
            </div>
            <div className="mt-2 text-sm text-amber-600">Back by 4:00 PM UTC</div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-500 text-sm">
            We apologize for any inconvenience. Our team is working hard to complete the maintenance
            as quickly as possible.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          <IoHome className="mr-2 text-lg" />
          Return to Homepage
        </Link>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Need immediate assistance? Contact chenchrigirls@gmail.com
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
