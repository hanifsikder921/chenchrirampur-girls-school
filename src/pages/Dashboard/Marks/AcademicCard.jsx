import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaRedo,
  FaUserGraduate,
  FaSchool,
  FaCalendarAlt,
  FaIdCard,
  FaChartLine,
  FaBook,
  FaPrint,
} from 'react-icons/fa';

import { useQuery } from '@tanstack/react-query';
import { GrUserFemale } from 'react-icons/gr';
import { GiNurseMale } from 'react-icons/gi';
import { LiaLayerGroupSolid, LiaBirthdayCakeSolid } from 'react-icons/lia';
import useAxios from '../../../assets/hooks/useAxios';

const AcademicCard = () => {
  const modalContentRef = React.useRef();
  const axios = useAxios();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedExamYear, setSelectedExamYear] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [availableOptions, setAvailableOptions] = useState({
    classes: [],
    examTypes: [],
    examYears: [],
  });

  const {
    data: marks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['marks'],
    queryFn: async () => {
      const res = await axios.get('/marks');
      return res.data;
    },
  });

  useEffect(() => {
    if (marks.length > 0) {
      const classes = [...new Set(marks.map((item) => item.classesName))].sort();
      const examTypes = [...new Set(marks.map((item) => item.examType))];
      const examYears = [...new Set(marks.map((item) => item.examYear))].sort((a, b) => b - a);

      setAvailableOptions({
        classes,
        examTypes,
        examYears,
      });
    }
  }, [marks]);

  const handleSearch = () => {
    if (!selectedClass || !selectedExamType || !selectedExamYear) {
      alert('দয়া করে সকল ফিল্ড পূরণ করুন');
      return;
    }

    const results = marks
      .filter(
        (mark) =>
          mark.classesName === selectedClass &&
          mark.examType === selectedExamType &&
          mark.examYear === selectedExamYear
      )
      .sort((a, b) => a.roll - b.roll);

    if (results.length > 0) {
      setFilteredResults(results);
    } else {
      alert('কোন রেজাল্ট পাওয়া যায়নি');
      setFilteredResults([]);
    }
  };

  const resetForm = () => {
    setSelectedClass('');
    setSelectedExamType('');
    setSelectedExamYear('');
    setFilteredResults([]);
  };

  // Grade থেকে রং বের করার ফাংশন
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
        return 'bg-green-100 text-green-800';
      case 'A':
        return 'bg-green-50 text-green-700';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    const printContent = modalContentRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
        <strong className="font-bold">ত্রুটি! </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <FaUserGraduate className="text-blue-600" />
            একাডেমিক রিপোর্ট কার্ড (সম্পূর্ণ ক্লাস)
          </h1>
          <p className="text-gray-600 mt-2">
            সম্পূর্ণ ক্লাসের পরীক্ষার ফলাফল দেখুন এবং প্রিন্ট করুন
          </p>
        </div>

        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FaSchool className="text-blue-500" />
                শ্রেণি
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">শ্রেণি নির্বাচন করুন</option>
                {availableOptions.classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FaBook className="text-blue-500" />
                পরীক্ষার ধরণ
              </label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">পরীক্ষার ধরণ নির্বাচন করুন</option>
                {availableOptions.examTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FaCalendarAlt className="text-blue-500" />
                শিক্ষাবর্ষ
              </label>
              <select
                value={selectedExamYear}
                onChange={(e) => setSelectedExamYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">শিক্ষাবর্ষ নির্বাচন করুন</option>
                {availableOptions.examYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              <FaSearch />
              সম্পূর্ণ ক্লাসের ফলাফল খুঁজুন
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              <FaRedo />
              রিসেট করুন
            </motion.button>
          </div>
        </motion.div>

        {/* Results Display */}
        <AnimatePresence>
          {filteredResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg mb-8"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      ক্লাস {selectedClass} - {selectedExamType} ({selectedExamYear})
                    </h2>
                    <p className="text-gray-600">মোট শিক্ষার্থী: {filteredResults.length} জন</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    <FaPrint />
                    সব প্রিন্ট করুন
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Print Content */}
        <div ref={modalContentRef}>
          {filteredResults.map((result, studentIndex) => (
            <motion.div
              key={`${result._id}-${studentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: studentIndex * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 break-after-page"
              style={{ pageBreakAfter: 'always' }}
            >
              {/* Header Section */}
              <div className="md:bg-gradient-to-r md:from-blue-600 md:to-indigo-700 text-white md:p-6 text-center">
                <h2 className="text-2xl font-bold mb-2 text-black md:text-white">
                  চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয়
                </h2>
                <p className="opacity-90 text-gray-800 md:text-white">একাডেমিক রিপোর্ট কার্ড</p>
                <div className="mt-2 flex justify-center">
                  <div className="bg-white text-blue-800 font-bold py-1 px-4 rounded-full text-sm">
                    {result.examYear} শিক্ষাবর্ষ
                  </div>
                </div>
              </div>

              {/* Student Info Section */}
              <div className="md:p-6 p-2 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUserGraduate className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ছাত্র/ছাত্রীর নাম</p>
                      <p className="font-semibold">{result.studentName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <FaIdCard className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">রোল নম্বর</p>
                      <p className="font-semibold">{result.roll}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <GiNurseMale className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">পিতার নাম</p>
                      <p className="font-semibold">{result.fatherName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <GrUserFemale className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">মাতার নাম</p>
                      <p className="font-semibold">{result.motherName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaSchool className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">শ্রেণি</p>
                      <p className="font-semibold">
                        {result.classesName === '6'
                          ? 'Six'
                          : result.classesName === '7'
                          ? 'Seven'
                          : result.classesName === '8'
                          ? 'Eight'
                          : result.classesName === '9'
                          ? 'Nine'
                          : result.classesName === '10'
                          ? 'Ten'
                          : result.classesName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-3 rounded-full">
                      <FaChartLine className="text-sky-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CGPA</p>
                      <p className="font-semibold">{result.cgpa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <LiaLayerGroupSolid className="text-amber-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">গ্রুপ</p>
                      <p className="font-semibold">{result.group === '' ? 'N/A' : result.group}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <LiaBirthdayCakeSolid className="text-amber-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">জন্ম তারিখ</p>
                      <p className="font-semibold">{result.dob === '' ? 'N/A' : result.dob}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaBook className="text-blue-500" />
                  বিষয়ভিত্তিক নম্বর
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-3 font-medium">বিষয়</th>
                        <th className="p-3 font-medium">পূর্ণমান</th>
                        <th className="p-3 font-medium">প্রাপ্ত নম্বর</th>
                        <th className="p-3 font-medium">গ্রেড</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.subjects.map((subject, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3 font-medium">{subject.subject}</td>
                          <td className="p-3 text-center">
                            {subject.fullMark.$numberInt || subject.fullMark}
                          </td>
                          <td className="p-3 text-center">
                            {subject.obtained.$numberInt || subject.obtained}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`inline-block py-1 px-3 rounded-full text-xs font-semibold ${getGradeColor(
                                subject.grade
                              )}`}
                            >
                              {subject.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AcademicCard;
