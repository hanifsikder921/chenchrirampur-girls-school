import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ScienceLab = () => {
  const [activeTab, setActiveTab] = useState('physics');
  const [selectedItem, setSelectedItem] = useState(null);

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

  const scienceEquipment = {
    physics: [
      {
        id: 1,
        name: 'স্লাইড ক্যালিপার্স',
        quantity: '০১ টি',
        comment: 'দৈর্ঘ্য পরিমাপের জন্য',
        icon: '📏',
      },
      { id: 2, name: 'জু গজ', quantity: '০১ টি', comment: 'ছোট দৈর্ঘ্য পরিমাপ', icon: '📐' },
      {
        id: 3,
        name: 'আয়তকার কাঁচ ফলক',
        quantity: '০১ টি',
        comment: 'আলোক পরীক্ষার জন্য',
        icon: '🔲',
      },
      { id: 5, name: 'মিটার স্কেল', quantity: '০১ টি', comment: 'দৈর্ঘ্য পরিমাপ', icon: '📏' },
      { id: 6, name: 'শলাকা চুম্বক', quantity: '০২ টি', comment: 'চুম্বকত্ব পরীক্ষা', icon: '🧲' },
      { id: 7, name: 'মাপ চোঙ', quantity: '০২ টি', comment: 'তরল পরিমাপ', icon: '🧪' },
    ],
    chemistry: [
      {
        id: 11,
        name: 'পরীক্ষা নল',
        quantity: '৫০ টি',
        comment: 'রাসায়নিক পরীক্ষার জন্য',
        icon: '🧪',
      },
      {
        id: 12,
        name: 'HCL এসিড',
        quantity: 'পরিমান মত',
        comment: 'রাসায়নিক বিক্রিয়া',
        icon: '⚠️',
      },
      {
        id: 13,
        name: 'H2SO4 এসিড',
        quantity: 'পরিমান মত',
        comment: 'রাসায়নিক বিক্রিয়া',
        icon: '⚠️',
      },
      {
        id: 14,
        name: 'CaCO3 (চুনাপাথর)',
        quantity: 'পরিমান মত',
        comment: 'রাসায়নিক বিক্রিয়া',
        icon: '⛰️',
      },
      {
        id: 10,
        name: 'স্প্রিট ল্যাম্প',
        quantity: '০২ টি',
        comment: 'তাপ প্রদানের জন্য',
        icon: '🔥',
      },
    ],
    biology: [
      { id: 15, name: 'মাইক্রোস্কোপ', quantity: '০১ টি', comment: 'অণুজীব পর্যবেক্ষণ', icon: '🔬' },
      { id: 16, name: 'ট্রে', quantity: '০১ টি', comment: 'নমুনা রাখার জন্য', icon: '🛒' },
      {
        id: 17,
        name: 'ডিসেনটিন বক্স',
        quantity: '০১ টি',
        comment: 'শারীরবৃত্তীয় পরীক্ষা',
        icon: '📦',
      },
      { id: 8, name: 'নিক্তি', quantity: '০১ টি', comment: 'ভর পরিমাপ', icon: '⚖️' },
      { id: 9, name: 'প্রিজম', quantity: '০১ টি', comment: 'আলোক বিচ্ছুরণ', icon: '🔺' },
    ],
  };

  const LabItemCard = ({ item }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer border border-gray-200 hover:border-blue-300 transition-all"
      onClick={() => setSelectedItem(item)}
    >
      <div className="flex items-start">
        <span className="text-3xl mr-3">{item.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
          <p className="text-gray-600">পরিমাণ: {item.quantity}</p>
          <p className="text-gray-600">
            বিষয়:{' '}
            {activeTab === 'physics'
              ? 'পদার্থ বিজ্ঞান'
              : activeTab === 'chemistry'
              ? 'রসায়ন বিজ্ঞান'
              : 'জীব বিজ্ঞান'}
          </p>
          {item.comment && <p className="text-sm text-gray-500 mt-1">{item.comment}</p>}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-2"
          >
            চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয়
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-semibold mb-4"
          >
            বিজ্ঞানাগার
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg"
          >
            পরীক্ষণের মাধ্যমে শেখা
          </motion.p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('physics')}
            className={`py-4 px-6 font-medium text-lg flex items-center ${
              activeTab === 'physics'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            <span className="mr-2">⚛️</span> পদার্থ বিজ্ঞান
          </button>
          <button
            onClick={() => setActiveTab('chemistry')}
            className={`py-4 px-6 font-medium text-lg flex items-center ${
              activeTab === 'chemistry'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            <span className="mr-2">🧪</span> রসায়ন বিজ্ঞান
          </button>
          <button
            onClick={() => setActiveTab('biology')}
            className={`py-4 px-6 font-medium text-lg flex items-center ${
              activeTab === 'biology'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            <span className="mr-2">🔬</span> জীব বিজ্ঞান
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {activeTab === 'physics'
                ? 'পদার্থ বিজ্ঞান সরঞ্জাম'
                : activeTab === 'chemistry'
                ? 'রসায়ন বিজ্ঞান সরঞ্জাম'
                : 'জীব বিজ্ঞান সরঞ্জাম'}
            </h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              {scienceEquipment[activeTab].map((item) => (
                <LabItemCard key={item.id} item={item} />
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
                      আসবাব পত্রের বিবরণ
                    </th>
                    <th className="py-3 px-4 border-b text-center font-semibold text-gray-700">
                      পরিমাণ
                    </th>
                    <th className="py-3 px-4 border-b text-center font-semibold text-gray-700">
                      বিষয়
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scienceEquipment[activeTab].map((item, index) => (
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
                      <td className="py-3 px-4 border-b text-center">
                        {activeTab === 'physics'
                          ? 'পদার্থ বিজ্ঞান'
                          : activeTab === 'chemistry'
                          ? 'রসায়ন বিজ্ঞান'
                          : 'জীব বিজ্ঞান'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Lab Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 p-6 rounded-lg mt-8"
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-3">বিজ্ঞানাগার সম্পর্কে</h3>
            <p className="text-gray-700">
              আমাদের বিজ্ঞানাগার আধুনিক সরঞ্জামে সজ্জিত, যেখানে শিক্ষার্থীরা হাতে-কলমে
              পরীক্ষা-নিরীক্ষার মাধ্যমে বিজ্ঞানের বিভিন্ন তত্ত্ব ও সূত্র সম্পর্কে গভীরভাবে বুঝতে
              পারে। বিজ্ঞানাগারে নিরাপত্তা বিধি মেনে পরীক্ষা-নিরীক্ষা করা হয় এবং সকল প্রয়োজনীয়
              সরঞ্জাম নিয়মিত রক্ষণাবেক্ষণ করা হয়।
            </p>
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
                <p>
                  <span className="font-semibold">বিষয়:</span>{' '}
                  {activeTab === 'physics'
                    ? 'পদার্থ বিজ্ঞান'
                    : activeTab === 'chemistry'
                    ? 'রসায়ন বিজ্ঞান'
                    : 'জীব বিজ্ঞান'}
                </p>
                {selectedItem.comment && (
                  <p>
                    <span className="font-semibold">ব্যবহার:</span> {selectedItem.comment}
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-800 text-white text-center p-4">
          <p>চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয় © {new Date().getFullYear()}</p>
          <p>বিজ্ঞান চর্চায় আমরা অগ্রগামী</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ScienceLab;
