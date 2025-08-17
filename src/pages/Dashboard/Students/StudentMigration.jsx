import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Search, Users, ArrowRight, Loader } from 'lucide-react';
import useAxios from '../../../assets/hooks/useAxios';

const MySwal = withReactContent(Swal);

const StudentMigration = () => {
  const axios = useAxios();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [currentClass, setCurrentClass] = useState('');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [newAcademicYear, setNewAcademicYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);

  // Generate class options (6-10)
  const classOptions = [6, 7, 8, 9, 10].map((cls) => ({
    value: cls.toString(),
    label: `Class ${cls}`,
  }));

  // Generate academic year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + i).map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  // Fetch students by class and academic year
  const fetchStudents = async () => {
    if (!currentClass || !currentAcademicYear) return;

    try {
      setLoading(true);
      console.log('Fetching students with params:', {
        class: currentClass,
        academicYear: currentAcademicYear,
        search: searchTerm,
      });

      const response = await axios.get('/students', {
        params: {
          class: currentClass,
          academicYear: currentAcademicYear,
          status: 'active',
          search: searchTerm,
          limit: 1000,
        },
      });

      console.log('API Response:', response.data);

      // Map _id to id for consistency and ensure academicYear is preserved
      const formattedStudents = response.data.data.map((student) => ({
        ...student,
        id: student._id || student.id,
        // Ensure academicYear is available - use from API or fallback to current selection
        academicYear: student.academicYear || currentAcademicYear,
      }));

      console.log('Formatted students:', formattedStudents);

      setStudents(formattedStudents || []);
      setTotalStudents(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching students:', error);
      MySwal.fire({
        title: 'Error',
        text: 'Failed to fetch students',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentClass && currentAcademicYear) {
        fetchStudents();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentClass, currentAcademicYear]);

  // Reset students when class or academic year changes
  useEffect(() => {
    if (currentClass && currentAcademicYear) {
      setSelectedStudents([]);
      setSearchTerm('');
    } else {
      setStudents([]);
      setTotalStudents(0);
    }
  }, [currentClass, currentAcademicYear]);

  // Handle student selection
  const handleStudentSelect = (studentId, isChecked) => {
    setSelectedStudents((prev) =>
      isChecked ? [...prev, studentId] : prev.filter((id) => id !== studentId)
    );
  };

  // Select all/none
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  // Handle migration
  const handleMigration = async () => {
    if (!targetClass) {
      return MySwal.fire({
        title: 'Missing Target Class',
        text: 'Please select a target class',
        icon: 'warning',
      });
    }

    if (!newAcademicYear) {
      return MySwal.fire({
        title: 'Missing Academic Year',
        text: 'Please select a new academic year',
        icon: 'warning',
      });
    }

    if (selectedStudents.length === 0) {
      return MySwal.fire({
        title: 'No Students Selected',
        text: 'Please select at least one student to migrate',
        icon: 'warning',
      });
    }

    if (currentClass === targetClass && currentAcademicYear === newAcademicYear) {
      return MySwal.fire({
        title: 'Invalid Migration',
        text: 'Target class and academic year must be different from current ones',
        icon: 'warning',
      });
    }

    try {
      setMigrating(true);
      MySwal.fire({
        title: 'Migrating Students...',
        allowOutsideClick: false,
        didOpen: () => MySwal.showLoading(),
      });

      const response = await axios.patch('/students/migrate', {
        studentIds: selectedStudents,
        newClass: targetClass,
        newAcademicYear: newAcademicYear,
      });

      MySwal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
      });

      // Refresh the student list
      fetchStudents();
      setSelectedStudents([]);
    } catch (error) {
      let errMsg = 'Failed to migrate students';

      if (error.response) {
        // Handle specific backend errors
        if (error.response.data.invalidIds) {
          errMsg = `Invalid student IDs: ${error.response.data.invalidIds.join(', ')}`;
        } else if (error.response.data.missingIds) {
          errMsg = `Students not found: ${error.response.data.missingIds.join(', ')}`;
        } else {
          errMsg = error.response.data.message || errMsg;
        }
      }

      MySwal.fire({
        title: 'Error!',
        text: errMsg,
        icon: 'error',
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8" />
          Student Migration System
        </h1>
        <p className="text-blue-100 mt-2">
          Migrate students from one class to another with academic year progression
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Migration Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Class Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-600">Current Class Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Class
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={currentClass}
                  onChange={(e) => {
                    setCurrentClass(e.target.value);
                    setSelectedStudents([]);
                  }}
                >
                  <option value="">Select Current Class</option>
                  {classOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Academic Year
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={currentAcademicYear}
                  onChange={(e) => {
                    setCurrentAcademicYear(e.target.value);
                    setSelectedStudents([]);
                  }}
                >
                  <option value="">Select Academic Year</option>
                  {yearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Target Class Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-600">Target Class Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Class</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                >
                  <option value="">Select Target Class</option>
                  {classOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Academic Year
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newAcademicYear}
                  onChange={(e) => setNewAcademicYear(e.target.value)}
                >
                  <option value="">Select Academic Year</option>
                  {yearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      {currentClass && currentAcademicYear && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {selectedStudents.length} of {totalStudents} selected
                </div>
                <button
                  onClick={handleMigration}
                  disabled={
                    selectedStudents.length === 0 || migrating || !targetClass || !newAcademicYear
                  }
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {migrating ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {migrating ? 'Migrating...' : 'Migrate Selected'}
                </button>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading students...</span>
              </div>
            ) : students.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <input
                        type="checkbox"
                        checked={students.length > 0 && selectedStudents.length === students.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Roll
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Current Class
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Academic Year
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Parents
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className={
                        selectedStudents.includes(student.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => handleStudentSelect(student.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="w-10 h-10 rounded-full object-cover"
                            src={student.image || '/default-avatar.png'}
                            alt={student.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.roll}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Class {student.dclassName || student.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.academicYear || currentAcademicYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{student.fatherName}</div>
                        <div className="text-xs text-gray-400">{student.motherName}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? 'No students match your search criteria'
                    : `No students found in Class ${currentClass} for Academic Year ${currentAcademicYear}`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {(!currentClass || !currentAcademicYear) && (
        <div className="text-center py-12">
          <Users className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Select Class and Academic Year</h3>
          <p className="mt-2 text-sm text-gray-500">
            Please select both current class and academic year to view students available for
            migration.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentMigration;
