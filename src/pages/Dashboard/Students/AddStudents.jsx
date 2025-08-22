import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useAxios from './../../../assets/hooks/useAxios';
import { useState } from 'react';
import useAuth from './../../../assets/hooks/useAuth';
import {
  IoPersonAddOutline,
  IoPersonOutline,
  IoSchoolOutline,
  IoPeopleOutline,
  IoLocationOutline,
  IoCloudUploadOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';

const MySwal = withReactContent(Swal);

const AddStudents = () => {
  const axios = useAxios();
  const { user } = useAuth();
  const [studentImage, setStudentImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const classes = ['6', '7', '8', '9', '10'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];
  const religions = ['Islam', 'Hindu', 'Christian', 'Buddhist'];
  const sections = ['Science', 'Humanities', 'Business Studies'];

  const selectedClass = watch('className');

  const onSubmit = async (data) => {
    const studentData = {
      ...data,
      image: studentImage,
      adminName: user?.email,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post('/students', studentData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Student added successfully',
        });
        reset();
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        Swal.fire({
          icon: 'error',
          title: error.response.data.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add student',
        });
      }
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);

    const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    const res = await axios.post(imagUploadUrl, formData);
    setStudentImage(res.data.data.url);
    setImagePreview(URL.createObjectURL(image));
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white';
  const selectClass =
    'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';
  const errorClass = 'text-red-500 text-sm mt-1 flex items-center gap-1';

  const SectionHeader = ({ icon: Icon, title, color }) => (
    <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
      <div
        className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg`}
      >
        <Icon className="text-white text-xl" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <IoPersonAddOutline className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Add New Student
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Complete the student registration form below. All required fields are marked with an
            asterisk (*).
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-12">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <SectionHeader
                icon={IoPersonOutline}
                title="Personal Information"
                color="from-blue-500 to-blue-600"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Enter student's full name"
                    className={inputClass}
                  />
                  {errors.name && <p className={errorClass}>⚠️ {errors.name.message}</p>}
                </div>

                {/* Academic Year */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('academicYear', { required: 'Academic Year is required' })}
                    placeholder="Enter academic year"
                    type="number"
                    minLength={4}
                    maxLength={4}
                    className={inputClass}
                  />
                  {errors.academicYear && (
                    <p className={errorClass}>⚠️ {errors.academicYear.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className={selectClass}
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

                {/* DOB */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('dob', { required: 'Date of Birth is required' })}
                    className={inputClass}
                  />
                  {errors.dob && <p className={errorClass}>⚠️ {errors.dob.message}</p>}
                </div>

                {/* Birth Regisrtation Number */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Birth Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('uid', { required: 'Birth Registration Number required' })}
                    className={inputClass}
                  />
                  {errors.uid && <p className={errorClass}>⚠️ {errors.uid.message}</p>}
                </div>

                {/* Blood Group */}
                <div className="space-y-2">
                  <label className={labelClass}>Blood Group</label>
                  <select {...register('bloodGroup')} className={selectClass}>
                    <option value="">Select blood group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Religion */}
                <div className="space-y-2 lg:col-span-1">
                  <label className={labelClass}>
                    Religion <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('religion', { required: 'Religion is required' })}
                    className={selectClass}
                  >
                    <option value="">Select religion</option>
                    {religions.map((religion) => (
                      <option key={religion} value={religion}>
                        {religion}
                      </option>
                    ))}
                  </select>
                  {errors.religion && <p className={errorClass}>⚠️ {errors.religion.message}</p>}
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-6">
              <SectionHeader
                icon={IoSchoolOutline}
                title="Academic Information"
                color="from-green-500 to-green-600"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Class */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('dclassName', { required: 'Class is required' })}
                    className={selectClass}
                  >
                    <option value="">Select class</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        Class {cls}
                      </option>
                    ))}
                  </select>
                  {errors.className && <p className={errorClass}>⚠️ {errors.className.message}</p>}
                </div>

                {/* Roll */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('roll', { required: 'Roll is required' })}
                    placeholder="Enter roll number"
                    className={inputClass}
                  />
                  {errors.roll && <p className={errorClass}>⚠️ {errors.roll.message}</p>}
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <label className={labelClass}>Section</label>
                  <select
                    {...register('section')}
                    className={selectClass}
                    disabled={['6', '7', '8'].includes(selectedClass)}
                  >
                    <option value="">Select section</option>
                    {sections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                  {['6', '7', '8'].includes(selectedClass) && (
                    <p className="text-gray-500 text-sm">Section not applicable for classes 6-8</p>
                  )}
                </div>

                {/* Admission Date */}
                <div className="space-y-2">
                  <label className={labelClass}>Admission Date</label>
                  <input type="date" {...register('admissionDate')} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Parent Information Section */}
            <div className="space-y-6">
              <SectionHeader
                icon={IoPeopleOutline}
                title="Parent Information"
                color="from-purple-500 to-purple-600"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Father Name */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('fatherName', { required: 'Father name is required' })}
                    placeholder="Enter father's full name"
                    className={inputClass}
                  />
                  {errors.fatherName && (
                    <p className={errorClass}>⚠️ {errors.fatherName.message}</p>
                  )}
                </div>

                {/* Mother Name */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Mother's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('motherName', { required: 'Mother name is required' })}
                    placeholder="Enter mother's full name"
                    className={inputClass}
                  />
                  {errors.motherName && (
                    <p className={errorClass}>⚠️ {errors.motherName.message}</p>
                  )}
                </div>

                {/* Father Occupation */}
                <div className="space-y-2">
                  <label className={labelClass}>Father's Occupation</label>
                  <input
                    {...register('fatherOccupation')}
                    placeholder="Enter father's occupation"
                    className={inputClass}
                  />
                </div>

                {/* Mother Occupation */}
                <div className="space-y-2">
                  <label className={labelClass}>Mother's Occupation</label>
                  <input
                    {...register('motherOccupation')}
                    placeholder="Enter mother's occupation"
                    className={inputClass}
                  />
                </div>

                {/* Parent Contact */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    Parent's Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('parentContact', {
                      required: 'Parent contact is required',
                      pattern: { value: /^[0-9]{11}$/, message: 'Enter valid 11 digit number' },
                    })}
                    placeholder="Enter 11-digit contact number"
                    className={inputClass}
                  />
                  {errors.parentContact && (
                    <p className={errorClass}>⚠️ {errors.parentContact.message}</p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="space-y-2">
                  <label className={labelClass}>Emergency Contact</label>
                  <input
                    type="tel"
                    {...register('emergencyContact', {
                      pattern: { value: /^[0-9]{11}$/, message: 'Enter valid 11 digit number' },
                    })}
                    placeholder="Enter emergency contact number"
                    className={inputClass}
                  />
                  {errors.emergencyContact && (
                    <p className={errorClass}>⚠️ {errors.emergencyContact.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-6">
              <SectionHeader
                icon={IoLocationOutline}
                title="Address Information"
                color="from-orange-500 to-orange-600"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Village */}
                <div className="space-y-2">
                  <label className={labelClass}>Village</label>
                  <input
                    {...register('village')}
                    placeholder="Enter village name"
                    className={inputClass}
                  />
                </div>

                {/* Post Office */}
                <div className="space-y-2">
                  <label className={labelClass}>Post Office</label>
                  <input
                    {...register('postOffice')}
                    placeholder="Enter post office"
                    className={inputClass}
                  />
                </div>

                {/* Upazila */}
                <div className="space-y-2">
                  <label className={labelClass}>Upazila/Thana</label>
                  <input
                    {...register('upazila')}
                    placeholder="Enter upazila/thana"
                    className={inputClass}
                  />
                </div>

                {/* District */}
                <div className="space-y-2">
                  <label className={labelClass}>District</label>
                  <input
                    {...register('district')}
                    placeholder="Enter district"
                    className={inputClass}
                  />
                </div>

                {/* Division */}
                <div className="space-y-2">
                  <label className={labelClass}>Division</label>
                  <input
                    {...register('division')}
                    placeholder="Enter division"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
              <SectionHeader
                icon={IoDocumentTextOutline}
                title="Additional Information"
                color="from-teal-500 to-teal-600"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    placeholder="Enter email address"
                    className={inputClass}
                  />
                  {errors.email && <p className={errorClass}>⚠️ {errors.email.message}</p>}
                </div>

                {/* Previous School */}
                <div className="space-y-2">
                  <label className={labelClass}>Previous School</label>
                  <input
                    {...register('previousSchool')}
                    placeholder="Enter previous school name"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className={labelClass}>Notes</label>
                <textarea
                  {...register('notes')}
                  placeholder="Any additional notes or special requirements..."
                  className={`${inputClass} min-h-[120px] resize-none`}
                  rows={4}
                ></textarea>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-6">
              <SectionHeader
                icon={IoCloudUploadOutline}
                title="Profile Photo"
                color="from-pink-500 to-pink-600"
              />

              <div className="space-y-4">
                <label className={labelClass}>
                  Upload Student Photo 
                </label>

                {/* Upload Area */}
                <div className="relative">
                  <input
                    {...register('image')}
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="student-photo-upload"
                    accept="image/*"
                  />
                  <label
                    htmlFor="student-photo-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <IoCloudUploadOutline className="text-4xl text-gray-400 mb-3" />
                    <span className="text-lg font-medium text-gray-600">
                      Click to upload student photo
                    </span>
                    <span className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                  </label>
                </div>

                {/* {errors.image && <p className={errorClass}>⚠️ Student photo is required</p>} */}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                    <img
                      src={imagePreview}
                      alt="Student Preview"
                      className="w-24 h-24 object-cover rounded-2xl shadow-lg ring-2 ring-blue-200"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        Photo uploaded successfully!
                      </p>
                      <p className="text-gray-600">Student photo is ready to save</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Student Information...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <IoPersonAddOutline className="text-2xl" />
                    Save Student Information
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500">
            All student information will be securely stored. Please ensure all details are accurate
            before submitting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddStudents;
