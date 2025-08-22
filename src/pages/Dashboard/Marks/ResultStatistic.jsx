import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaRedo,
  FaChartPie,
  FaChartBar,
  FaSchool,
  FaCalendarAlt,
  FaBook,
  FaUserGraduate,
  FaTrophy,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import useAxios from '../../../assets/hooks/useAxios';

const ResultStatistic = () => {
  const axios = useAxios();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedExamYear, setSelectedExamYear] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [allClassComparison, setAllClassComparison] = useState([]);
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

  // পাস/ফেল নির্ধারণের ফাংশন
  const isPassedStudent = (student) => {
    const cgpa = parseFloat(student.cgpa);
    return cgpa >= 1.0; // 1.0 এর উপরে পাস
  };

  // একটি ক্লাসের পরিসংখ্যান গণনা
  const calculateClassStatistics = (classMarks) => {
    const totalStudents = classMarks.length;
    const passedStudents = classMarks.filter(isPassedStudent).length;
    const failedStudents = totalStudents - passedStudents;
    const passPercentage =
      totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(2) : 0;

    return {
      totalStudents,
      passedStudents,
      failedStudents,
      passPercentage: parseFloat(passPercentage),
    };
  };

  // গ্রেড ভিত্তিক পরিসংখ্যান
  const calculateGradeStatistics = (classMarks) => {
    const gradeCount = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, F: 0 };

    classMarks.forEach((student) => {
      const cgpa = parseFloat(student.cgpa);
      if (cgpa >= 5.0) gradeCount['A+']++;
      else if (cgpa >= 4.0) gradeCount['A']++;
      else if (cgpa >= 3.5) gradeCount['B']++;
      else if (cgpa >= 2.0) gradeCount['C']++;
      else if (cgpa >= 1.0) gradeCount['D']++;
      else gradeCount['F']++;
    });

    return Object.entries(gradeCount).map(([grade, count]) => ({
      grade,
      count,
      percentage: classMarks.length > 0 ? ((count / classMarks.length) * 100).toFixed(1) : 0,
    }));
  };

  const handleSearch = () => {
    if (!selectedExamType || !selectedExamYear) {
      alert('দয়া করে পরীক্ষার ধরণ এবং শিক্ষাবর্ষ নির্বাচন করুন');
      return;
    }

    if (comparisonMode) {
      // সব ক্লাসের তুলনা
      const classComparison = availableOptions.classes
        .map((className) => {
          const classMarks = marks.filter(
            (mark) =>
              mark.classesName === className &&
              mark.examType === selectedExamType &&
              mark.examYear === selectedExamYear
          );

          const stats = calculateClassStatistics(classMarks);
          return {
            className,
            ...stats,
          };
        })
        .filter((item) => item.totalStudents > 0);

      setAllClassComparison(classComparison);
      setStatistics(null);
    } else {
      // নির্দিষ্ট ক্লাসের পরিসংখ্যান
      if (!selectedClass) {
        alert('দয়া করে শ্রেণি নির্বাচন করুন');
        return;
      }

      const classMarks = marks.filter(
        (mark) =>
          mark.classesName === selectedClass &&
          mark.examType === selectedExamType &&
          mark.examYear === selectedExamYear
      );

      if (classMarks.length === 0) {
        alert('কোন ডেটা পাওয়া যায়নি');
        return;
      }

      const basicStats = calculateClassStatistics(classMarks);
      const gradeStats = calculateGradeStatistics(classMarks);

      setStatistics({
        ...basicStats,
        gradeStatistics: gradeStats,
        selectedClass,
        selectedExamType,
        selectedExamYear,
      });
      setAllClassComparison([]);
    }
  };

  const resetForm = () => {
    setSelectedClass('');
    setSelectedExamType('');
    setSelectedExamYear('');
    setStatistics(null);
    setAllClassComparison([]);
    setComparisonMode(false);
  };

  // চার্টের রং
  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];
  const GRADE_COLORS = {
    'A+': '#10B981',
    A: '#22C55E',
    B: '#3B82F6',
    C: '#F59E0B',
    D: '#F97316',
    F: '#EF4444',
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
            <FaChartPie className="text-blue-600" />
            ফলাফল পরিসংখ্যান
          </h1>
          <p className="text-gray-600 mt-2">পাস/ফেল এবং গ্রেডভিত্তিক বিশ্লেষণ দেখুন</p>
        </div>

        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          {/* Mode Toggle */}
          <div className="mb-6 flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setComparisonMode(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  !comparisonMode
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                একক ক্লাস বিশ্লেষণ
              </button>
              <button
                onClick={() => setComparisonMode(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  comparisonMode
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                সব ক্লাস তুলনা
              </button>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 ${
              comparisonMode ? 'md:grid-cols-2' : 'md:grid-cols-3'
            } gap-4 mb-6`}
          >
            {!comparisonMode && (
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
                      ক্লাস {cls}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
              পরিসংখ্যান দেখুন
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

        {/* Statistics Display */}
        <AnimatePresence>
          {/* Single Class Statistics */}
          {statistics && !comparisonMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUserGraduate className="text-blue-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">মোট পরীক্ষার্থী</p>
                      <p className="text-2xl font-bold text-gray-800">{statistics.totalStudents}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaTrophy className="text-green-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">পাসের সংখ্যা</p>
                      <p className="text-2xl font-bold text-green-600">
                        {statistics.passedStudents}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full">
                      <FaExclamationTriangle className="text-red-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">ফেলের সংখ্যা</p>
                      <p className="text-2xl font-bold text-red-600">{statistics.failedStudents}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FaChartPie className="text-yellow-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">পাসের হার</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {statistics.passPercentage}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pass/Fail Pie Chart */}
                <motion.div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartPie className="text-blue-500" />
                    পাস/ফেল অনুপাত
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'পাস', value: statistics.passedStudents },
                          { name: 'ফেল', value: statistics.failedStudents },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill={COLORS[0]} />
                        <Cell fill={COLORS[1]} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Grade Distribution Bar Chart */}
                <motion.div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartBar className="text-green-500" />
                    গ্রেড বণ্টন
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statistics.gradeStatistics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [value, name === 'count' ? 'সংখ্যা' : 'শতাংশ']}
                      />
                      <Bar dataKey="count" name="count">
                        {statistics.gradeStatistics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.grade]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* All Classes Comparison */}
          {allClassComparison.length > 0 && comparisonMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Comparison Bar Chart */}
              <motion.div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaChartBar className="text-blue-500" />
                  সকল ক্লাসের পাসের হার তুলনা
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={allClassComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="className"
                      label={{ value: 'ক্লাস', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis label={{ value: 'পাসের হার (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'passPercentage' ? `${value}%` : value,
                        name === 'passPercentage'
                          ? 'পাসের হার'
                          : name === 'totalStudents'
                          ? 'মোট শিক্ষার্থী'
                          : name === 'passedStudents'
                          ? 'পাস'
                          : 'ফেল',
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="passPercentage" fill="#10B981" name="passPercentage" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Detailed Comparison Table */}
              <motion.div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaSchool className="text-purple-500" />
                  বিস্তারিত তুলনা
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-3 font-medium">ক্লাস</th>
                        <th className="p-3 font-medium">মোট পরীক্ষার্থী</th>
                        <th className="p-3 font-medium">পাস</th>
                        <th className="p-3 font-medium">ফেল</th>
                        <th className="p-3 font-medium">পাসের হার</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allClassComparison
                        .sort((a, b) => b.passPercentage - a.passPercentage)
                        .map((classData, index) => (
                          <tr
                            key={classData.className}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="p-3 font-medium">ক্লাস {classData.className}</td>
                            <td className="p-3 text-center">{classData.totalStudents}</td>
                            <td className="p-3 text-center text-green-600 font-semibold">
                              {classData.passedStudents}
                            </td>
                            <td className="p-3 text-center text-red-600 font-semibold">
                              {classData.failedStudents}
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${
                                  classData.passPercentage >= 80
                                    ? 'bg-green-100 text-green-800'
                                    : classData.passPercentage >= 60
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {classData.passPercentage}%
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResultStatistic;
