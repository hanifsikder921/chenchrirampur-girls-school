import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPrinter, FiDownload, FiUsers, FiSearch, FiFilter } from 'react-icons/fi';
import useAxios from '../../assets/hooks/useAxios';

const StudentReport = () => {
  const axios = useAxios();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get('/students/stats/class-wise');
      if (response.data.success) {
        const classNames = response.data.data.map((item) => item.className);
        setClasses(classNames.sort((a, b) => parseInt(a) - parseInt(b)));
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes');
    }
  };

  // Fetch students by selected class and filter by academic year
  const fetchStudents = async () => {
    if (!selectedClass || !selectedYear) return;

    try {
      setLoading(true);
      setError('');

      const response = await axios.get('/students/by-class', {
        params: { className: selectedClass, status: 'active' },
      });

      if (response.data.success) {
        const filteredStudents = response.data.data.filter(
          (student) => student.academicYear === selectedYear
        );
        setStudents(filteredStudents);
      } else {
        setError('Failed to fetch students');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Error loading student data');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch academic years for selected class
  const fetchAcademicYears = async () => {
    if (!selectedClass) return;

    try {
      const response = await axios.get('/students/by-class', {
        params: { className: selectedClass, status: 'active' },
      });

      const studentsData = response.data.data || [];

      const years = [
        ...new Set(studentsData.map((student) => student.academicYear).filter(Boolean)),
      ];

      setYears(years.sort());
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAcademicYears();
      setSelectedYear(''); // Reset selected year when class changes
      setStudents([]);
    }
  }, [selectedClass]);

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Report</h1>
          <p className="text-gray-600">
            Generate and print student lists by class and academic year
          </p>
        </motion.div>

        {/* Selection Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200 print:hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Class Selection */}
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a class</option>
                {classes.map((className) => (
                  <option key={className} value={className}>
                    Class {className}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year Selection */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Select Academic Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose academic year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Button */}
            <div className="flex items-end">
              <button
                onClick={fetchStudents}
                disabled={!selectedClass || !selectedYear || loading}
                className="w-full inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <FiSearch className="mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-md p-4 mb-6"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {students.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 print:shadow-none print:border-0"
          >
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 print:mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Class {selectedClass} - {selectedYear}
                </h2>
                <p className="text-gray-600">Total Students: {students.length}</p>
              </div>
              <button
                onClick={handlePrint}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 print:hidden"
              >
                <FiPrinter className="mr-2" />
                Print Report
              </button>
            </div>

            {/* Student Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 print:min-w-full">
                <thead className="bg-gray-50 print:bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:px-2 print:py-2">
                      Roll
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:px-2 print:py-2">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:px-2 print:py-2">
                      Group/Section
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:px-2 print:py-2">
                      Academic Year
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:px-2 print:py-2">
                      Father's Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:px-2 print:py-2">
                      Mother's Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:px-2 print:py-2">
                      Parent Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr
                      key={student._id?.$oid || index}
                      className="hover:bg-gray-50 print:hover:bg-white"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 print:px-2 print:py-2">
                        {student.roll}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:px-2 print:py-2">
                        {student.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:px-2 print:py-2">
                        {student.section || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:px-2 print:py-2">
                        {student.academicYear}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:px-2 print:py-2">
                        {student.fatherName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:px-2 print:py-2">
                        {student.motherName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:px-2 print:py-2">
                        {student.parentContact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Report Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 print:mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">
                    Generated on: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Records: {students.length}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && students.length === 0 && selectedClass && selectedYear && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center"
          >
            <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">
              No students found for Class {selectedClass} in academic year {selectedYear}.
            </p>
          </motion.div>
        )}

        {/* Initial State */}
        {!selectedClass && !selectedYear && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center"
          >
            <FiFilter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Criteria</h3>
            <p className="text-gray-600">
              Please select a class and academic year to generate the student report.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentReport;
