import React, { useState, useEffect } from 'react';
import useAxios from './../../../assets/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useAxiosSecure from '../../../assets/hooks/useAxiosSecure';

const MySwal = withReactContent(Swal);

const SubjectManagement = () => {
  const axios = useAxiosSecure();
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

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await axios.get('/teachers');
      return res.data;
    },
    retry: 1,
  });

  // শিক্ষকদের ডেটা লোড হলে তাদের এসাইন করা সাবজেক্টগুলো স্টেটে সেট করুন
  useEffect(() => {
    if (data?.data) {
      const initialAssignedSubjects = {};
      data.data.forEach((teacher) => {
        if (teacher.assignSubject && teacher.assignSubject.length > 0) {
          initialAssignedSubjects[teacher.id] = teacher.assignSubject;
        }
      });
      setAssignedSubjects(initialAssignedSubjects);
    }
  }, [data]);

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
    // ডেটা আগে থেকেই লোড করা আছে, তাই শুধু সেট করা লাগবে না
  };

  if (isLoading) {
    return <div className="text-center py-10">লোড হচ্ছে...</div>;
  }

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
          

                {/* এসাইন করা সাবজেক্ট দেখানো */}
            
                {(assignedSubjects[teacher.id] || []).map((subject, index) => {
                  let subjectName = '';

                  if (typeof subject === 'string') {
                    // case: "6-Bangla 2nd"
                    subjectName = subject.split('-')[1] || subject;
                  } else if (typeof subject === 'object' && subject !== null) {
                    // case: { className: "6", subjectName: "English 2nd", ... }
                    subjectName = subject.subjectName || subject.name || JSON.stringify(subject);
                  }

                  return (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                    >
                      {subjectName}
                    </span>
                  );
                })}
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

      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white text-black bg-opacity-20  rounded-full w-20 h-20 p-1 overflow-hidden">
                    <img
                      className=" w-full h-full object-cover rounded-full"
                      src={selectedTeacher?.image}
                      alt=""
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTeacher.fullName}</h2>
                    <p className="text-blue-100 text-sm">{selectedTeacher.designation}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="bg-white bg-opacity-20 px-3 py-1 text-black rounded-full text-xs">
                        INDEX: {selectedTeacher.indexno}
                      </span>
                      <span className="bg-white text-black bg-opacity-20 px-3 py-1 rounded-full text-xs flex items-center">
                        <svg
                          className="w-3 h-3 mr-1 text-black"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        {assignedSubjects[selectedTeacher.id]?.length || 0} টি বিষয় নির্বাচিত
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 text-black hover:bg-red-200 cursor-pointer rounded-full transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800">বিষয় নির্বাচন করুন</h3>
                </div>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  শিক্ষকের জন্য উপযুক্ত বিষয়সমূহ নির্বাচন করুন। একাধিক ক্লাস ও বিষয় নির্বাচন করা
                  যাবে।
                </p>
              </div>

              {/* Subjects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(allSubjects).map(([className, subjects]) => (
                  <div key={className} className=" p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {className}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">ক্লাস {className}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {subjects.length} টি বিষয়
                      </span>
                    </div>

                    <div className="space-y-3">
                      {subjects.map((subject, index) => {
                        const subjectKey = `${className}-${subject.name}`;
                        const isSelected =
                          assignedSubjects[selectedTeacher.id]?.includes(subjectKey);

                        return (
                          <label
                            key={index}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                              isSelected
                                ? 'bg-blue-50 border-blue-300 shadow-sm'
                                : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                            }`}
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={isSelected || false}
                                onChange={() =>
                                  handleSubjectToggle(selectedTeacher.id, subject.name, className)
                                }
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300 bg-white'
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="ml-3 flex-1">
                              <span
                                className={`text-sm font-medium ${
                                  isSelected ? 'text-blue-900' : 'text-gray-700'
                                }`}
                              >
                                {subject.name}
                              </span>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">মার্ক: {subject.mark}</span>
                                {subject.clsName && (
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                    {subject.clsName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Section */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">
                      {assignedSubjects[selectedTeacher.id]?.length || 0} টি বিষয়
                    </span>{' '}
                    নির্বাচিত
                  </div>
                  {(assignedSubjects[selectedTeacher.id]?.length || 0) > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">
                        পরিবর্তন সনাক্ত করা হয়েছে
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedTeacher(null)}
                    className="px-5 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>বাতিল</span>
                  </button>
                  <button
                    onClick={() => handleAssignSubject(selectedTeacher.id)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700  rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <span>সেভ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;
