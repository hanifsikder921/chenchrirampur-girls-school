import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { motion } from 'framer-motion';
// import useAxios from '../../assets/hooks/useAxios';
import useAuth from '../../assets/hooks/useAuth';
import useAxiosSecure from './../../assets/hooks/useAxiosSecure';

const TeacherProfile = () => {
  const { user, loading, logoutUser } = useAuth();
  const axios = useAxiosSecure();

  const { data, isLoading, error } = useQuery({
    queryKey: ['allteachers'],
    queryFn: async () => {
      const res = await axios.get('/teachers');
      return res.data;
    },
    retry: 1,
  });

  const teachers = data?.data || [];

  // Better email matching with case insensitivity and trimming
  const teacherInfo = teachers.find((teacher) => {
    if (!teacher?.email || !user?.email) return false;

    const teacherEmail = teacher.email.trim().toLowerCase();
    const userEmail = user.email.trim().toLowerCase();

    return teacherEmail === userEmail;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading profile data</div>
      </div>
    );
  }

  if (!teacherInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No profile information found</div>
      </div>
    );
  }

  const {
    fullName,
    fullNameBangla,
    gender,
    dob,
    nid,
    phone,
    address,
    designation,
    subject,
    indexno,
    image,
    email,
    role,
    assignSubject = [],
  } = teacherInfo;

  // Calculate age from DOB
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const age = calculateAge(dob);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Profile Header */}
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col md:flex-row items-center">
                <motion.div whileHover={{ scale: 1.05 }} className="relative mb-4 md:mb-0 md:mr-6">
                  <img
                    src={image || '/default-avatar.png'}
                    alt={fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-6 h-6 border-2 border-white"></div>
                </motion.div>

                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold">{fullName}</h1>
                  {fullNameBangla && <p className="text-lg md:text-xl mt-1">{fullNameBangla}</p>}
                  <p className="text-white mt-2 border rounded-2xl text-center bg-green-800 font-bold">
                    {designation} - {subject}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start mt-3 gap-2">
                    <span className="bg-blue-500 bg-opacity-25 px-3 py-1 rounded-full text-sm">
                      INDEX NO: {indexno}
                    </span>
                    <span className="bg-blue-500 bg-opacity-25 px-3 py-1 rounded-full text-sm">
                      {role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Retirement Section */}
              <div className="text-right mt-4 md:mt-0">
                {(() => {
                  const retirementAge = 60; // retirement age
                  const dobDate = new Date(dob);
                  const retirementDate = new Date(
                    dobDate.getFullYear() + retirementAge,
                    dobDate.getMonth(),
                    dobDate.getDate()
                  );

                  const now = new Date();
                  let diff = retirementDate - now;

                  if (diff <= 0) {
                    return (
                      <div>
                        <p className="font-semibold">অবসরের তথ্য</p>
                        <p>ইতিমধ্যেই অবসর নিয়েছেন</p>
                      </div>
                    );
                  }

                  // calculate parts
                  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
                  diff -= years * 1000 * 60 * 60 * 24 * 365;

                  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
                  diff -= months * 1000 * 60 * 60 * 24 * 30;

                  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                  diff -= days * 1000 * 60 * 60 * 24;

                  const hours = Math.floor(diff / (1000 * 60 * 60));

                  return (
                    <div>
                      <p className="font-semibold">অবসরের তথ্য</p>
                      <p>
                        বাকি আছে: {years} বছর {months} মাস {days} দিন {hours} ঘণ্টা
                      </p>
                      <p>
                        অবসরে যাওয়ার তারিখ:{' '}
                        {retirementDate.toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{phone || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">
                    {dob} ({age} years)
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{gender}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">NID</p>
                  <p className="font-medium">{nid || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{address || 'N/A'}</p>
                </div>
              </div>
            </motion.div>

            {/* Assigned Subjects */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Assigned Subjects
                <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {assignSubject.length}
                </span>
              </h2>

              {assignSubject.length > 0 ? (
                <div className="space-y-4">
                  {assignSubject.map((subjectItem, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm border border-blue-100"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                          <span className="font-bold">{subjectItem.split('-')[0]}</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {subjectItem.split('-')[1]}
                          </h3>
                          <p className="text-sm text-gray-500">Class {subjectItem.split('-')[0]}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800">No subjects assigned yet.</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherProfile;
