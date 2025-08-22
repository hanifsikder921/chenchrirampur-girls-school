import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FaSchool,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaUpload,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaEdit,
  FaSave,
  FaImage,
  FaEye,
  FaCalendarAlt,
} from 'react-icons/fa';

import Swal from 'sweetalert2';
import useAxios from '../../../assets/hooks/useAxios';

const SchoolInfo = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [schoolLogo, setSchoolLogo] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [routinPreview, setRoutinPreview] = useState('');
  const [routinPhoto, setRoutinPhoto] = useState('');
  const [principalPhoto, setPrincipalPhoto] = useState('');
  const [principalPreview, setPrincipalPreview] = useState('');
  const [precidentPhoto, setPrecidentPhoto] = useState('');
  const [precidentPreview, setPrecidentPreview] = useState('');
  const [isUploading, setIsUploading] = useState({
    logo: false,
    principal: false,
    precident: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Fetch school data
  const { data: schoolData, isLoading } = useQuery({
    queryKey: ['schoolInfo'],
    queryFn: async () => {
      const response = await axios.get('/info');
      return response.data[0]; // Getting first school data
    },
  });

  // Update mutation
  // Replace your updateMutation with this improved version

  // Image upload handler
  const handleImageUpload = async (e, type) => {
    const image = e.target.files[0];
    if (!image) return;

    setIsUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('image', image);
      const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_upload_key
      }`;
      const res = await axios.post(imagUploadUrl, formData);

      const imageUrl = res.data.data.url;
      const preview = URL.createObjectURL(image);

      if (type === 'logo') {
        setSchoolLogo(imageUrl);
        setLogoPreview(preview);
        setValue('schoolLogo', imageUrl);
      } else if (type === 'principal') {
        setPrincipalPhoto(imageUrl);
        setPrincipalPreview(preview);
        setValue('principalPhoto', imageUrl);
      } else if (type === 'routin') {
        setRoutinPhoto(imageUrl);
        setRoutinPreview(preview);
        setValue('classRoutin', imageUrl);
      } else if (type === 'precident') {
        setPrecidentPhoto(imageUrl);
        setPrecidentPreview(preview);
        setValue('precidentPhoto', imageUrl);
      }
    } catch (error) {
      Swal.fire({
        title: 'ত্রুটি!',
        text: 'ছবি আপলোড করতে সমস্যা হয়েছে।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে',
      });
    } finally {
      setIsUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Set form values when data loads
  useEffect(() => {
    if (schoolData) {
      Object.keys(schoolData).forEach((key) => {
        if (key === 'grades' || key === 'facilities') {
          setValue(key, schoolData[key].join(', '));
        } else if (key === 'socialMedia') {
          setValue('facebook', schoolData[key].facebook);
          setValue('twitter', schoolData[key].twitter);
          setValue('linkedin', schoolData[key].linkedin);
        } else {
          setValue(key, schoolData[key]);
        }
      });

      setSchoolLogo(schoolData.schoolLogo);
      setLogoPreview(schoolData.schoolLogo);
      setPrincipalPhoto(schoolData.principalPhoto);
      setPrincipalPreview(schoolData.principalPhoto);
      setPrecidentPhoto(schoolData.precidentPhoto);
      setPrecidentPreview(schoolData.precidentPhoto);
      setRoutinPhoto(schoolData.classRoutin);
      setRoutinPreview(schoolData.classRoutin);
    }
  }, [schoolData, setValue]);

  // Replace your onSubmit function in SchoolInfo.jsx with this:

  const onSubmit = (data) => {
    console.log('Form Data Before Processing:', data);

    // const formattedData = {
    //   ...data,
    //   grades: data.grades ? data.grades.split(',').map((grade) => grade.trim()) : [],
    //   facilities: data.facilities
    //     ? data.facilities.split(',').map((facility) => facility.trim())
    //     : [],
    //   socialMedia: {
    //     facebook: data.facebook || '',
    //     twitter: data.twitter || '',
    //     linkedin: data.linkedin || '',
    //   },
    //   schoolLogo: schoolLogo || data.schoolLogo || '',
    //   principalPhoto: principalPhoto || data.principalPhoto || '',
    //   precidentPhoto: precidentPhoto || data.precidentPhoto || '',
    //   routinPhoto: routinPhoto || data.routinPhoto || '',
    // };
    const formattedData = {
      ...data,
      grades: data.grades ? data.grades.split(',').map((g) => g.trim()) : [],
      facilities: data.facilities ? data.facilities.split(',').map((f) => f.trim()) : [],
      socialMedia: {
        facebook: data.facebook || '',
        twitter: data.twitter || '',
        linkedin: data.linkedin || '',
      },
      schoolLogo: schoolLogo || data.schoolLogo || '',
      principalPhoto: principalPhoto || data.principalPhoto || '',
      precidentPhoto: precidentPhoto || data.precidentPhoto || '',
      classRoutin: routinPhoto || data.classRoutin || '', // ✅ এখানে classRoutin পাঠাও
    };

    // // Remove individual social media fields from main object
    // delete formattedData.facebook;
    // delete formattedData.twitter;
    // delete formattedData.linkedin;

    updateMutation.mutate(formattedData);
  };

  // Also update your mutation to have better logging:
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      try {
        console.log('Sending update request with data:', data);
        console.log('School ID:', schoolData?._id);

        const response = await axios.patch(`/info/${schoolData._id}`, data);
        console.log('Update successful:', response.data);
        return response.data;
      } catch (error) {
        console.error('Update Error Details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['schoolInfo']);
      Swal.fire({
        title: 'সফল!',
        text: 'স্কুলের তথ্য সফলভাবে আপডেট হয়েছে।',
        icon: 'success',
        confirmButtonText: 'ঠিক আছে',
      });
    },
    onError: (error) => {
      console.error('Mutation Error:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'তথ্য আপডেট করতে সমস্যা হয়েছে।';

      Swal.fire({
        title: 'ত্রুটি!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'ঠিক আছে',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaSchool className="text-3xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">স্কুল তথ্য আপডেট ড্যাশবোর্ড</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* School Logo Upload */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <FaImage className="text-blue-600" />
                স্কুল লোগো
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                {logoPreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-32 h-32 object-contain mx-auto rounded-lg"
                      />
                    </div>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <FaEdit />
                      লোগো পরিবর্তন করুন
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        className="hidden"
                        disabled={isUploading.logo}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <FaUpload className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-600">লগো আপলোড করুন</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                      disabled={isUploading.logo}
                    />
                  </label>
                )}
                {isUploading.logo && <p className="text-blue-600 mt-2">আপলোড হচ্ছে...</p>}
              </div>
            </div>

            {/* Principal Photo Upload */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <FaUser className="text-blue-600" />
                প্রধান শিক্ষকের ছবি
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                {principalPreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <img
                        src={principalPreview}
                        alt="Principal Preview"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                    </div>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <FaEdit />
                      ছবি পরিবর্তন করুন
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'principal')}
                        className="hidden"
                        disabled={isUploading.principal}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <FaUpload className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-600">ছবি আপলোড করুন</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'principal')}
                      className="hidden"
                      disabled={isUploading.principal}
                    />
                  </label>
                )}
                {isUploading.principal && <p className="text-blue-600 mt-2">আপলোড হচ্ছে...</p>}
              </div>
            </div>

            {/* President Photo Upload */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <FaUser className="text-blue-600" />
                সভাপতির ছবি
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                {precidentPreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <img
                        src={precidentPreview}
                        alt="President Preview"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                    </div>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <FaEdit />
                      ছবি পরিবর্তন করুন
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'precident')}
                        className="hidden"
                        disabled={isUploading.precident}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <FaUpload className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-600">ছবি আপলোড করুন</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'precident')}
                      className="hidden"
                      disabled={isUploading.precident}
                    />
                  </label>
                )}
                {isUploading.precident && <p className="text-blue-600 mt-2">আপলোড হচ্ছে...</p>}
              </div>
            </div>
          </motion.div>

          {/* School Basic Information */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaSchool className="text-blue-600" />
                স্কুলের নাম (বাংলা)
              </label>
              <input
                {...register('schoolName_bn', { required: 'এই ফিল্ডটি আবশ্যক' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="স্কুলের নাম বাংলায়"
              />
              {errors.schoolName_bn && (
                <p className="text-red-500 text-sm">{errors.schoolName_bn.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaSchool className="text-blue-600" />
                স্কুলের নাম (ইংরেজি)
              </label>
              <input
                {...register('schoolName_en', { required: 'এই ফিল্ডটি আবশ্যক' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="School Name in English"
              />
              {errors.schoolName_en && (
                <p className="text-red-500 text-sm">{errors.schoolName_en.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                EIIN নম্বর
              </label>
              <input
                {...register('EIIN', { required: 'এই ফিল্ডটি আবশ্যক' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="EIIN নম্বর"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaCalendarAlt className="text-blue-600" />
                প্রতিষ্ঠার বছর
              </label>
              <input
                {...register('establishedYear')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="প্রতিষ্ঠার বছর"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">MPO কোড</label>
              <input
                {...register('MPOCode')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="MPO কোড"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">স্কুলের ধরন</label>
              <input
                {...register('schoolType')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="স্কুলের ধরন"
              />
            </div>
          </motion.div>

          {/* Location Information */}
          <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaMapMarkerAlt className="text-blue-600" />
                উপজেলা
              </label>
              <input
                {...register('upazila')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="উপজেলা"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaMapMarkerAlt className="text-blue-600" />
                জেলা
              </label>
              <input
                {...register('district')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="জেলা"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaMapMarkerAlt className="text-blue-600" />
                বিভাগ
              </label>
              <input
                {...register('division')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="বিভাগ"
              />
            </div>
          </motion.div>

          {/* Address */}
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaMapMarkerAlt className="text-blue-600" />
              ঠিকানা
            </label>
            <textarea
              {...register('address')}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="সম্পূর্ণ ঠিকানা"
            ></textarea>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaPhone className="text-blue-600" />
                ফোন নম্বর
              </label>
              <input
                {...register('phone')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ফোন নম্বর"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaEnvelope className="text-blue-600" />
                ইমেইল
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ইমেইল ঠিকানা"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaGlobe className="text-blue-600" />
                ওয়েবসাইট
              </label>
              <input
                {...register('website')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ওয়েবসাইট URL"
              />
            </div>
          </motion.div>

          {/* Staff Information */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaUser className="text-blue-600" />
                প্রধান শিক্ষক
              </label>
              <input
                {...register('principal')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="প্রধান শিক্ষকের নাম"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaUser className="text-blue-600" />
                সভাপতি
              </label>
              <input
                {...register('precident')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="সভাপতির নাম"
              />
            </div>
          </motion.div>

          {/* School Details */}
          <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">শিফট</label>
              <input
                {...register('shift')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="শিফট"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">মাধ্যম</label>
              <input
                {...register('medium')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="শিক্ষার মাধ্যম"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">মোট শিক্ষার্থী</label>
              <input
                {...register('totalStudents')}
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="মোট শিক্ষার্থী"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">মোট শিক্ষক</label>
              <input
                {...register('totalTeachers')}
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="মোট শিক্ষক"
              />
            </div>
          </motion.div>

          {/* Grades and Facilities */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                শ্রেণীসমূহ (কমা দিয়ে আলাদা করুন)
              </label>
              <input
                {...register('grades')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="৬, ৭, ৮, ৯, ১০"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                সুবিধাসমূহ (কমা দিয়ে আলাদা করুন)
              </label>
              <input
                {...register('facilities')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="কম্পিউটার ল্যাব, বিজ্ঞান ল্যাব, লাইব্রেরি"
              />
            </div>
          </motion.div>

          {/* Mission and Vision */}
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">লক্ষ্য</label>
              <textarea
                {...register('mission')}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="স্কুলের লক্ষ্য"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">দৃষ্টিভঙ্গি</label>
              <textarea
                {...register('vision')}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="স্কুলের দৃষ্টিভঙ্গি"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">আমাদের সম্পর্কে</label>
              <textarea
                {...register('aboutUs')}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="স্কুলের বর্ননা এখানে দিন"
              ></textarea>
            </div>
          </motion.div>

          {/* Class Routine and Notice */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* School Logo Upload */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <FaImage className="text-blue-600" />
                ক্লাস রুটিন
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                {routinPreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <img
                        src={routinPreview}
                        alt="routin Preview"
                        className="w-32 h-32 object-contain mx-auto rounded-lg"
                      />
                    </div>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <FaEdit />
                      রুটিন পরিবর্তন করুন
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'routin')}
                        className="hidden"
                        disabled={isUploading.logo}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <FaUpload className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-600">ক্লাস রুটিন আপলোড করুন</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'routin')}
                      className="hidden"
                      disabled={isUploading.logo}
                    />
                  </label>
                )}
                {isUploading.logo && <p className="text-blue-600 mt-2">আপলোড হচ্ছে...</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">স্ক্রোল নোটিশ</label>
              <textarea
                {...register('scrollNotice')}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="স্ক্রোল নোটিশ"
              ></textarea>
            </div>
          </motion.div>

          {/* Social Media Links */}
          <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              সোশ্যাল মিডিয়া লিংক
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaFacebook className="text-blue-600" />
                  ফেসবুক
                </label>
                <input
                  {...register('facebook')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="ফেসবুক পেজ লিংক"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaTwitter className="text-blue-400" />
                  টুইটার
                </label>
                <input
                  {...register('twitter')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="টুইটার প্রোফাইল লিংক"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaYoutube className="text-blue-700" />
                  ইউটিউব
                </label>
                <input
                  {...register('youtube')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="ইউটিউব প্রোফাইল লিংক"
                />
              </div>
            </div>
          </motion.div>

          {/* Google Map Embed Link */}
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaMapMarkerAlt className="text-red-600" />
              গুগল ম্যাপ এম্বেড লিংক
            </label>
            <textarea
              {...register('mapEmbedLink')}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="গুগল ম্যাপ এম্বেড লিংক"
            ></textarea>
          </motion.div>

          {/* Submit Button */}
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {updateMutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <FaSave />
              )}
              {updateMutation.isPending ? 'আপডেট হচ্ছে...' : 'তথ্য আপডেট করুন'}
            </button>
          </motion.div>
        </form>
      </motion.div>

      {/* Preview Section */}
      {schoolData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaEye className="text-2xl text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">বর্তমান তথ্য প্রিভিউ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <img
                src={logoPreview || schoolData.schoolLogo}
                alt="School Logo"
                className="w-24 h-24 object-cover mx-auto rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = 'http://localhost:5173/public/logo.png';
                }}
              />
              <p className="text-sm text-gray-600 mt-2">স্কুল লগো</p>
            </div>

            <div className="text-center">
              <img
                src={principalPreview || schoolData.principalPhoto}
                alt="Principal Photo"
                className="w-24 h-24 object-cover mx-auto rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = 'http://localhost:5173/public/logo.png';
                }}
              />
              <p className="text-sm text-gray-600 mt-2">প্রধান শিক্ষক</p>
            </div>

            <div className="text-center">
              <img
                src={precidentPreview || schoolData.precidentPhoto}
                alt="President Photo"
                className="w-24 h-24 object-cover mx-auto rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = 'http://localhost:5173/public/logo.png';
                }}
              />
              <p className="text-sm text-gray-600 mt-2">সভাপতি</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>স্কুলের নাম:</strong> {schoolData.schoolName_bn}
            </div>
            <div>
              <strong>EIIN:</strong> {schoolData.EIIN}
            </div>
            <div>
              <strong>প্রতিষ্ঠার বছর:</strong> {schoolData.establishedYear}
            </div>
            <div>
              <strong>মোট শিক্ষার্থী:</strong> {schoolData.totalStudents}
            </div>
            <div>
              <strong>মোট শিক্ষক:</strong> {schoolData.totalTeachers}
            </div>
            <div>
              <strong>ঠিকানা:</strong> {schoolData.address}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SchoolInfo;
