import React, { useState } from 'react';
import useAxios from './../../../assets/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SubjectManagement = () => {
  const axios = useAxios();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState({});

  const { data: subjectData } = useQuery({
    queryKey: ['subjectJson'],
    queryFn: async () => {
      const res = await axios.get('/subjectJson');
      return res.data;
    },
  });

  const SubjectJSON = subjectData?.[0]?.classes;

  const { data, refetch } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await axios.get('/teachers');
      return res.data;
    },
    retry: 1,
  });

  const teachersStaff = data?.data || [];
  const actualTeachers = teachersStaff.filter((teacher) => teacher.subject !== 'N/A');

  // সকল সাবজেক্ট একত্রিত করার ফাংশন
  const getAllSubjects = () => {
    const allSubjects = {};

    if (!SubjectJSON) return allSubjects;

    // ক্লাস ৬, ৭, ৮ এর সাবজেক্ট
    ['6', '7', '8'].forEach((cls) => {
      if (SubjectJSON[cls]?.subjects) {
        allSubjects[cls] = SubjectJSON[cls].subjects;
      }
    });

    // ক্লাস ৯ এবং ১০ এর সাবজেক্ট
    ['9', '10'].forEach((cls) => {
      if (SubjectJSON[cls]) {
        const classSubjects = [];

        // কমন সাবজেক্ট
        if (SubjectJSON[cls].common_subjects) {
          classSubjects.push(...SubjectJSON[cls].common_subjects);
        }

        // গ্রুপ সাবজেক্ট
        if (SubjectJSON[cls].groups) {
          Object.values(SubjectJSON[cls].groups).forEach((group) => {
            if (group.subjects) {
              classSubjects.push(...group.subjects);
            }
          });
        }

        // অতিরিক্ত সাবজেক্ট (ক্লাস ৯)
        if (cls === '9' && SubjectJSON[cls].additional?.subjects) {
          classSubjects.push(...SubjectJSON[cls].additional.subjects);
        }

        allSubjects[cls] = classSubjects;
      }
    });

    return allSubjects;
  };

  const allSubjects = getAllSubjects();

  // সাবজেক্ট এসাইন করার ফাংশন
  const handleAssignSubject = async (teacherId) => {
    try {
      MySwal.fire({
        title: 'সাবজেক্ট এসাইন করা হচ্ছে...',
        allowOutsideClick: false,
        didOpen: () => MySwal.showLoading(),
      });

      const response = await axios.put(`/teachers/${teacherId}`, {
        assignSubject: assignedSubjects[teacherId] || [],
      });

      MySwal.fire({
        title: 'সফল!',
        text: 'সাবজেক্ট সফলভাবে এসাইন করা হয়েছে',
        icon: 'success',
        confirmButtonText: 'ঠিক আছে',
      });

      refetch();
      setSelectedTeacher(null);
    } catch (error) {
      MySwal.fire({
        title: 'ত্রুটি!',
        text: 'সাবজেক্ট এসাইন করতে সমস্যা হয়েছে',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে',
      });
    }
  };

  // সাবজেক্ট সিলেক্ট/ডিসিলেক্ট করার ফাংশন
  const handleSubjectToggle = (teacherId, subjectName, className) => {
    setAssignedSubjects((prev) => {
      const currentSubjects = prev[teacherId] || [];
      const subjectKey = `${className}-${subjectName}`;

      if (currentSubjects.includes(subjectKey)) {
        return {
          ...prev,
          [teacherId]: currentSubjects.filter((sub) => sub !== subjectKey),
        };
      } else {
        return {
          ...prev,
          [teacherId]: [...currentSubjects, subjectKey],
        };
      }
    });
  };

  // মডাল খোলার ফাংশন
  const openSubjectModal = (teacher) => {
    setSelectedTeacher(teacher);
    // যদি আগে থেকে এসাইন করা সাবজেক্ট থাকে তবে সেট করা
    if (teacher.assignSubject) {
      setAssignedSubjects((prev) => ({
        ...prev,
        [teacher.id]: teacher.assignSubject,
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">সাবজেক্ট ম্যানেজমেন্ট</h1>
        <p className="text-blue-100 mt-2">শিক্ষকদের জন্য সাবজেক্ট এসাইন করুন</p>
      </div>

      {/* শিক্ষকদের কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {actualTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <img
                src={teacher.image || '/default-avatar.png'}
                alt={teacher.fullName}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100"
              />
              <div className="text-center mt-4">
                <h3 className="text-lg font-semibold text-gray-800">{teacher.fullName}</h3>
                <p className="text-sm text-gray-600">{teacher.designation}</p>
                <p className="text-sm text-blue-600 mt-1">{teacher.subject}</p>

                {/* এসাইন করা সাবজেক্ট দেখানো */}
                {teacher.assignSubject && teacher.assignSubject.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700">এসাইন করা সাবজেক্ট:</p>
                    <div className="mt-1">
                      {teacher.assignSubject.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                        >
                          {subject.split('-')[1]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => openSubjectModal(teacher)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
              >
                সাবজেক্ট এসাইন করুন
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* সাবজেক্ট এসাইনমেন্ট মডাল */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedTeacher.fullName} - সাবজেক্ট এসাইনমেন্ট
                </h2>
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(allSubjects).map(([className, subjects]) => (
                  <div key={className} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">ক্লাস {className}</h3>
                    <div className="space-y-2">
                      {subjects.map((subject, index) => {
                        const subjectKey = `${className}-${subject.name}`;
                        const isSelected =
                          assignedSubjects[selectedTeacher.id]?.includes(subjectKey);

                        return (
                          <label key={index} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                handleSubjectToggle(selectedTeacher.id, subject.name, className)
                              }
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{subject.name}</span>
                            <span className="text-xs text-gray-500">({subject.mark})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  onClick={() => handleAssignSubject(selectedTeacher.id)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  সেভ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;
