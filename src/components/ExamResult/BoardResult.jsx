import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const BoardResult = () => {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [roll, setRoll] = useState('');
  const [regNo, setRegNo] = useState('');

  const boards = [
    { value: '', name: 'বোর্ড নির্বাচন করুন' },
    { value: 'dhaka', name: 'ঢাকা' },
    { value: 'comilla', name: 'কুমিল্লা' },
    { value: 'rajshahi', name: 'রাজশাহী' },
    { value: 'jessore', name: 'যশোর' },
    { value: 'chittagong', name: 'চট্টগ্রাম' },
    { value: 'barisal', name: 'বরিশাল' },
    { value: 'sylhet', name: 'সিলেট' },
    { value: 'dinajpur', name: 'দিনাজপুর' },
    { value: 'madrasah', name: 'মাদ্রাসা' },
    { value: 'technical', name: 'কারিগরি' },
  ];

  const exams = [
    { value: '', name: 'পরীক্ষা নির্বাচন করুন' },
    { value: 'ssc', name: 'এসএসসি' },
    { value: 'hsc', name: 'এইচএসসি' },
    { value: 'jsc', name: 'জেএসসি' },
    { value: 'dakhil', name: 'দাখিল' },
    { value: 'alim', name: 'আলিম' },
  ];

  const years = [
    { value: '', name: 'সাল নির্বাচন করুন' },
    { value: '2023', name: '২০২৩' },
    { value: '2022', name: '২০২২' },
    { value: '2021', name: '২০২১' },
    { value: '2020', name: '২০২০' },
    { value: '2019', name: '২০১৯' },
  ];

  const handleOpenResult = () => {
    if (!selectedBoard || !selectedExam || !selectedYear || !roll) {
      alert('দয়া করে সকল প্রয়োজনীয় তথ্য প্রদান করুন');
      return;
    }

    // education board results ওয়েবসাইটে রিডাইরেক্ট করবে
    window.open(`http://www.educationboardresults.gov.bd/`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800">বোর্ড পরীক্ষার ফলাফল</h2>
          <p className="text-gray-600 mt-2">শিক্ষা বোর্ডের অফিসিয়াল ওয়েবসাইট থেকে ফলাফল দেখুন</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 flex items-start">
            <FaExclamationTriangle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">মনে রাখুন</p>
              <p className="text-sm">
                সরাসরি ওয়েবসাইটে ফলাফল দেখতে হবে, কারণ educationboardresults.gov.bd ওয়েবসাইটটি
                iframe এ দেখানোর অনুমতি না দেয়ার কারনে আমরা ফলাফল টি এখানে দেখাতে পারছি না ফলাফল দেখার জন্য নিচে দেয়া ফলাফল দেখুন বাটনে ক্লিক করুন অথবা সরাসরি লিংকে ক্লিক করুন।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">বোর্ড</label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {boards.map((board) => (
                  <option key={board.value} value={board.value}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পরীক্ষার ধরণ</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {exams.map((exam) => (
                  <option key={exam.value} value={exam.value}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">বছর</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">রোল নম্বর</label>
              <input
                type="text"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="রোল নম্বর লিখুন"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenResult}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              <FaExternalLinkAlt />
              ফলাফল দেখুন
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaSearch />
            ফলাফল দেখার নির্দেশিকা
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>উপরে আপনার বোর্ড, পরীক্ষার ধরণ, বছর এবং রোল নম্বর নির্বাচন করুন</li>
            <li>"ফলাফল দেখুন" বাটনে ক্লিক করুন</li>
            <li>এটি আপনাবে educationboardresults.gov.bd ওয়েবসাইটে নিয়ে যাবে</li>
            <li>সেই পৃষ্ঠায় প্রয়োজনীয় তথ্য প্রদান করে ফলাফল দেখুন</li>
          </ol>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">সরাসরি লিঙ্ক:</p>
            <a
              href="http://www.educationboardresults.gov.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-words inline-flex items-center gap-1 mt-2"
            >
              http://www.ededucationboardresults.gov.bd/
              <FaExternalLinkAlt className="text-sm" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BoardResult;
