import React, { useState } from 'react';
import { IoHome, IoChevronDown, IoMenu } from 'react-icons/io5';
import { NavLink } from 'react-router';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      title: 'ক্যাম্পাস',
      submenu: [
        { title: 'আমাদের সম্পর্কে', bg: 'bg-green-50', target: '/aboutus' },
        { title: 'মিশন', bg: 'bg-green-100', target: '/mission' },
      ],
    },
    {
      title: 'ভর্তি',
      submenu: [
        { title: 'ভর্তি প্রক্রিয়া', bg: 'bg-blue-50', target: '/admissionprocess' },
        { title: 'ভর্তি ফর্ম', bg: 'bg-blue-100', target: '/admissionform' },
        // { title: 'ভর্তি পরীক্ষা', bg: 'bg-blue-50', target: '/admission/exam' },
        // { title: 'ফি ও বেতন', bg: 'bg-blue-100', target: '/admission/fees' },
      ],
    },
    {
      title: 'শ্রেণী ও বিষয়',
      submenu: [
        { title: 'ষষ্ঠ থেকে দশম শ্রেণী', bg: 'bg-purple-50', target: '/sixtoTen' },
        { title: 'ক্লাস রুটিন', bg: 'bg-purple-100', target: '/class-routine' },

       
      ],
    },
    {
      title: 'ব্যাবস্থাপনা',
      submenu: [
        { title: 'অ্যাডমিন প্যানেল', bg: 'bg-red-50', target: '/login' },
        { title: ' শিক্ষক ও কর্মচারী ', bg: 'bg-yellow-100', target: '/staff' },
      ],
    },
    {
      title: 'একাডেমিক পেপার',
      submenu: [
        { title: 'রিসার্চ পেপার', bg: 'bg-yellow-50', target: '/papers/research' },
        { title: 'জার্নাল', bg: 'bg-yellow-100', target: '/papers/journal' },
        { title: 'থিসিস', bg: 'bg-yellow-50', target: '/papers/thesis' },
        { title: 'প্রজেক্ট রিপোর্ট', bg: 'bg-yellow-100', target: '/papers/project-report' },
      ],
    },
    {
      title: 'শিক্ষার্থী',
      submenu: [
        { title: 'শিক্ষার্থী প্রোফাইল', bg: 'bg-indigo-50', target: '/students/profile' },
        // { title: 'অ্যাটেন্ডেন্স', bg: 'bg-indigo-100', target: '/students/attendance' },
        // { title: 'রেজাল্ট কার্ড', bg: 'bg-indigo-50', target: '/students/result-card' },
        // { title: 'শিক্ষাবৃত্তি', bg: 'bg-indigo-100', target: '/students/scholarship' },
      ],
    },
    {
      title: 'ফলাফল',
      submenu: [
        { title: 'স্কুল পরীক্ষা ফলাফল', bg: 'bg-pink-50', target: '/school-result' },
        { title: 'বোর্ড পরীক্ষার ফলাফল', bg: 'bg-pink-50', target: '/results/exam' },
        // { title: 'মেরিট লিস্ট', bg: 'bg-pink-100', target: '/results/merit-list' },
        // { title: 'গ্রেডিং সিস্টেম', bg: 'bg-pink-50', target: '/results/grading' },
        // { title: 'ফলাফল পুনঃনিরীক্ষণ', bg: 'bg-pink-100', target: '/results/recheck' },
      ],
    },
    {
      title: 'রিসোর্স',
      submenu: [
        { title: 'লাইব্রেরি', bg: 'bg-teal-50', target: '/resources/library' },
        { title: 'ল্যাবরেটরি', bg: 'bg-teal-100', target: '/resources/lab' },
        { title: 'কম্পিউটার ল্যাব', bg: 'bg-teal-100', target: '/resources/lab' },
        // { title: 'সফটওয়্যার', bg: 'bg-teal-50', target: '/resources/software' },
        // { title: 'অনলাইন রিসোর্স', bg: 'bg-teal-100', target: '/resources/online' },
      ],
    },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-1 py-3">
          <NavLink
            to="/"
            className="px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:text-green-800 transition-colors duration-200 flex items-center"
          >
            <IoHome className="text-lg text-green-600" />
          </NavLink>

          {menuItems.map((item) => (
            <li key={item.title} className="relative group">
              <div className="flex items-center bg-green-800 px-4 py-2 rounded-md text-sm font-semibold text-white hover:bg-blue-50 hover:text-green-800 transition-colors duration-200 cursor-pointer">
                {item.title}
                <IoChevronDown className="ml-1 text-xs opacity-70 group-hover:rotate-180 transition-transform" />
              </div>

              <ul className="absolute left-0 mt-1 w-56 origin-top-left rounded-md shadow-xl bg-white invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                {item.submenu.map((subItem, index) => (
                  <li key={index}>
                    <NavLink
                      to={subItem.target}
                      className={`${subItem.bg} block px-4 py-3 text-sm text-gray-700 hover:bg-opacity-90 hover:text-white hover:font-semibold duration-100 hover:bg-green-800 border-b border-gray-100 last:border-b-0`}
                    >
                      {subItem.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden justify-between items-center py-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center space-x-2 text-gray-700 font-medium"
          >
            <IoMenu className="text-2xl" />
            <span>মেনু সিলেক্ট করুন</span>
          </button>
        </div>

        {/* Mobile Menu List */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="space-y-2 pb-4">
            {menuItems.map((item) => (
              <li key={item.title} className="border-b border-gray-200">
                <details>
                  <summary className="cursor-pointer px-4 py-2 bg-gray-50 font-semibold flex justify-between items-center">
                    {item.title}
                    <IoChevronDown className="text-sm" />
                  </summary>
                  <ul>
                    {item.submenu.map((subItem, index) => (
                      <li key={index}>
                        <NavLink
                          to={subItem.target}
                          className={`${subItem.bg} block px-6 py-2 text-sm text-gray-700 hover:bg-opacity-90 hover:text-blue-600`}
                        >
                          {subItem.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
