import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import SubjectJSON from '../../../assets/link/subjectName.json';
import useAxios from '../../../assets/hooks/useAxios';

const MySwal = withReactContent(Swal);

const AddMarks = () => {
  const axios = useAxios();
  const { register, handleSubmit, setValue, watch } = useForm();
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

  //  const onSubmit = async (data) => {

  //    if (!rollNumber) {
  //      MySwal.fire({
  //        title: 'Missing Roll Number',
  //        text: 'Please enter roll number',
  //        icon: 'warning',
  //      });
  //      return;
  //    }
  //    if (!studentName) {
  //      MySwal.fire({
  //        title: 'Missing Student Name',
  //        text: 'Please enter student name',
  //        icon: 'warning',
  //      });
  //      return;
  //    }

  //    // Prepare the subjects data""
  //    const result = marksData.map((sub) => ({
  //      subject: sub.name,
  //      fullMark: sub.mark,
  //      obtained: Number(data[sub.name] || 0),
  //      grade: getGrade(Number(data[sub.name] || 0), sub.mark),
  //    }));

  //    // Prepare the complete marks data
  //    const marksDataWithMeta = {
  //      examType,
  //      classesName: selectedClass,
  //      group: selectedGroup,
  //      roll: rollNumber,
  //      studentName,
  //      subjects: result,
  //      cgpa: calculateCGPA(),
  //      date: new Date().toISOString(),
  //    };

  //    try {
  //      // Show loading indicator
  //      MySwal.fire({
  //        title: 'Saving Marks...',
  //        allowOutsideClick: false,
  //        didOpen: () => {
  //          MySwal.showLoading();
  //        },
  //      });

  //      // Send data to backend
  //      const response = await axios.post('/marks', marksDataWithMeta);
  //      console.log('Marks saved successfully:', response.data);

  //      // Show success message
  //      MySwal.fire({
  //        title: 'Success!',
  //        text: 'Marks saved successfully',
  //        icon: 'success',
  //        confirmButtonText: 'OK',
  //      });

  //      // Optionally reset form
  //      setSelectedClass('');
  //      setSelectedGroup('');
  //      setAdditionalSubject('');
  //      setMarksData([]);
  //      setExamType('');
  //      setRollNumber('');
  //      setStudentName('');
  //    } catch (error) {
  //      console.error('Error saving marks:', error);

  //      // Show error message
  //      MySwal.fire({
  //        title: 'Error!',
  //        text: error.response?.data?.message || 'Failed to save marks',
  //        icon: 'error',
  //        confirmButtonText: 'OK',
  //      });
  //    }
  //  };

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
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Student Marks</h2>

      {/* selected box=============================================================> */}
      <div className="md:grid md:grid-cols-2 md:gap-4">
        {/* Exam Type Selection */}
        <div className="mb-4">
          <label className="block font-medium">Exam Type</label>
          <select
            className="border p-2 rounded w-full"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            required
          >
            <option value="">-- Select Exam Type --</option>
            <option value="half_yearly">Half Yearly</option>
            <option value="yearly">Yearly</option>
            <option value="test_exam">Test Exam</option>
            <option value="pre_test">Pre Test</option>
          </select>
        </div>
        {/* Exam Year Selection */}
        <div className="mb-4">
          <label className="block font-medium">Exam Year</label>
          <select
            className="border p-2 rounded w-full"
            value={examYear}
            onChange={(e) => setExamYear(e.target.value)}
            required
          >
            <option value="">-- Select Year --</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2025">2026</option>
          </select>
        </div>

        {/* Class Selection */}
        <div className="mb-4">
          <label className="block font-medium">Select Class</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            required
          >
            <option value="">-- Select Class --</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>
        </div>

        {/* Roll Number Input */}
        {selectedClass && (
          <div className="mb-4">
            <label className="block font-medium">Roll Number</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter roll number"
              required
            />
          </div>
        )}

        {/* Student Name Display/Input */}
        {selectedClass && (
          <div className="mb-4">
            <label className="block font-medium">Student Name</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Student name"
              required
            />
          </div>
        )}

        {/* Group Selection for Class 9 & 10 */}
        {(selectedClass === '9' || selectedClass === '10') && (
          <div className="mb-4">
            <label className="block font-medium">Select Group</label>
            <select
              className="border p-2 rounded w-full"
              value={selectedGroup}
              onChange={(e) => handleGroupChange(e.target.value)}
            >
              <option value="">-- Select Group --</option>
              <option value="science">Science</option>
              <option value="humanities">Humanities</option>
              <option value="business_studies">Business Studies</option>
            </select>
          </div>
        )}

        {/* Additional Subject for Science */}
        {selectedGroup === 'science' && (
          <div className="mb-4 md:col-span-2">
            <label className="block font-medium">Select Additional Subject</label>
            <select
              className="border p-2 rounded w-full"
              value={additionalSubject}
              onChange={(e) => handleAdditionalSubjectChange(e.target.value)}
            >
              <option value="">-- Select Subject --</option>
              {SubjectJSON.classes['9'].additional.subjects.map((sub, i) => (
                <option key={i} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* selected box=============================================================> */}

      {/* Marks Entry Form */}
      {marksData.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="table-auto w-full border mb-4">
            <thead>
              <tr className="bg-green-200 ">
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Full Mark</th>
                <th className="border px-4 py-2">Obtained</th>
                <th className="border px-4 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((sub, index) => {
                const obtained = watchMarks[sub.name] || 0;
                const grade =
                  obtained && obtained <= sub.mark ? getGrade(Number(obtained), sub.mark) : '';
                return (
                  <tr key={index}>
                    <td className="border px-4 py-2">{sub.name}</td>
                    <td className="border px-4 py-2">{sub.mark}</td>
                    <td className="border px-4 py-2 ">
                      <input
                        type="number"
                        className="border p-1 rounded w-24"
                        {...register(sub.name)}
                        onChange={(e) =>
                          handleMarksChange(sub.name, sub.mark, Number(e.target.value))
                        }
                      />
                      {warnings[sub.name] && (
                        <p className="text-red-500 text-xs">{warnings[sub.name]}</p>
                      )}
                    </td>
                    <td className="border px-4 py-2">{grade}</td>
                  </tr>
                );
              })}

              {/* CGPA Row */}
              <tr className="bg-gray-200 font-semibold">
                <td className="border px-4 py-2 text-center" colSpan={4}>
                  CGPA: {calculateCGPA()}
                </td>
              </tr>
            </tbody>
          </table>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Marks
          </button>
        </form>
      )}
    </div>
  );
};

export default AddMarks;
