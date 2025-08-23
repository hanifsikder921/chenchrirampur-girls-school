import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../assets/hooks/useAxios';
import useAuth from '../../../assets/hooks/useAuth';

const MySwal = withReactContent(Swal);

const AssignMark = () => {
  const axios = useAxios();
  const {user}=useAuth()


  const teacherEmail = user?.email; 

  // Get subject data
  const { data: subjectData } = useQuery({
    queryKey: ['subjectJson'],
    queryFn: async () => {
      const res = await axios.get('/subjectJson');
      return res.data;
    },
  });

  // Get teacher data by email
  const { data: teacherData, isLoading: teacherLoading } = useQuery({
    queryKey: ['teacher', teacherEmail],
    queryFn: async () => {
      const res = await axios.get(`/teachers/email/${teacherEmail}`);
      return res.data.data;
    },
    enabled: !!teacherEmail,
  });

  const SubjectJSON = subjectData?.[0];
  const { register, handleSubmit, setValue, watch, reset } = useForm();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectInfo, setSelectedSubjectInfo] = useState(null);
  const [examType, setExamType] = useState('');
  const [examYear, setExamYear] = useState('2025');
  const [students, setStudents] = useState([]);
  const [existingMarks, setExistingMarks] = useState({});
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const watchMarks = watch();

  // Extract assigned classes from teacher data
  const getAssignedClasses = () => {
    if (!teacherData?.assignSubject) return [];

    const classes = teacherData.assignSubject.map((assignment) => {
      const [classNum] = assignment.split('-');
      return classNum;
    });

    return [...new Set(classes)]; // Remove duplicates
  };

  // Get assigned subjects for selected class
  const getAssignedSubjects = () => {
    if (!teacherData?.assignSubject || !selectedClass) return [];

    return teacherData.assignSubject
      .filter((assignment) => assignment.startsWith(`${selectedClass}-`))
      .map((assignment) => assignment.split('-')[1]);
  };

  // Grade calculation
  const getGrade = (score, fullMark) => {
    const percentage = (score / fullMark) * 100;
    if (percentage >= 80) return 'A+';
    if (percentage >= 70) return 'A';
    if (percentage >= 60) return 'A-';
    if (percentage >= 50) return 'B';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
  };

  // Get subject full mark from JSON
  const getSubjectFullMark = (subjectName, className, group) => {
    if (!SubjectJSON || !className) return 100;

    const classData = SubjectJSON.classes[className];
    if (!classData) return 100;

    let subjects = [];

    if (className === '6' || className === '7' || className === '8') {
      subjects = classData.subjects || [];
    } else if (className === '9' || className === '10') {
      subjects = [...(classData.common_subjects || [])];
      if (group && classData.groups?.[group]) {
        subjects = [...subjects, ...(classData.groups[group].subjects || [])];
      }
      if (classData.additional?.subjects) {
        subjects = [...subjects, ...classData.additional.subjects];
      }
    }

    const subject = subjects.find((s) => s.name === subjectName);
    return subject
      ? subject.mark?.$numberInt
        ? parseInt(subject.mark.$numberInt)
        : subject.mark
      : 100;
  };

  // Load students when class is selected
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClass || !examType || !examYear) return;

      setIsLoadingStudents(true);
      try {
        let url = `/students/class/${selectedClass}`;
        if (selectedGroup && (selectedClass === '9' || selectedClass === '10')) {
          url += `?section=${selectedGroup}`;
        }

        const response = await axios.get(url);
        setStudents(response.data.data);

        // Load existing marks for each student
        const marksPromises = response.data.data.map(async (student) => {
          try {
            const marksResponse = await axios.get('/marks/student', {
              params: {
                examType,
                examYear,
                classesName: selectedClass,
                roll: student.roll,
                group: selectedGroup || '',
              },
            });
            return { [student.roll]: marksResponse.data.data };
          } catch (error) {
            return { [student.roll]: null };
          }
        });

        const marksResults = await Promise.all(marksPromises);
        const marksMap = marksResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setExistingMarks(marksMap);
      } catch (error) {
        console.error('Error loading students:', error);
        MySwal.fire({
          title: 'Error',
          text: 'Failed to load students',
          icon: 'error',
        });
      } finally {
        setIsLoadingStudents(false);
      }
    };

    loadStudents();
  }, [selectedClass, selectedGroup, examType, examYear]);

  // Pre-fill existing marks when subject is selected
  useEffect(() => {
    if (selectedSubject && students.length > 0) {
      students.forEach((student) => {
        const existingRecord = existingMarks[student.roll];
        if (existingRecord?.subjects) {
          const subjectMark = existingRecord.subjects.find((s) => s.subject === selectedSubject);
          if (subjectMark) {
            setValue(`mark_${student.roll}`, subjectMark.obtained);
          }
        }
      });
    }
  }, [selectedSubject, existingMarks, students, setValue]);

  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    setSelectedGroup('');
    setSelectedSubject('');
    setSelectedSubjectInfo(null);
    setStudents([]);
    setExistingMarks({});
    reset();
  };

  const handleGroupChange = (grp) => {
    setSelectedGroup(grp);
    setSelectedSubject('');
    setSelectedSubjectInfo(null);
  };

  const handleSubjectChange = (subjectName) => {
    setSelectedSubject(subjectName);
    const fullMark = getSubjectFullMark(subjectName, selectedClass, selectedGroup);
    setSelectedSubjectInfo({ name: subjectName, fullMark });
  };

  const onSubmit = async (data) => {
    if (!selectedSubject || !selectedSubjectInfo) {
      return MySwal.fire({
        title: 'Missing Information',
        text: 'Please select a subject',
        icon: 'warning',
      });
    }

    const marksToSave = students
      .map((student) => {
        const mark = data[`mark_${student.roll}`];
        if (mark !== undefined && mark !== '') {
          return {
            student,
            mark: Number(mark),
            grade: getGrade(Number(mark), selectedSubjectInfo.fullMark),
          };
        }
        return null;
      })
      .filter(Boolean);

    if (marksToSave.length === 0) {
      return MySwal.fire({
        title: 'No Marks to Save',
        text: 'Please enter at least one mark',
        icon: 'warning',
      });
    }

    try {
      MySwal.fire({
        title: 'Saving Marks...',
        allowOutsideClick: false,
        didOpen: () => MySwal.showLoading(),
      });

      // Save marks for each student
      const savePromises = marksToSave.map(async ({ student, mark, grade }) => {
        const marksData = {
          examType,
          examYear,
          classesName: selectedClass,
          group: selectedGroup || '',
          roll: student.roll,
          studentName: student.name,
          fatherName: student.fatherName,
          motherName: student.motherName,
          dob: student.dob,
          newSubject: selectedSubject,
          newMark: mark,
          newGrade: grade,
          fullMark: selectedSubjectInfo.fullMark,
        };

        return axios.post('/marks/upsert', marksData);
      });

      await Promise.all(savePromises);

      MySwal.fire({
        title: 'Success!',
        text: `Marks saved for ${marksToSave.length} students`,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Refresh the page data
      const updatedMarksPromises = students.map(async (student) => {
        try {
          const marksResponse = await axios.get('/marks/student', {
            params: {
              examType,
              examYear,
              classesName: selectedClass,
              roll: student.roll,
              group: selectedGroup || '',
            },
          });
          return { [student.roll]: marksResponse.data.data };
        } catch (error) {
          return { [student.roll]: null };
        }
      });

      const updatedMarksResults = await Promise.all(updatedMarksPromises);
      const updatedMarksMap = updatedMarksResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setExistingMarks(updatedMarksMap);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to save marks';
      MySwal.fire({
        title: 'Error!',
        text: errMsg,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  if (teacherLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const assignedClasses = getAssignedClasses();
  const assignedSubjects = getAssignedSubjects();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold">Assign Marks</h2>
        <p className="text-green-100">Assign marks to your assigned subjects</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Teacher Info */}
        {teacherData && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Teacher Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium">Name:</span> {teacherData.fullName}
              </div>
              <div>
                <span className="font-medium">Designation:</span> {teacherData.designation}
              </div>
              <div>
                <span className="font-medium">Subject:</span> {teacherData.subject}
              </div>
            </div>
          </div>
        )}

        {/* Selection Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Selection</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Exam Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                required
              >
                <option value="">Select Exam Type</option>
                <option value="half_yearly">Half Yearly</option>
                <option value="yearly">Yearly</option>
                <option value="test_exam">Test Exam</option>
                <option value="pre_test">Pre Test</option>
              </select>
            </div>

            {/* Exam Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={examYear}
                onChange={(e) => setExamYear(e.target.value)}
                required
              >
                <option value="">Select Year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            {/* Class Selection - Only show assigned classes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {assignedClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Group Selection for Class 9 & 10 */}
            {(selectedClass === '9' || selectedClass === '10') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedGroup}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  required
                >
                  <option value="">Select Group</option>
                  <option value="science">Science</option>
                  <option value="humanities">Humanities</option>
                  <option value="business_studies">Business Studies</option>
                </select>
              </div>
            )}
          </div>

          {/* Subject Selection - Only show assigned subjects */}
          {selectedClass && assignedSubjects.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                required
              >
                <option value="">Select Subject</option>
                {assignedSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Students Table */}
        {selectedSubject && selectedSubjectInfo && students.length > 0 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                Students - {selectedSubject} (Full Mark: {selectedSubjectInfo.fullMark})
              </h3>

              {isLoadingStudents ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Roll
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Mark
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student, index) => {
                        const currentMark = watchMarks[`mark_${student.roll}`] || 0;
                        const grade =
                          currentMark && currentMark <= selectedSubjectInfo.fullMark
                            ? getGrade(Number(currentMark), selectedSubjectInfo.fullMark)
                            : '';

                        return (
                          <tr
                            key={student.roll}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <img
                                src={student.image || '/default-avatar.png'}
                                alt={student.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.roll}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.dclassName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedSubject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                {...register(`mark_${student.roll}`)}
                                min="0"
                                max={selectedSubjectInfo.fullMark}
                                placeholder="0"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                              {grade && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    grade === 'A+'
                                      ? 'bg-green-100 text-green-800'
                                      : grade === 'A'
                                      ? 'bg-green-50 text-green-700'
                                      : grade === 'A-'
                                      ? 'bg-blue-50 text-blue-700'
                                      : grade === 'B'
                                      ? 'bg-yellow-50 text-yellow-700'
                                      : grade === 'C'
                                      ? 'bg-orange-50 text-orange-700'
                                      : grade === 'D'
                                      ? 'bg-purple-50 text-purple-700'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {grade}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save Marks
                </button>
              </div>
            </div>
          </form>
        )}

        {/* No students message */}
        {selectedClass && selectedSubject && !isLoadingStudents && students.length === 0 && (
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <p className="text-yellow-800">No students found for this class.</p>
          </div>
        )}

        {/* Instructions */}
        {!selectedClass && assignedClasses.length === 0 && (
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <p className="text-red-800">
              No classes assigned to you. Please contact the administrator.
            </p>
          </div>
        )}

        {/* Assignment info */}
        {teacherData?.assignSubject && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Your Assigned Subjects:</h4>
            <div className="flex flex-wrap gap-2">
              {teacherData.assignSubject.map((assignment, index) => (
                <span
                  key={index}
                  className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {assignment}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignMark;
