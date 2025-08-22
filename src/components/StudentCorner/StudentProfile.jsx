import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPrint,
  FaSchool,
  FaTint,
  FaPray,
  FaUsers,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxios from '../../assets/hooks/useAxios';

const StudentProfile = () => {
  const axios = useAxios();
  const [uid, setUid] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchStudent = async () => {
    if (!uid.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'UID প্রয়োজন',
        text: 'দয়া করে UID লিখুন',
        confirmButtonColor: '#3B82F6',
      });
      return;
    }

    setLoading(true);
    try {
      let foundStudent = null;

      // প্রথমে UID দিয়ে exact match খোঁজুন
      try {
        const uidRes = await axios.get(`/students/uid/${uid}`);
        if (uidRes.data.success) {
          foundStudent = uidRes.data.data;
        }
      } catch (uidError) {
        console.log('UID search failed, trying general search...');
      }

      // UID দিয়ে না পেলে general search করুন
      if (!foundStudent) {
        const searchRes = await axios.get(`/students?search=${uid}&limit=100`);

        if (searchRes.data.success && searchRes.data.data && searchRes.data.data.length > 0) {
          // Exact roll match খুঁজুন
          let exactMatch = searchRes.data.data.find((s) => s.roll === uid);

          // Exact UID match খুঁজুন (response এ uid field থাকলে)
          if (!exactMatch) {
            exactMatch = searchRes.data.data.find((s) => s.uid === uid);
          }

          // যদি exact match না পাওয়া যায়, প্রথম result নিন
          foundStudent = exactMatch || searchRes.data.data[0];

          // Full details এর জন্য individual student fetch করুন
          if (foundStudent && foundStudent.id) {
            try {
              const fullRes = await axios.get(`/students/${foundStudent.id}`);
              if (fullRes.data.success) {
                foundStudent = fullRes.data.data;
              }
            } catch (fullError) {
              console.log('Full details fetch failed, using search result');
            }
          }
        }
      }

      if (foundStudent) {
        setStudent(foundStudent);
        Swal.fire({
          icon: 'success',
          title: 'শিক্ষার্থী পাওয়া গেছে!',
          text: `${foundStudent.name} এর তথ্য লোড হয়েছে`,
          timer: 1000,
          showConfirmButton: false,
        });
      } else {
        setStudent(null);
        Swal.fire({
          icon: 'error',
          title: 'শিক্ষার্থী পাওয়া যায়নি',
          text: 'এই UID দিয়ে কোন শিক্ষার্থী খুঁজে পাওয়া যায়নি',
          confirmButtonColor: '#EF4444',
        });
      }

      setSearched(true);
    } catch (error) {
      console.error('Error searching student:', error);
      Swal.fire({
        icon: 'error',
        title: 'Opps !!',
        text: ' কোন শিক্ষার্থী পাওয়া যায়নি',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">শিক্ষার্থী প্রোফাইল</h1>
          <p className="text-gray-600">UID দিয়ে শিক্ষার্থীর তথ্য খুঁজুন</p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">শিক্ষার্থী UID</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="UID লিখুন"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && searchStudent()}
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={searchStudent}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <FaSearch />
              )}
              {loading ? 'খোঁজা হচ্ছে...' : 'খুঁজুন'}
            </motion.button>
          </div>
        </motion.div>

        {/* Student Profile */}
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {student ? (
              <>
                {/* Profile Card */}
                <div
                  id="student-profile-print"
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  {/* Header with Image */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <img
                          src={student.image || '/default-avatar.png'}
                          alt={student.name}
                          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                        <div
                          className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${
                            student.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        ></div>
                      </motion.div>
                      <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2">{student.name}</h2>
                        <p className="text-blue-100 text-lg mb-1">রোল: {student.roll}</p>
                        {student.uid && <p className="text-blue-100">UID: {student.uid}</p>}
                        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                          <FaSchool />
                          <span>
                            ক্লাস {student.dclassName} {student.section && `- ${student.section}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Personal Information */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
                          ব্যক্তিগত তথ্য
                        </h3>

                        {student.dob && (
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-blue-500" />
                            <div>
                              <p className="text-sm text-gray-600">জন্ম তারিখ</p>
                              <p className="font-medium">{formatDate(student.dob)}</p>
                            </div>
                          </div>
                        )}

                        {student.gender && (
                          <div className="flex items-center gap-3">
                            <FaUsers className="text-blue-500" />
                            <div>
                              <p className="text-sm text-gray-600">লিঙ্গ</p>
                              <p className="font-medium">{student.gender}</p>
                            </div>
                          </div>
                        )}

                        {student.bloodGroup && (
                          <div className="flex items-center gap-3">
                            <FaTint className="text-red-500" />
                            <div>
                              <p className="text-sm text-gray-600">রক্তের গ্রুপ</p>
                              <p className="font-medium">{student.bloodGroup}</p>
                            </div>
                          </div>
                        )}

                        {student.religion && (
                          <div className="flex items-center gap-3">
                            <FaPray className="text-green-500" />
                            <div>
                              <p className="text-sm text-gray-600">ধর্ম</p>
                              <p className="font-medium">{student.religion}</p>
                            </div>
                          </div>
                        )}

                        {student.admissionDate && (
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-purple-500" />
                            <div>
                              <p className="text-sm text-gray-600">ভর্তির তারিখ</p>
                              <p className="font-medium">{formatDate(student.admissionDate)}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Family Information */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-green-500 pb-2">
                          পারিবারিক তথ্য
                        </h3>

                        <div className="space-y-3">
                          {student.fatherName && (
                            <div>
                              <p className="text-sm text-gray-600">পিতার নাম</p>
                              <p className="font-medium">{student.fatherName}</p>
                              {student.fatherOccupation && (
                                <p className="text-xs text-gray-500">{student.fatherOccupation}</p>
                              )}
                            </div>
                          )}

                          {student.motherName && (
                            <div>
                              <p className="text-sm text-gray-600">মাতার নাম</p>
                              <p className="font-medium">{student.motherName}</p>
                              {student.motherOccupation && (
                                <p className="text-xs text-gray-500">{student.motherOccupation}</p>
                              )}
                            </div>
                          )}

                          {student.parentContact && (
                            <div className="flex items-center gap-3">
                              <FaPhone className="text-green-500" />
                              <div>
                                <p className="text-sm text-gray-600">অভিভাবক যোগাযোগ</p>
                                <p className="font-medium">{student.parentContact}</p>
                              </div>
                            </div>
                          )}

                          {student.emergencyContact && (
                            <div className="flex items-center gap-3">
                              <FaPhone className="text-red-500" />
                              <div>
                                <p className="text-sm text-gray-600">জরুরি যোগাযোগ</p>
                                <p className="font-medium">{student.emergencyContact}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Address & Contact */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-500 pb-2">
                          ঠিকানা ও যোগাযোগ
                        </h3>

                        {(student.village ||
                          student.postOffice ||
                          student.upazila ||
                          student.district ||
                          student.division) && (
                          <div className="flex items-start gap-3">
                            <FaMapMarkerAlt className="text-red-500 mt-1" />
                            <div>
                              <p className="text-sm text-gray-600">ঠিকানা</p>
                              <div className="font-medium text-sm">
                                {student.village && <p>গ্রাম: {student.village}</p>}
                                {student.postOffice && <p>ডাকঘর: {student.postOffice}</p>}
                                {student.upazila && <p>উপজেলা: {student.upazila}</p>}
                                {student.district && <p>জেলা: {student.district}</p>}
                                {student.division && <p>বিভাগ: {student.division}</p>}
                              </div>
                            </div>
                          </div>
                        )}

                        {student.email && (
                          <div className="flex items-center gap-3">
                            <FaEnvelope className="text-blue-500" />
                            <div>
                              <p className="text-sm text-gray-600">ইমেইল</p>
                              <p className="font-medium">{student.email}</p>
                            </div>
                          </div>
                        )}

                        {student.previousSchool && (
                          <div>
                            <p className="text-sm text-gray-600">পূর্ববর্তী স্কুল</p>
                            <p className="font-medium">{student.previousSchool}</p>
                          </div>
                        )}

                        {student.notes && (
                          <div>
                            <p className="text-sm text-gray-600">মন্তব্য</p>
                            <p className="font-medium text-sm">{student.notes}</p>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Footer Info */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 pt-6 border-t border-gray-200"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-600">
                        <div>
                          {student.academicYear && (
                            <p>
                              <strong>শিক্ষাবর্ষ:</strong> {student.academicYear}
                            </p>
                          )}
                          {student.adminName && (
                            <p>
                              <strong>অ্যাডমিন:</strong> {student.adminName}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {student.createdAt && (
                            <p>
                              <strong>তৈরি:</strong> {formatDate(student.createdAt)}
                            </p>
                          )}
                          <p>
                            <strong>স্ট্যাটাস:</strong>
                            <span
                              className={`ml-2 px-2 py-1 rounded text-xs ${
                                student.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {student.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-2xl shadow-lg"
              >
                <div className="text-gray-400 mb-4">
                  <FaUser className="mx-auto text-6xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  কোন শিক্ষার্থী পাওয়া যায়নি
                </h3>
                <p className="text-gray-500">দয়া করে সঠিক UID, দিয়ে আবার চেষ্টা করুন</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
