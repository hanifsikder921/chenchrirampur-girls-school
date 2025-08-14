import React from 'react';
import { Link, Outlet } from 'react-router';
import { IoArrowBack } from 'react-icons/io5';
import AuthImage from '../../src/assets/images/logo.png';

const AuthenticationLayout = () => {
  return (
    <div className="min-h-screen  flex flex-col">
      {/* Header with back button */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="flex items-center text-gray-700 hover:text-green-800 transition-colors duration-200 w-fit"
          >
            <IoArrowBack className="mr-2" size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-6xl rounded-xl md:shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image section */}
            <section className="hidden md:flex md:w-1/2  bg-green-800 items-center justify-center p-8">
              <div className="max-w-md">
                <img
                  src={AuthImage}
                  alt="Authentication"
                  className=" w-25 mx-auto h-auto object-contain"
                />
                <h2 className="text-white text-2xl font-bold mt-6 text-center">
                  চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয়
                </h2>
                <p className="text-green-100 mt-2 text-center">
                  
                </p>
              </div>
            </section>
            {/* Form section */}
            <section className="w-full md:w-1/2 p-2 md:p-12 lg:p-16">
              <Outlet />
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} chenchri Rampur girls school. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthenticationLayout;
