import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// import useAxios from './../../../assets/hooks/useAxios';
import useAuth from './../../../assets/hooks/useAuth';
import {
  IoPersonAddOutline,
  IoCloudUploadOutline,
  IoPersonOutline,
  IoCallOutline,
  IoLocationOutline,
  IoSchoolOutline,
  IoIdCardOutline,
} from 'react-icons/io5';
import useAxiosSecure from '../../../assets/hooks/useAxiosSecure';

const MySwal = withReactContent(Swal);

const AddTeacher = () => {
  const axios = useAxiosSecure();
  const { user } = useAuth();
  const [teacherImage, setTeacherImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const genders = ['Male', 'Female', 'Other'];
  const designations = [
    'Head Teacher',
    'Assistant Head Teacher',
    'Assistant Teacher',
    'Office Assistant',
    'Computer Teacher',
    'Computer Lab Operator',
    'Librarian',
    'MLSS',
    'Cleaner',
    '4th Class Employee',
  ];
  const subjects = [
    'Bangla',
    'English',
    'Math',
    'Science',
    'History',
    'Geography',
    'Arts',
    'Islamic Studies',
    'Physical Education',
    'Physical Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Agriculture',
    'Higher Math',
    'Hindu Studies',
    'ICT',
    'Assistant Teacher (Islam)',
    'Assistant Teacher (Hindu)',
    'Religion',
    'N/A',
  ];

    const roles = ['employee', 'teacher', 'admin'];

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);

    const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    const res = await axios.post(imagUploadUrl, formData);
    setTeacherImage(res.data.data.url);
    setImagePreview(URL.createObjectURL(image));
  };

  const onSubmit = async (data) => {
    const teacherData = {
      ...data,
      image: teacherImage,
      adminName: user?.email,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post('/teachers', teacherData);
      if (res.data.insertedId) {
        MySwal.fire({
          icon: 'success',
          title: 'Teacher added successfully',
        });
        reset();
        setTeacherImage('');
        setImagePreview('');
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to add teacher';
      MySwal.fire({
        icon: 'error',
        title: errMsg,
      });
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';
  const errorClass = 'text-red-500 text-sm mt-1 flex items-center gap-1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <IoPersonAddOutline className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Add New Teacher
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill in the information below to add a new teacher to the system. All required fields
            are marked with an asterisk (*).
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <IoPersonOutline className="text-blue-600 text-lg" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Full Name English */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Full Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    placeholder="Enter full name in English"
                    className={inputClass}
                  />
                  {errors.fullName && <p className={errorClass}>⚠️ {errors.fullName.message}</p>}
                </div>

                {/* Full Name Bangla */}
                <div className="space-y-2">
                  <label className={labelClass}>Full Name (Bangla)</label>
                  <input
                    {...register('fullNameBangla')}
                    placeholder="বাংলায় পূর্ণ নাম লিখুন"
                    className={inputClass}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className={inputClass}
                  >
                    <option value="">Select gender</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                  {errors.gender && <p className={errorClass}>⚠️ {errors.gender.message}</p>}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('dob', { required: 'Date of birth is required' })}
                    className={inputClass}
                  />
                  {errors.dob && <p className={errorClass}>⚠️ {errors.dob.message}</p>}
                </div>

                {/* National ID */}
                <div className="space-y-2">
                  <label className={labelClass}>National ID / Passport No</label>
                  <input
                    {...register('nid')}
                    placeholder="Enter NID or Passport number"
                    className={inputClass}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    placeholder="Enter phone number"
                    className={inputClass}
                  />
                  {errors.phone && <p className={errorClass}>⚠️ {errors.phone.message}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className={labelClass}>Address</label>
                <textarea
                  {...register('address')}
                  placeholder="Enter full address"
                  className={`${inputClass} min-h-[100px] resize-none`}
                  rows={4}
                ></textarea>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <IoSchoolOutline className="text-green-600 text-lg" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Professional Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Designation */}
                <div className="space-y-2">
                  <label className={labelClass}>Designation</label>
                  <select {...register('designation')} className={inputClass}>
                    <option value="">Select designation</option>
                    {designations.map((des) => (
                      <option key={des} value={des}>
                        {des}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Specialization */}
                <div className="space-y-2">
                  <label className={labelClass}>Subject Specialization</label>
                  <select {...register('subject')} className={inputClass}>
                    <option value="">Select subject</option>
                    {subjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Index / Staff ID */}
                <div className="space-y-2">
                  <label className={labelClass}>Index / Staff ID</label>
                  <input
                    type="text"
                    {...register('indexno')}
                    placeholder="Enter index / staff ID"
                    className={inputClass}
                  />
                </div>

                {/* Email ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    {...register('email')}
                    placeholder="Enter Email Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select Role <span className="text-red-500 text-sm">(select Carefully)</span>
                  </label>
                  <select
                    {...register('role')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    {roles.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <IoCloudUploadOutline className="text-purple-600 text-lg" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Profile Photo</h2>
              </div>

              <div className="space-y-4">
                <label className={labelClass}>
                  Upload Photo <span className="text-red-500">*</span>
                </label>

                {/* Upload Area */}
                <div className="relative">
                  <input
                    type="file"
                    {...register('image', { required: true })}
                    onChange={handleImageUpload}
                    className="hidden"
                    id="photo-upload"
                    accept="image/*"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <IoCloudUploadOutline className="text-3xl text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload photo</span>
                    <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                  </label>
                </div>

                {errors.image && <p className={errorClass}>⚠️ Image is required</p>}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <img
                      src={imagePreview}
                      alt="Teacher Preview"
                      className="w-20 h-20 object-cover rounded-xl shadow-md"
                    />
                    <div>
                      <p className="font-medium text-gray-800">Photo uploaded successfully</p>
                      <p className="text-sm text-gray-600">Ready to save</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Teacher Information...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <IoPersonAddOutline className="text-xl" />
                    Save Teacher Information
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            All information will be securely stored in the system. Please double-check all details
            before submitting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
