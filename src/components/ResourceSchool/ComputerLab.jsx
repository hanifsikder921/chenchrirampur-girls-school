import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';

const ComputerLab = () => {
  const [activeTab, setActiveTab] = useState('overview');
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

  const equipmentList = [
    { name: 'ল্যাপটপ', quantity: 17, icon: '💻' },
    { name: 'চেয়ার', quantity: 33, icon: '🪑' },
    { name: 'টেবিল', quantity: 17, icon: '🪟' },
    { name: 'প্রিন্টার', quantity: 1, icon: '🖨️' },
    { name: 'স্ক্যানার', quantity: 1, icon: '🏿' },
    { name: 'সিসি ক্যামেরা', quantity: 1, icon: '📹' },
    { name: 'আলমারি', quantity: 1, icon: '🗄️' },
    { name: '৫৫ ইঞ্চি মনিটর', quantity: 1, icon: '📺' },
    { name: 'রাউটার', quantity: 1, icon: '🛜' },
    { name: 'রাউটার অনু', quantity: 1, icon: '📡 ' },
    { name: 'ওয়েব ক্যাম', quantity: 1, icon: '📷' },
    { name: 'অগ্নিনির্বাপক', quantity: 1, icon: '💥' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-2"
          >
            {schoolInfo?.schoolName_bn}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-semibold mb-4"
          >
            ডিজিটাল ল্যাব
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg"
          >
            আধুনিক প্রযুক্তির মাধ্যমে শিক্ষার গুণগত মান উন্নয়ন
          </motion.p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 font-medium text-lg ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            ল্যাব পরিচিতি
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`py-4 px-6 font-medium text-lg ${
              activeTab === 'equipment'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            ল্যাব সরঞ্জাম
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-6 font-medium text-lg ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            অন্যান্য তথ্য
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
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">বিদ্যালয় সম্পর্কে</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b border-blue-100 py-2">
                      <span className="font-medium">বিদ্যালয়ের নাম:</span>
                      <span>{schoolInfo?.schoolName_bn}</span>
                    </li>
                    <li className="flex justify-between border-b border-blue-100 py-2">
                      <span className="font-medium">ইউআইআইএন:</span>
                      <span>{schoolInfo?.EIIN}</span>
                    </li>
                    <li className="flex justify-between border-b border-blue-100 py-2">
                      <span className="font-medium">প্রতিষ্ঠার সন:</span>
                      <span>{schoolInfo?.establishedYear} ইং</span>
                    </li>
                    <li className="flex justify-between border-b border-blue-100 py-2">
                      <span className="font-medium">এমপিও কোড:</span>
                      <span>{schoolInfo.MPOCode}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-3">ল্যাব সম্পর্কে</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b border-indigo-100 py-2">
                      <span className="font-medium">ল্যাবের নাম:</span>
                      <span>ডিজিটাল ল্যাব</span>
                    </li>
                    <li className="flex justify-between border-b border-indigo-100 py-2">
                      <span className="font-medium">স্মারক নং:</span>
                      <span className="text-sm">৫৬.০৪.০০০০.০০১.১৮.০৫৯.২১.১৪৯০</span>
                    </li>
                    <li className="flex justify-between border-b border-indigo-100 py-2">
                      <span className="font-medium">ল্যাব প্রাপ্তির তারিখ:</span>
                      <span>২১ সেপ্টেম্বর ২০২১</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  ল্যাবের বর্তমান অবস্থা
                </h3>
                <p className="text-gray-700">
                  ল্যাবটি সার্বক্ষনিক সিসি ক্যামেরা দ্বারা মনিটরিং করা হয়। ল্যাব পাওয়ার পর থেকে
                  ল্যাবটি সফল ভাবে চালু রয়েছে। আধুনিক এই ল্যাবের মাধ্যমে শিক্ষার্থীরা প্রযুক্তিগত
                  শিক্ষা গ্রহণ করে নিজেদেরকে ডিজিটাল যুগের জন্য প্রস্তুত করছে।
                </p>
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
                ল্যাবের মালামাল তালিকা
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {equipmentList.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-md text-center"
                  >
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <h4 className="font-semibold text-lg text-gray-800">{item.name}</h4>
                    <p className="text-gray-600">সংখ্যা: {item.quantity} টি</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 border-b text-right font-semibold text-gray-700">
                        ক্রমিক নং
                      </th>
                      <th className="py-3 px-4 border-b text-right font-semibold text-gray-700">
                        সরঞ্জামের নাম
                      </th>
                      <th className="py-3 px-4 border-b text-right font-semibold text-gray-700">
                        পরিমাণ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentList.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 border-b text-center">{index + 1}</td>
                        <td className="py-3 px-4 border-b text-right">{item.name}</td>
                        <td className="py-3 px-4 border-b text-center">{item.quantity} টি</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">
                  ল্যাব ব্যবহারের নিয়মাবলী
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>ল্যাবে প্রবেশের পূর্বে জুতা/স্যান্ডেল ল্যাবের বাইরে রাখতে হবে</li>
                  <li>খাবার নিয়ে ল্যাবে প্রবেশ করা নিষেধ</li>
                  <li>কম্পিউটার ও অন্যান্য সরঞ্জাম সাবধানে ব্যবহার করতে হবে</li>
                  <li>অনুমতি ছাড়া কোনো সফটওয়্যার ইন্সটল করা যাবে না</li>
                  <li>ব্যক্তিগত ডিভাইস ব্যবহারের জন্য অনুমতি নিতে হবে</li>
                  <li>ল্যাব থেকে কোনো সরঞ্জাম বাইরে নিয়ে যাওয়া যাবে না</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-yellow-800 mb-3">ল্যাব সময়সূচী</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex justify-between border-b border-yellow-100 py-2">
                      <span>রবি থেকে বৃহস্পতিবার:</span>
                      <span>সকাল ৯:০০ - বিকাল ৪:০০</span>
                    </li>
                    <li className="flex justify-between border-b border-yellow-100 py-2">
                      <span>শুক্রবার:</span>
                      <span>বন্ধ</span>
                    </li>
                    <li className="flex justify-between border-b border-yellow-100 py-2">
                      <span>বিজ্ঞাপিত ছুটির দিন:</span>
                      <span>বন্ধ</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-pink-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-pink-800 mb-3">
                    দায়িত্বপ্রাপ্ত শিক্ষক
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="border-b border-pink-100 py-2">প্রধান শিক্ষক/শিক্ষিকা</li>
                    <li className="border-b border-pink-100 py-2">সহকারী শিক্ষক (আইসিটি)</li>
                    <li className="border-b border-pink-100 py-2">ল্যাব সহকারী</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white text-center p-4">
          <p>{schoolInfo?.schoolName_bn} © {new Date().getFullYear()}</p>
          <p>ডিজিটাল বাংলাদেশ বিনির্মাণে অগ্রগামী</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ComputerLab;
