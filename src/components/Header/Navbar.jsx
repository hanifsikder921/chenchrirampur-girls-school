import React from 'react';
import { IoHome, IoChevronDown } from 'react-icons/io5';
import { NavLink } from 'react-router';

const Navbar = () => {
  const menuItems = [
    {
      title: 'ক্যাম্পাস',
      submenu: [
        { title: 'ক্যাম্পাস লাইফ', bg: 'bg-green-50' },
        { title: 'ইভেন্টস', bg: 'bg-green-100' },
        { title: 'ক্লাব ও সংগঠন', bg: 'bg-green-50' },
        { title: 'ভ্রমণ ও সফর', bg: 'bg-green-100' },
      ],
    },
    {
      title: 'ভর্তি',
      submenu: [
        { title: 'ভর্তি প্রক্রিয়া', bg: 'bg-blue-50' },
        { title: 'ভর্তি ফর্ম', bg: 'bg-blue-100' },
        { title: 'ভর্তি পরীক্ষা', bg: 'bg-blue-50' },
        { title: 'ফি ও বেতন', bg: 'bg-blue-100' },
      ],
    },
    {
      title: 'শ্রেণী ও বিষয়',
      submenu: [
        { title: 'ষষ্ঠ থেকে অষ্টম শ্রেণী', bg: 'bg-purple-50' },
        { title: 'নবম-দশম শ্রেণী', bg: 'bg-purple-100' },
        { title: 'বিজ্ঞান বিভাগ', bg: 'bg-purple-50' },
        { title: 'মানবিক ও ব্যবসায় শিক্ষা', bg: 'bg-purple-100' },
      ],
    },
    {
      title: 'ব্যাবস্থাপনা',
      submenu: [
        { title: 'অ্যাডমিন প্যানেল', bg: 'bg-red-50' },
        { title: 'ফ্যাকাল্টি ম্যানেজমেন্ট', bg: 'bg-red-100' },
        { title: 'কর্মচারী ব্যবস্থাপনা', bg: 'bg-red-50' },
        { title: 'অর্থ ও হিসাব', bg: 'bg-red-100' },
      ],
    },
    {
      title: 'একাডেমিক পেপার',
      submenu: [
        { title: 'রিসার্চ পেপার', bg: 'bg-yellow-50' },
        { title: 'জার্নাল', bg: 'bg-yellow-100' },
        { title: 'থিসিস', bg: 'bg-yellow-50' },
        { title: 'প্রজেক্ট রিপোর্ট', bg: 'bg-yellow-100' },
      ],
    },
    {
      title: 'শিক্ষার্থী',
      submenu: [
        { title: 'শিক্ষার্থী প্রোফাইল', bg: 'bg-indigo-50' },
        { title: 'অ্যাটেন্ডেন্স', bg: 'bg-indigo-100' },
        { title: 'রেজাল্ট কার্ড', bg: 'bg-indigo-50' },
        { title: 'শিক্ষাবৃত্তি', bg: 'bg-indigo-100' },
      ],
    },
    {
      title: 'ফলাফল',
      submenu: [
        { title: 'পরীক্ষার ফলাফল', bg: 'bg-pink-50' },
        { title: 'মেরিট লিস্ট', bg: 'bg-pink-100' },
        { title: 'গ্রেডিং সিস্টেম', bg: 'bg-pink-50' },
        { title: 'ফলাফল পুনঃনিরীক্ষণ', bg: 'bg-pink-100' },
      ],
    },
    {
      title: 'রিসোর্স',
      submenu: [
        { title: 'লাইব্রেরি', bg: 'bg-teal-50' },
        { title: 'ল্যাবরেটরি', bg: 'bg-teal-100' },
        { title: 'সফটওয়্যার', bg: 'bg-teal-50' },
        { title: 'অনলাইন রিসোর্স', bg: 'bg-teal-100' },
      ],
    },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center space-x-1 py-3">
          <NavLink
            to="/"
            className="px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center"
            activeClassName="text-blue-600 bg-blue-50"
          >
            <IoHome className="text-lg text-black" />
          </NavLink>

          {menuItems.map((item) => (
            <li key={item.title} className="relative group">
              <div className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                {item.title}
                <IoChevronDown className="ml-1 text-xs opacity-70 group-hover:rotate-180 transition-transform" />
              </div>

              <ul className="absolute left-0 mt-1 w-56 origin-top-left rounded-md shadow-xl bg-white  ring-black  invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                {item.submenu.map((subItem, index) => (
                  <li key={index}>
                    <NavLink
                      to={`/${item.title.toLowerCase().replace(/\s+/g, '-')}/${subItem.title
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                      className={`${subItem.bg} block px-4 py-3 text-sm text-gray-700 hover:bg-opacity-90 hover:text-blue-600 border-b border-gray-100 last:border-b-0`}
                    >
                      {subItem.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
