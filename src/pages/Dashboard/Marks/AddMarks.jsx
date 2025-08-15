import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import SubjectJSON from '../../../assets/link/subjectName.json';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const AddMarks = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
    trigger,
  } = useForm();
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState([]);

  const classes = ['6', '7', '8', '9', '10'];
  const watchMarks = watch('marks') || [];

  // Load subjects based on selected class
  useEffect(() => {
    if (!selectedClass) {
      setSubjects([]);
      setGroups([]);
      setSelectedGroup('');
      setStudents([]);
      return;
    }

    const classData = SubjectJSON.classes[selectedClass];

    if (['6', '7', '8'].includes(selectedClass)) {
      setSubjects(classData.subjects);
      setGroups([]);
      setSelectedGroup('');
    } else if (['9', '10'].includes(selectedClass)) {
      setGroups(Object.keys(classData.groups));
      if (selectedGroup) {
        const groupSubjects = classData.groups[selectedGroup].subjects;
        setSubjects([...classData.common_subjects, ...groupSubjects]);
      } else {
        setSubjects(classData.common_subjects);
      }
    }

    // Fetch only one student
    const singleStudent = [{ id: 1, name: 'Student 1', roll: 101 }];
    setStudents(singleStudent);
  }, [selectedClass, selectedGroup]);

  // Grade calculation
  const calculateGrade = (total) => {
    if (total >= 80) return 'A+';
    if (total >= 70) return 'A';
    if (total >= 60) return 'A-';
    if (total >= 50) return 'B';
    if (total >= 40) return 'C';
    if (total >= 33) return 'D';
    return 'F';
  };

  // Get max marks for each field based on subject
  const getMaxMarks = (subject, field) => {
    const isICT = subject === 'Information and Communication Technology (ICT)';

    if (isICT) {
      return field === 'theory' ? 25 : field === 'mcq' ? 25 : field === 'practical' ? 0 : 0;
    } else {
      return field === 'theory' ? 70 : field === 'mcq' ? 30 : field === 'practical' ? 0 : 0;
    }
  };

  // Handle mark changes with immediate calculation
  const handleMarkChange = (studentIndex, subject, field, value) => {
    const max = getMaxMarks(subject, field);
    const numValue = Math.min(Number(value), max);

    // Set the value (clamped to max)
    setValue(`marks.${studentIndex}.${subject}.${field}`, numValue);

    // Trigger validation
    trigger(`marks.${studentIndex}.${subject}.${field}`);

    // Calculate totals
    const theory = watchMarks?.[studentIndex]?.[subject]?.theory || 0;
    const mcq = watchMarks?.[studentIndex]?.[subject]?.mcq || 0;
    const practical = watchMarks?.[studentIndex]?.[subject]?.practical || 0;
    const total = Number(theory) + Number(mcq) + Number(practical);

    return { numValue, total };
  };

  const onSubmit = async (data) => {
    try {
      await axios.post('https://your-api.com/marks', data);
      MySwal.fire({
        title: 'Success!',
        text: 'Marks saved successfully',
        icon: 'success',
        confirmButtonColor: '#15803d',
      });
      reset();
    } catch (err) {
      console.error(err);
      MySwal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to save marks',
        icon: 'error',
        confirmButtonColor: '#b91c1c',
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-green-800 text-center">Add Marks</h2>

      {/* Class Selection */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Select Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Select class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              Class {cls}
            </option>
          ))}
        </select>
      </div>

      {['9', '10'].includes(selectedClass) && (
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Select Group</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Select group</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {students.length > 0 && subjects.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {students.map((student, sIdx) => (
            <div key={student.id} className="mb-6 border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-green-800">
                {student.name} (Roll: {student.roll})
              </h3>

              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="border p-2">Subject</th>
                    <th className="border p-2">Theory (ICT: 25, Others: 70)</th>
                    <th className="border p-2">MCQ (ICT: 25, Others: 30)</th>
                    <th className="border p-2">Practical</th>
                    <th className="border p-2">Total</th>
                    <th className="border p-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subj) => {
                    const theory = watchMarks?.[sIdx]?.[subj]?.theory;
                    const mcq = watchMarks?.[sIdx]?.[subj]?.mcq
                    const practical = watchMarks?.[sIdx]?.[subj]?.practical;
                    const total = Number(theory) + Number(mcq) + Number(practical);
                    const grade = calculateGrade(total);
                    const isICT = subj === 'Information and Communication Technology (ICT)';

                    return (
                      <tr key={subj} className="hover:bg-gray-100">
                        <td className="border p-2">{subj}</td>

                        {/* Theory */}
                        <td className="border p-2">
                          <input
                            type="number"
                            min="0"
                            max={getMaxMarks(subj, 'theory')}
                            value={theory}
                            onChange={(e) => {
                              const { total } = handleMarkChange(
                                sIdx,
                                subj,
                                'theory',
                                e.target.value
                              );
                              // Update dependent fields
                              setValue(`marks.${sIdx}.${subj}.total`, total);
                              setValue(`marks.${sIdx}.${subj}.grade`, calculateGrade(total));
                            }}
                            className={`input input-bordered w-full ${
                              errors?.marks?.[sIdx]?.[subj]?.theory ? 'input-error' : ''
                            }`}
                          />
                          {errors?.marks?.[sIdx]?.[subj]?.theory && (
                            <p className="text-red-500 text-xs mt-1">
                              Max {getMaxMarks(subj, 'theory')}
                            </p>
                          )}
                        </td>

                        {/* MCQ */}
                        <td className="border p-2">
                          <input
                            type="number"
                            min="0"
                            max={getMaxMarks(subj, 'mcq')}
                            value={mcq}
                            onChange={(e) => {
                              const { total } = handleMarkChange(sIdx, subj, 'mcq', e.target.value);
                              // Update dependent fields
                              setValue(`marks.${sIdx}.${subj}.total`, total);
                              setValue(`marks.${sIdx}.${subj}.grade`, calculateGrade(total));
                            }}
                            className={`input input-bordered w-full ${
                              errors?.marks?.[sIdx]?.[subj]?.mcq ? 'input-error' : ''
                            }`}
                          />
                          {errors?.marks?.[sIdx]?.[subj]?.mcq && (
                            <p className="text-red-500 text-xs mt-1">
                              Max {getMaxMarks(subj, 'mcq')}
                            </p>
                          )}
                        </td>

                        {/* Practical */}
                        <td className="border p-2">
                          <input
                            type="number"
                            min="0"
                            max={getMaxMarks(subj, 'practical')}
                            value={practical}
                            onChange={(e) => {
                              const { total } = handleMarkChange(
                                sIdx,
                                subj,
                                'practical',
                                e.target.value
                              );
                              // Update dependent fields
                              setValue(`marks.${sIdx}.${subj}.total`, total);
                              setValue(`marks.${sIdx}.${subj}.grade`, calculateGrade(total));
                            }}
                            className={`input input-bordered w-full ${
                              errors?.marks?.[sIdx]?.[subj]?.practical ? 'input-error' : ''
                            }`}
                          />
                          {errors?.marks?.[sIdx]?.[subj]?.practical && (
                            <p className="text-red-500 text-xs mt-1">
                              Max {getMaxMarks(subj, 'practical')}
                            </p>
                          )}
                        </td>

                        <td className="border p-2 font-medium">{total}</td>
                        <td className="border p-2 font-medium">{grade}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}

          <button type="submit" className="btn bg-green-800 hover:bg-green-700 text-white w-full">
            Save Marks
          </button>
        </form>
      )}
    </div>
  );
};

export default AddMarks;
