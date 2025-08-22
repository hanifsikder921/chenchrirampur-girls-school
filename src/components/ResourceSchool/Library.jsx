import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';

const Library = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState(null);
     const { schoolInfo, isLoading, isError } = useSchoolInfo();

     if (isLoading) return <p>Loading...</p>;
     if (isError) return <p>Error loading school info</p>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const libraryItems = [
    { id: 1, name: 'কক্ষ সংখ্যা', quantity: '১ টি', icon: '🏫', description: 'গ্রন্থাগার কক্ষ' },
    {
      id: 2,
      name: 'বই সংখ্যা',
      quantity: '১৫৫০ খানা',
      icon: '📚',
      description: 'বিভিন্ন বিষয়ের বই',
    },
    {
      id: 3,
      name: 'বই রেজিস্ট্রার',
      quantity: '৪ খানা',
      icon: '📒',
      description: 'বই রেকর্ড সংরক্ষণ',
    },
    {
      id: 4,
      name: 'বই বিতরণ রেজিস্ট্রার',
      quantity: '২ টি',
      icon: '📋',
      description: 'বই বিতরণ রেকর্ড',
    },
    {
      id: 5,
      name: 'আলমীরা (স্টীল)',
      quantity: '৩ টি',
      icon: '🗄️',
      description: 'স্টীলের তৈরি আলমীরা',
    },
    { id: 6, name: 'আলমীরা (কাঠ)', quantity: '২ টি', icon: '📦', description: 'কাঠের তৈরি আলমীরা' },
    { id: 7, name: 'টোকেন কেবিনেট', quantity: '১ টি', icon: '🗃️', description: 'টোকেন সংরক্ষণ' },
    { id: 8, name: 'বড় টেবিল', quantity: '৭ টি', icon: '🪑', description: 'পাঠকদের জন্য টেবিল' },
    { id: 9, name: 'চেয়ার', quantity: '২০ টি', icon: '💺', description: 'পাঠকদের জন্য চেয়ার' },
    { id: 10, name: 'ফ্যান', quantity: '৩ টি', icon: '🌀', description: 'বায়ু সংবহনের জন্য' },
    { id: 11, name: 'লাইট', quantity: '২ টি', icon: '💡', description: 'আলোর ব্যবস্থা' },
    { id: 12, name: 'ঘড়ি', quantity: '১ টি', icon: '⏰', description: 'সময় জানার জন্য' },
  ];

  const bookCategories = [
    { name: 'বিজ্ঞান', count: 320, icon: '🔬' },
    { name: 'সাহিত্য', count: 450, icon: '📖' },
    { name: 'ইতিহাস', count: 180, icon: '📜' },
    { name: 'ভূগোল', count: 120, icon: '🌎' },
    { name: 'গণিত', count: 200, icon: '🧮' },
    { name: 'ধর্ম', count: 160, icon: '☪️' },
    { name: 'রেফারেন্স', count: 80, icon: '📚' },
    { name: 'কম্পিউটার', count: 40, icon: '💻' },
  ];

  const LibraryItemCard = ({ item }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer border border-gray-200 hover:border-green-300 transition-all"
      onClick={() => setSelectedItem(item)}
    >
      <div className="flex items-start">
        <span className="text-3xl mr-3">{item.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
          <p className="text-gray-600">পরিমাণ: {item.quantity}</p>
          {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-2"
          >
            {schoolInfo.schoolName_bn}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-semibold mb-4"
          >
            গ্রন্থাগার
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg"
          >
            জ্ঞানই শক্তি, পড়ুন বেশি করে
          </motion.p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 font-medium text-lg flex items-center ${
              activeTab === 'overview'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-green-500'
            }`}
          >
            <span className="mr-2">📚</span> গ্রন্থাগার পরিচিতি
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`py-4 px-6 font-medium text-lg flex items-center ${
              activeTab === 'equipment'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-green-500'
            }`}
          >
            <span className="mr-2">🛋️</span> সরঞ্জাম সমূহ
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`py-4 px-6 font-medium text-lg flex items-center ${
              activeTab === 'books'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-green-500'
            }`}
          >
            <span className="mr-2">📖</span> বইয়ের বিভাগ
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">বিদ্যালয় সম্পর্কে</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b border-green-100 py-2">
                      <span className="font-medium">বিদ্যালয়ের নাম:</span>
                      <span>{schoolInfo?.schoolName_bn}</span>
                    </li>
                    <li className="flex justify-between border-b border-green-100 py-2">
                      <span className="font-medium">ইউআইআইএন:</span>
                      <span>{schoolInfo?.EIIN}</span>
                    </li>
                    <li className="flex justify-between border-b border-green-100 py-2">
                      <span className="font-medium">প্রতিষ্ঠার সন:</span>
                      <span>{schoolInfo?.establishedYear} ইং</span>
                    </li>
                    <li className="flex justify-between border-b border-green-100 py-2">
                      <span className="font-medium">এমপিও কোড:</span>
                      <span>{schoolInfo?.MPOCode}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-teal-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-teal-800 mb-3">গ্রন্থাগার সম্পর্কে</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b border-teal-100 py-2">
                      <span className="font-medium">মোট বই:</span>
                      <span>১৫৫০ টি</span>
                    </li>
                    <li className="flex justify-between border-b border-teal-100 py-2">
                      <span className="font-medium">পত্র-পত্রিকা:</span>
                      <span>১০ প্রকার</span>
                    </li>
                    <li className="flex justify-between border-b border-teal-100 py-2">
                      <span className="font-medium">গ্রন্থাগার প্রতিষ্ঠা:</span>
                      <span>১৯৮৫ ইং</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">যোগাযোগ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">ইমেইল:</p>
                    <p>{schoolInfo?.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">মোবাইল</p>
                    <p>{schoolInfo?.phone}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'equipment' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                গ্রন্থাগার সরঞ্জাম সমূহ
              </h3>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
              >
                {libraryItems.map((item) => (
                  <LibraryItemCard key={item.id} item={item} />
                ))}
              </motion.div>

              {/* Equipment Table */}
              <div className="mt-8 overflow-x-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  সরঞ্জাম তালিকা
                </h3>
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 border-b text-center font-semibold text-gray-700">
                        ক্রঃ নং
                      </th>
                      <th className="py-3 px-4 border-b text-right font-semibold text-gray-700">
                        সরঞ্জামের বিবরণ
                      </th>
                      <th className="py-3 px-4 border-b text-center font-semibold text-gray-700">
                        পরিমাণ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {libraryItems.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <td className="py-3 px-4 border-b text-center">{item.id}</td>
                        <td className="py-3 px-4 border-b text-right">{item.name}</td>
                        <td className="py-3 px-4 border-b text-center">{item.quantity}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'books' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                বইয়ের বিভাগ অনুযায়ী তালিকা
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {bookCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-md text-center"
                  >
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <h4 className="font-semibold text-lg text-gray-800">{category.name}</h4>
                    <p className="text-gray-600">সংখ্যা: {category.count} টি</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 border-b text-center font-semibold text-gray-700">
                        ক্রমিক নং
                      </th>
                      <th className="py-3 px-4 border-b text-right font-semibold text-gray-700">
                        বইয়ের বিভাগ
                      </th>
                      <th className="py-3 px-4 border-b text-right font-semibold text-gray-700">
                        পরিমাণ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookCategories.map((category, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 border-b text-center">{index + 1}</td>
                        <td className="py-3 px-4 border-b text-right">{category.name}</td>
                        <td className="py-3 px-4 border-b text-center">{category.count} টি</td>
                      </motion.tr>
                    ))}
                    <tr className="bg-green-50 font-semibold">
                      <td className="py-3 px-4 border-b text-center" colSpan="2">
                        মোট বই
                      </td>
                      <td className="py-3 px-4 border-b text-center">১৫৫০ টি</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Library Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-yellow-50 p-6 rounded-lg mt-8"
          >
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">
              গ্রন্থাগার সময়সূচী ও নিয়মাবলী
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-700 mb-2">সময়সূচী:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>রবি থেকে বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০</li>
                  <li>শুক্রবার: বন্ধ</li>
                  <li>বিজ্ঞাপিত ছুটির দিন: বন্ধ</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-700 mb-2">নিয়মাবলী:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>গ্রন্থাগারে প্রবেশের পূর্বে জুতা/স্যান্ডেল বাইরে রাখতে হবে</li>
                  <li>খাবার নিয়ে গ্রন্থাগারে প্রবেশ করা নিষেধ</li>
                  <li>বই সাবধানে ব্যবহার করতে হবে</li>
                  <li>নির্দিষ্ট সময়ের মধ্যে বই ফেরত দিতে হবে</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modal for Item Details */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">{selectedItem.name}</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="text-center text-5xl my-4">{selectedItem.icon}</div>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">পরিমাণ:</span> {selectedItem.quantity}
                </p>
                {selectedItem.description && (
                  <p>
                    <span className="font-semibold">বিবরণ:</span> {selectedItem.description}
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-800 text-white text-center p-4">
          <p>{schoolInfo?.schoolName_bn} © {new Date().getFullYear()}</p>
          <p>জ্ঞানার্জনে আমাদের অঙ্গীকার</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Library;
