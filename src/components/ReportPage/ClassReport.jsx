import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { FiUsers, FiBook, FiBarChart2, FiPieChart, FiDownload } from 'react-icons/fi';
import useAxios from '../../assets/hooks/useAxios';

const ClassReport = () => {
  const axios = useAxios();
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('bar'); // 'bar' or 'pie'

  // Fetch class-wise student statistics
  const fetchClassStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/students/stats/class-wise');

      if (response.data.success) {
        // Sort classes numerically (1, 2, 3, ... 10) instead of alphabetically
        const sortedData = response.data.data.sort((a, b) => {
          return parseInt(a.className) - parseInt(b.className);
        });

        setClassData(sortedData);
      } else {
        setError('Failed to fetch class statistics');
      }
    } catch (error) {
      console.error('Error fetching class stats:', error);
      setError('Error loading class report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassStats();
  }, []);

  // Prepare data for charts
  const chartData = classData.map((item) => ({
    name: `Class ${item.className}`,
    className: item.className,
    total: item.totalStudents,
    male: item.maleStudents,
    female: item.femaleStudents,
  }));

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">Total: {payload[0].payload.total}</p>
          <p className="text-green-600">Male: {payload[0].payload.male}</p>
          <p className="text-pink-600">Female: {payload[0].payload.female}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-gray-600">Students: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate total students
  const totalStudents = classData.reduce((sum, item) => sum + item.totalStudents, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-800 text-lg mb-2">Error Loading Report</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchClassStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Class-wise Student Report</h1>
          <p className="text-gray-600">Distribution of students across different classes</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FiBook className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{classData.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FiBarChart2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average per Class</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classData.length > 0 ? Math.round(totalStudents / classData.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
              Student Distribution
            </h2>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('bar')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  viewMode === 'bar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiBarChart2 className="mr-2" />
                Bar Chart
              </button>
              <button
                onClick={() => setViewMode('pie')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  viewMode === 'pie'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiPieChart className="mr-2" />
                Pie Chart
              </button>
            </div>
          </div>

          <div className="h-96">
            {viewMode === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="male" name="Male Students" fill="#3B82F6" />
                  <Bar dataKey="female" name="Female Students" fill="#EC4899" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Detailed Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Class-wise Details</h2>
           
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Male
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Female
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Class {item.className}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {item.maleStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600">
                      {item.femaleStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {totalStudents > 0
                        ? ((item.totalStudents / totalStudents) * 100).toFixed(1)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassReport;
