import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import SubjectJSON from '../../../assets/link/subjectName.json';
import useAxios from '../../../assets/hooks/useAxios';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

const MySwal = withReactContent(Swal);

const EditMarks = () => {
  const axios = useAxios();
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Fetch existing marks
  const { data: existingMarks, isLoading } = useQuery({
    queryKey: ['marks', id],
    queryFn: async () => {
      const res = await axios.get(`/marks/${id}`);
      return res.data;
    },
  });

  const watchMarks = watch();

  // Grade & grade point calculation
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

  const calculateCGPA = () => {
    let failCount = 0;
    const points = marksData
      .map((sub) => {
        const obtained = Number(watchMarks[sub.subject] || 0);
        if (obtained > sub.fullMark) return null;
        const grade = getGrade(obtained, sub.fullMark);
        if (grade === 'F') failCount += 1;
        return getGradePoint(grade);
      })
      .filter((p) => p !== null);

    if (failCount > 0) return `F${failCount}`;
    if (points.length === 0) return '';
    const gpa = points.reduce((sum, p) => sum + p, 0) / points.length;
    return gpa.toFixed(2);
  };

  // Handle class & group selection
  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    setSelectedGroup('');
    setAdditionalSubject('');
    setWarnings({});
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
        { subject: 'Agriculture Studies', fullMark: 100 },
      ]);
    } else if (grp === 'business_studies') {
      setAdditionalSubject('Agriculture Studies');
      setMarksData([
        ...SubjectJSON.classes.common_9_10_subjects,
        ...SubjectJSON.classes['9'].groups.business_studies.subjects,
        { subject: 'Agriculture Studies', fullMark: 100 },
      ]);
    }
  };

  const handleAdditionalSubjectChange = (subj) => {
    setAdditionalSubject(subj);
    setMarksData((prev) => [...prev, { subject: subj, fullMark: 100 }]);
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

  // Load existing marks into form
  useEffect(() => {
    if (existingMarks) {
      setExamType(existingMarks.examType);
      setExamYear(existingMarks.examYear);
      setSelectedClass(existingMarks.classesName);
      setSelectedGroup(existingMarks.group || '');
      setRollNumber(existingMarks.roll);
      setStudentName(existingMarks.studentName);

      handleClassChange(existingMarks.classesName);
      if (existingMarks.group) handleGroupChange(existingMarks.group);

      // Set values in form
      existingMarks.subjects.forEach((sub) => {
        setValue(sub.subject, sub.obtained);
      });

      // Set marksData to match fetched subjects
      setMarksData(
        existingMarks.subjects.map((sub) => ({
          subject: sub.subject,
          fullMark: sub.fullMark,
        }))
      );
    }
  }, [existingMarks, setValue]);

  const onSubmit = async (data) => {
    if (!rollNumber || !studentName) {
      return MySwal.fire({
        title: 'Missing Data',
        text: 'Roll number or student name is missing',
        icon: 'warning',
      });
    }

    const subjects = marksData.map((sub) => ({
      subject: sub.subject,
      fullMark: sub.fullMark,
      obtained: Number(data[sub.subject] || 0),
      grade: getGrade(Number(data[sub.subject] || 0), sub.fullMark),
    }));

    const payload = {
      examType,
      examYear,
      classesName: selectedClass,
      group: selectedGroup,
      roll: rollNumber,
      studentName,
      subjects,
      cgpa: calculateCGPA(),
      date: new Date().toISOString(),
    };

    try {
      MySwal.fire({
        title: 'Updating Marks...',
        allowOutsideClick: false,
        didOpen: () => MySwal.showLoading(),
      });
      const response = await axios.put(`/marks/${id}`, payload);
      MySwal.fire({
        title: 'Success!',
        text: response.data.message || 'Marks updated successfully',
        icon: 'success',
      });
      navigate('/dashboard/view-marks');
    } catch (error) {
      MySwal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update marks',
        icon: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Student Marks</h2>

      {/* Selection Boxes */}
      <div className="md:grid md:grid-cols-2 md:gap-4">
        {/* Exam Type */}
        <div className="mb-4">
          <label className="block font-medium">Exam Type</label>
          <select
            className="border p-2 rounded w-full"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          >
            <option value="">-- Select Exam Type --</option>
            <option value="half_yearly">Half Yearly</option>
            <option value="yearly">Yearly</option>
            <option value="test_exam">Test Exam</option>
            <option value="pre_test">Pre Test</option>
          </select>
        </div>

        {/* Exam Year */}
        <div className="mb-4">
          <label className="block font-medium">Exam Year</label>
          <select
            className="border p-2 rounded w-full"
            value={examYear}
            onChange={(e) => setExamYear(e.target.value)}
          >
            <option value="">-- Select Year --</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>

        {/* Class */}
        <div className="mb-4">
          <label className="block font-medium">Select Class</label>
          <select className="border p-2 rounded w-full" value={selectedClass} disabled>
            <option value="">-- Select Class --</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>
        </div>

        {/* Roll Number */}
        {selectedClass && (
          <div className="mb-4">
            <label className="block font-medium">Roll Number</label>
            <input type="text" className="border p-2 rounded w-full" value={rollNumber} disabled />
          </div>
        )}

        {/* Student Name */}
        {selectedClass && (
          <div className="mb-4">
            <label className="block font-medium">Student Name</label>
            <input type="text" className="border p-2 rounded w-full" value={studentName} disabled />
          </div>
        )}

        {/* Group */}
        {(selectedClass === '9' || selectedClass === '10') && (
          <div className="mb-4">
            <label className="block font-medium">Select Group</label>
            <select className="border p-2 rounded w-full" value={selectedGroup} disabled>
              <option value="">-- Select Group --</option>
              <option value="science">Science</option>
              <option value="humanities">Humanities</option>
              <option value="business_studies">Business Studies</option>
            </select>
          </div>
        )}
      </div>

      {/* Marks Table */}
      {marksData.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="table-auto w-full border mb-4">
            <thead>
              <tr className="bg-green-200">
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Full Mark</th>
                <th className="border px-4 py-2">Obtained</th>
                <th className="border px-4 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((sub, index) => {
                const obtained = watchMarks[sub.subject] || 0;
                const grade = obtained ? getGrade(Number(obtained), sub.fullMark) : '';
                return (
                  <tr key={index}>
                    <td className="border px-4 py-2">{sub.subject}</td>
                    <td className="border px-4 py-2">{sub.fullMark}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        value={watchMarks[sub.subject] || ''}
                        className="border p-1 rounded w-24"
                        {...register(sub.subject)}
                        onChange={(e) =>
                          handleMarksChange(sub.subject, sub.fullMark, Number(e.target.value))
                        }
                      />
                      {warnings[sub.subject] && (
                        <p className="text-red-500 text-xs">{warnings[sub.subject]}</p>
                      )}
                    </td>
                    <td className="border px-4 py-2">{grade}</td>
                  </tr>
                );
              })}
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
            Update Mark
          </button>
        </form>
      )}
    </div>
  );
};

export default EditMarks;
