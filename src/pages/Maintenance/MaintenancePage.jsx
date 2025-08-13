import React from 'react';
import { Link } from 'react-router';
import { IoConstructOutline, IoHome } from 'react-icons/io5';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <IoConstructOutline className="text-6xl text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Website Under Maintenance</h1>
        <p className="text-gray-600 mb-6">
          We're currently working on improving our website. Please check back later.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <IoHome className="mr-2" />
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default MaintenancePage;
