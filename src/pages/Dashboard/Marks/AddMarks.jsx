import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import SubjectJSON from '../../../assets/link/subjectName.json';
import useAxios from '../../../assets/hooks/useAxios';

const MySwal = withReactContent(Swal);

const AddMarks = () => {
  const axios = useAxios();
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [additionalSubject, setAdditionalSubject] = useState('');
  const [marksData, setMarksData] = useState([]);
  const [warnings, setWarnings] = useState({});
  const [examType, setExamType] = useState('');
  const [examYear, setExamYear] = useState('2025');
  const [rollNumber, setRollNumber] = useState('');
  const [studentName, setStudentName] = useState('');

  const watchMarks = watch();

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

  // Grade point calculation
  const getGradePoint = (grade) => {
    switch (grade) {
      case 'A+':
        return 5.0;
      case 'A':
        return 4.0;
      case 'A-':
        return 3.5;
      case 'B':
        return 3.0;
      case 'C':
        return 2.0;
      case 'D':
        return 1.0;
      default:
        return 0.0;
    }
  };

  // CGPA calculation with fail count
  const calculateCGPA = () => {
    let failCount = 0;
    const points = marksData
      .map((sub) => {
        const obtained = Number(watchMarks[sub.name] || 0);
        if (obtained > sub.mark) return null;
        const grade = getGrade(obtained, sub.mark);
        if (grade === 'F') failCount += 1;
        return getGradePoint(grade);
      })
      .filter((p) => p !== null);

    if (failCount > 0) return `F${failCount}`;
    if (points.length === 0) return '';
    const gpa = points.reduce((sum, p) => sum + p, 0) / points.length;
    return gpa.toFixed(2);
  };

  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    setSelectedGroup('');
    setAdditionalSubject('');
    setWarnings({});
    setRollNumber('');
    setStudentName('');
    if (cls === '6' || cls === '7' || cls === '8') {
      setMarksData(SubjectJSON.classes.common_6_7_8_subjects);
    } else if (cls === '9' || cls === '10') {
      setMarksData([]); // wait for group selection
    }
  };

  const handleGroupChange = (grp) => {
    setSelectedGroup(grp);
    if (grp === 'science') {
      setAdditionalSubject('');
      setMarksData([
        ...SubjectJSON.classes.common_9_10_subjects,
        ...SubjectJSON.classes['9'].groups.science.subjects,
      ]);
    } else if (grp === 'humanities') {
      setAdditionalSubject('Agriculture Studies');
      setMarksData([
        ...SubjectJSON.classes.common_9_10_subjects,
        ...SubjectJSON.classes['9'].groups.humanities.subjects,
        { name: 'Agriculture Studies', mark: 100 },
      ]);
    } else if (grp === 'business_studies') {
      setAdditionalSubject('Agriculture Studies');
      setMarksData([
        ...SubjectJSON.classes.common_9_10_subjects,
        ...SubjectJSON.classes['9'].groups.business_studies.subjects,
        { name: 'Agriculture Studies', mark: 100 },
      ]);
    }
  };

  const handleAdditionalSubjectChange = (subj) => {
    setAdditionalSubject(subj);
    setMarksData((prev) => [
      ...prev,
      { name: subj, mark: subj === 'Agriculture Studies' ? 100 : 100 },
    ]);
  };

  const handleMarksChange = (subjectName, fullMark, value) => {
    if (value > fullMark) {
      setWarnings((prev) => ({ ...prev, [subjectName]: `Full mark is ${fullMark}` }));
    } else {
      setWarnings((prev) => {
        const updated = { ...prev };
        delete updated[subjectName];
        return updated;
      });
    }
    setValue(subjectName, value);
  };

  const onSubmit = async (data) => {
    if (!rollNumber) {
      return MySwal.fire({
        title: 'Missing Roll Number',
        text: 'Please enter roll number',
        icon: 'warning',
      });
    }
    if (!studentName) {
      return MySwal.fire({
        title: 'Missing Student Name',
        text: 'Please enter student name',
        icon: 'warning',
      });
    }

    // Prepare subjects data
    const result = marksData.map((sub) => ({
      subject: sub.name,
      fullMark: sub.mark,
      obtained: Number(data[sub.name] || 0),
      grade: getGrade(Number(data[sub.name] || 0), sub.mark),
    }));

    const marksDataWithMeta = {
      examType,
      examYear,
      classesName: selectedClass,
      group: selectedGroup,
      roll: rollNumber,
      studentName,
      subjects: result,
      cgpa: calculateCGPA(),
      date: new Date().toISOString(),
    };

    try {
      MySwal.fire({
        title: 'Saving Marks...',
        allowOutsideClick: false,
        didOpen: () => MySwal.showLoading(),
      });

      const response = await axios.post('/marks', marksDataWithMeta);

      MySwal.fire({
        title: 'Success!',
        text: response.data.message || 'Marks saved successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Reset form
      reset();
      setSelectedClass('');
      setSelectedGroup('');
      setAdditionalSubject('');
      setMarksData([]);
      setExamType('');
      setExamYear('');
      setRollNumber('');
      setStudentName('');
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold">Add Student Marks</h2>
        <p className="text-blue-100">Enter student examination details and marks</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Basic Information
          </h3>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Year</label>
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

            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>

            {/* Roll Number */}
            {selectedClass && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Roll number"
                  required
                />
              </div>
            )}
          </div>

          {/* Student Name and Group Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {selectedClass && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student name"
                  required
                />
              </div>
            )}

            {/* Group Selection for Class 9 & 10 */}
            {(selectedClass === '9' || selectedClass === '10') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedGroup}
                  onChange={(e) => handleGroupChange(e.target.value)}
                >
                  <option value="">Select Group</option>
                  <option value="science">Science</option>
                  <option value="humanities">Humanities</option>
                  <option value="business_studies">Business Studies</option>
                </select>
              </div>
            )}

            {/* Additional Subject for Science */}
            {selectedGroup === 'science' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Subject
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={additionalSubject}
                  onChange={(e) => handleAdditionalSubjectChange(e.target.value)}
                >
                  <option value="">Select Additional Subject</option>
                  {SubjectJSON.classes['9'].additional.subjects.map((sub, i) => (
                    <option key={i} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Marks Entry Section */}
        {marksData.length > 0 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                Marks Entry
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Subject
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Full Mark
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Obtained Mark
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {marksData.map((sub, index) => {
                      const obtained = watchMarks[sub.name] || 0;
                      const grade =
                        obtained && obtained <= sub.mark
                          ? getGrade(Number(obtained), sub.mark)
                          : '';
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {sub.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {sub.mark}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                className="w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                {...register(sub.name)}
                                onChange={(e) =>
                                  handleMarksChange(sub.name, sub.mark, Number(e.target.value))
                                }
                              />
                              {warnings[sub.name] && (
                                <span className="text-xs text-red-600">{warnings[sub.name]}</span>
                              )}
                            </div>
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
                  <tfoot className="bg-blue-50">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase"
                      >
                        CGPA
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900">
                        {calculateCGPA()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Marks
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMarks;
