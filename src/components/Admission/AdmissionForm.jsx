import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  FaUserGraduate,
  FaPhone,
  FaHome,
  FaCalendarAlt,
  FaEnvelope,
  FaIdCard,
  FaGraduationCap,
  FaUsers,
  FaMale,
  FaFemale,
  FaBookOpen,
  FaFileAlt,
} from 'react-icons/fa';
import useAxios from '../../assets/hooks/useAxios';
import Swal from 'sweetalert2';

const AdmissionForm = () => {
  const axios = useAxios();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const selectedClass = watch('className');

  const onSubmit = async (data) => {
    const studentData = {
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post('/admissionsPost', studentData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Admission Application submitted successfully',
        });
        reset();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: error?.response?.data?.message || 'Failed to add student',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
  };

  const FormField = ({ children, delay = 0 }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
      className="relative"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16 px-4">
      {/* Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', damping: 20 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <FaGraduationCap className="text-3xl text-white" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-3xl py-2 font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
          whileHover={{ scale: 1.02 }}
        >
          ভর্তি আবেদন ফরম
        </motion.h1>

        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          নিচের ফরমটি সম্পূর্ণ করে আপনার ভর্তির আবেদন জমা দিন। সকল তথ্য সঠিক ও সম্পূর্ণ দিতে হবে।
        </p>
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 border border-white/20 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30 -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30 translate-y-32 -translate-x-32" />

          {/* Student Information Section */}
          <div className="relative z-10">
            <motion.div
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaUserGraduate className="text-blue-600 mr-3" />
                ছাত্র/ছাত্রীর তথ্য
              </h2>
              <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded-full mb-8" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Student Name */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  <FaUserGraduate className="inline text-blue-600 mr-2" />
                  ছাত্র/ছাত্রীর নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('studentName', { required: 'নাম আবশ্যক' })}
                  placeholder="সম্পূর্ণ নাম লিখুন"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                />
                {errors.studentName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                    {errors.studentName.message}
                  </p>
                )}
              </FormField>

              {/* Gender */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  <FaUsers className="inline text-purple-600 mr-2" />
                  লিঙ্গ <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label
                    className={`flex items-center cursor-pointer rounded-xl px-4 py-3 border-2 border-gray-200 transition-colors ${
                      watch('gender') === 'male'
                        ? 'bg-green-500 text-white'
                        : 'bg-white/70 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value="male"
                      {...register('gender', { required: 'লিঙ্গ নির্বাচন করুন' })}
                      className="sr-only"
                    />
                    <FaMale className={`mr-2 ${watch('gender') === 'male' ? 'text-white' : 'text-blue-600'}`} />
                    <span>পুরুষ</span>
                  </label>
                  <label
                    className={`flex items-center cursor-pointer rounded-xl px-4 py-3 border-2 border-gray-200 transition-colors ${
                      watch('gender') === 'female'
                        ? 'bg-green-500 text-white'
                        : 'bg-white/70 hover:border-pink-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value="female"
                      {...register('gender', { required: 'লিঙ্গ নির্বাচন করুন' })}
                      className="sr-only"
                    />
                    <FaFemale className={`mr-2 ${watch('gender') === 'female' ? 'text-white' : 'text-pink-600'}`} />
                    <span>মহিলা</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-2">{errors.gender.message}</p>
                )}
              </FormField>

              {/* Father Name */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  পিতার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('fatherName', { required: 'পিতার নাম আবশ্যক' })}
                  placeholder="পিতার সম্পূর্ণ নাম"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/70"
                />
                {errors.fatherName && (
                  <p className="text-red-500 text-sm mt-2">{errors.fatherName.message}</p>
                )}
              </FormField>

              {/* Mother Name */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  মাতার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('motherName', { required: 'মাতার নাম আবশ্যক' })}
                  placeholder="মাতার সম্পূর্ণ নাম"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/70"
                />
                {errors.motherName && (
                  <p className="text-red-500 text-sm mt-2">{errors.motherName.message}</p>
                )}
              </FormField>

              {/* Date of Birth */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  <FaCalendarAlt className="inline text-purple-600 mr-2" />
                  জন্ম তারিখ <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('dob', { required: 'জন্ম তারিখ আবশ্যক' })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/70"
                />
                {errors.dob && <p className="text-red-500 text-sm mt-2">{errors.dob.message}</p>}
              </FormField>

              {/* National ID/Birth Certificate */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  <FaIdCard className="inline text-indigo-600 mr-2" />
                  জন্ম নিবন্ধন নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('birthCertificate', { required: 'জন্ম নিবন্ধন নম্বর আবশ্যক' })}
                  placeholder="17-সংখ্যার জন্ম নিবন্ধন নম্বর"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-white/70"
                />
                {errors.birthCertificate && (
                  <p className="text-red-500 text-sm mt-2">{errors.birthCertificate.message}</p>
                )}
              </FormField>
            </div>

            {/* Contact Information Section */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaPhone className="text-green-600 mr-3" />
                যোগাযোগের তথ্য
              </h2>
              <div className="w-full h-0.5 bg-gradient-to-r from-green-500 to-transparent rounded-full mb-8" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Phone */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  <FaPhone className="inline text-green-600 mr-2" />
                  মোবাইল নাম্বার <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('phone', {
                    required: 'মোবাইল নাম্বার আবশ্যক',
                    pattern: {
                      value: /^01[0-9]{9}$/,
                      message: 'সঠিক মোবাইল নাম্বার লিখুন',
                    },
                  })}
                  placeholder="01XXXXXXXXX"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white/70"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>
                )}
              </FormField>

              {/* Email */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  <FaEnvelope className="inline text-blue-600 mr-2" />
                  ইমেইল ঠিকানা
                </label>
                <input
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'সঠিক ইমেইল ঠিকানা লিখুন',
                    },
                  })}
                  placeholder="example@email.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/70"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                )}
              </FormField>

              {/* Guardian Phone */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  অভিভাবকের মোবাইল নাম্বার
                </label>
                <input
                  type="text"
                  {...register('guardianPhone', {
                    pattern: {
                      value: /^01[0-9]{9}$/,
                      message: 'সঠিক মোবাইল নাম্বার লিখুন',
                    },
                  })}
                  placeholder="01XXXXXXXXX"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white/70"
                />
                {errors.guardianPhone && (
                  <p className="text-red-500 text-sm mt-2">{errors.guardianPhone.message}</p>
                )}
              </FormField>

              {/* Emergency Contact */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  জরুরি যোগাযোগের নম্বর
                </label>
                <input
                  type="text"
                  {...register('emergencyContact')}
                  placeholder="01XXXXXXXXX"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-white/70"
                />
              </FormField>
            </div>

            {/* Academic Information Section */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaBookOpen className="text-indigo-600 mr-3" />
                শিক্ষাগত তথ্য
              </h2>
              <div className="w-full h-0.5 bg-gradient-to-r from-indigo-500 to-transparent rounded-full mb-8" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Class */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  ভর্তিচ্ছু ক্লাস <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('className', { required: 'ক্লাস আবশ্যক' })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/70"
                >
                  <option value="">ক্লাস নির্বাচন করুন</option>
                  <option value="6">ষষ্ঠ শ্রেণি</option>
                  <option value="7">সপ্তম শ্রেণি</option>
                  <option value="8">অষ্টম শ্রেণি</option>
                  <option value="9">নবম শ্রেণি</option>
                  <option value="10">দশম শ্রেণি</option>
                </select>
                {errors.className && (
                  <p className="text-red-500 text-sm mt-2">{errors.className.message}</p>
                )}
              </FormField>

              {/* Group (if class 9 or 10) */}
              {(selectedClass === 'nine' || selectedClass === 'ten') && (
                <FormField>
                  <label className="block mb-3 font-semibold text-gray-700 text-lg">
                    গ্রুপ <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('group', {
                      required:
                        selectedClass === 'nine' || selectedClass === 'ten'
                          ? 'গ্রুপ নির্বাচন করুন'
                          : false,
                    })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-white/70"
                  >
                    <option value="">গ্রুপ নির্বাচন করুন</option>
                    <option value="science">বিজ্ঞান</option>
                    <option value="commerce">ব্যবসায় শিক্ষা</option>
                    <option value="arts">মানবিক</option>
                  </select>
                  {errors.group && (
                    <p className="text-red-500 text-sm mt-2">{errors.group.message}</p>
                  )}
                </FormField>
              )}

              {/* Previous School */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  পূর্ববর্তী শিক্ষা প্রতিষ্ঠান
                </label>
                <input
                  type="text"
                  {...register('previousSchool')}
                  placeholder="পূর্ববর্তী স্কুলের নাম"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/70"
                />
              </FormField>

              {/* Previous Result */}
              <FormField>
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  পূর্ববর্তী পরীক্ষার ফলাফল
                </label>
                <input
                  type="text"
                  {...register('previousResult')}
                  placeholder="GPA বা গ্রেড"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white/70"
                />
              </FormField>
            </div>

            {/* Address */}
            <FormField>
              <label className="block mb-3 font-semibold text-gray-700 text-lg">
                <FaHome className="inline text-orange-600 mr-2" />
                বর্তমান ঠিকানা <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('address', { required: 'ঠিকানা আবশ্যক' })}
                rows="4"
                placeholder="সম্পূর্ণ ঠিকানা লিখুন (গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা)"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/70"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-2">{errors.address.message}</p>
              )}
            </FormField>

            {/* Additional Information */}
            <FormField>
              <label className="block mb-3 font-semibold text-gray-700 text-lg mt-8">
                <FaFileAlt className="inline text-gray-600 mr-2" />
                অতিরিক্ত তথ্য
              </label>
              <textarea
                {...register('additionalInfo')}
                rows="3"
                placeholder="কোন বিশেষ প্রয়োজন বা তথ্য থাকলে এখানে লিখুন"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-300 bg-white/70"
              />
            </FormField>

            {/* Submit Button */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: 'spring', damping: 15 }}
            >
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-12 py-4 rounded-2xl shadow-xl text-lg flex items-center justify-center mx-auto gap-3 relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <FaGraduationCap className="text-xl" />
                ভর্তি আবেদন জমা দিন
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ x: [0, 6, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.button>

              <motion.p
                className="text-sm text-gray-500 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                আবেদন জমা দেওয়ার পর আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব
              </motion.p>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AdmissionForm;
