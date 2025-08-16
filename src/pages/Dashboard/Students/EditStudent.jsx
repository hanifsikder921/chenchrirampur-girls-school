import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  IoPersonAddOutline,
  IoPersonOutline,
  IoSchoolOutline,
  IoHomeOutline,
  IoDocumentTextOutline,
  IoImageOutline,
} from 'react-icons/io5';
import useAxios from '../../../assets/hooks/useAxios';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [studentImage, setStudentImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: studentData, isLoading: isStudentLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const res = await axios.get(`/students/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (studentData) {
      Object.keys(studentData).forEach((key) => {
        setValue(key, studentData[key]);
      });
      setStudentImage(studentData.image);
      setImagePreview(studentData.image);
    }
  }, [studentData, setValue]);

  const mutation = useMutation({
    mutationFn: (updatedData) => axios.put(`/students/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      Swal.fire({
        icon: 'success',
        title: 'Student updated successfully',
      });
      navigate('/dashboard/manage-students');
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: error.response.data.message,
      });
    },
  });

  const onSubmit = async (data) => {
    const updatedData = {
      ...data,
      image: studentImage,
    };
    mutation.mutate(updatedData);
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

  const classes = ['6', '7', '8', '9', '10'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];
  const religions = ['Islam', 'Hindu', 'Christian', 'Buddhist'];
  const sections = ['Science', 'Humanities', 'Business Studies'];

  const selectedClass = watch('dclassName');

  if (isStudentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading student information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-blue-600 p-3 rounded-full">
              <IoPersonAddOutline className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Student Information</h1>
              <p className="text-gray-600 mt-1">Update student details and academic information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <div className="flex items-center space-x-2 text-white">
                <IoPersonOutline className="text-xl" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
              </div>

              {/* DOB */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('dob', { required: 'Date of Birth is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Blood Group</label>
                <select
                  {...register('bloodGroup')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Religion */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Religion <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('religion', { required: 'Religion is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select religion</option>
                  {religions.map((religion) => (
                    <option key={religion} value={religion}>
                      {religion}
                    </option>
                  ))}
                </select>
                {errors.religion && (
                  <p className="text-red-500 text-sm">{errors.religion.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
              <div className="flex items-center space-x-2 text-white">
                <IoSchoolOutline className="text-xl" />
                <h3 className="text-lg font-semibold">Academic Information</h3>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Class */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('dclassName', { required: 'Class is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select class</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
                {errors.dclassName && (
                  <p className="text-red-500 text-sm">{errors.dclassName.message}</p>
                )}
              </div>

              {/* Roll */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('roll', { required: 'Roll is required' })}
                  placeholder="Enter roll number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.roll && <p className="text-red-500 text-sm">{errors.roll.message}</p>}
              </div>

              {/* Section */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Section</label>
                <select
                  {...register('section')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50"
                  disabled={['6', '7', '8'].includes(selectedClass)}
                >
                  <option value="">Select section</option>
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              {/* Admission Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Admission Date</label>
                <input
                  type="date"
                  {...register('admissionDate')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Previous School */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Previous School</label>
                <input
                  {...register('previousSchool')}
                  placeholder="Enter previous school name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Parent Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
              <div className="flex items-center space-x-2 text-white">
                <IoPersonOutline className="text-xl" />
                <h3 className="text-lg font-semibold">Parent Information</h3>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Father Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('fatherName', { required: "Father's name is required" })}
                  placeholder="Enter father's name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.fatherName && (
                  <p className="text-red-500 text-sm">{errors.fatherName.message}</p>
                )}
              </div>

              {/* Mother Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Mother's Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('motherName', { required: "Mother's name is required" })}
                  placeholder="Enter mother's name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.motherName && (
                  <p className="text-red-500 text-sm">{errors.motherName.message}</p>
                )}
              </div>

              {/* Father Occupation */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Father's Occupation
                </label>
                <input
                  {...register('fatherOccupation')}
                  placeholder="Enter father's occupation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Mother Occupation */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Mother's Occupation
                </label>
                <input
                  {...register('motherOccupation')}
                  placeholder="Enter mother's occupation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Parent Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Parent's Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('parentContact', {
                    required: "Parent's contact is required",
                    pattern: { value: /^[0-9]{11}$/, message: 'Enter valid 11 digit number' },
                  })}
                  placeholder="Enter parent's contact number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.parentContact && (
                  <p className="text-red-500 text-sm">{errors.parentContact.message}</p>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  {...register('emergencyContact', {
                    pattern: { value: /^[0-9]{11}$/, message: 'Enter valid 11 digit number' },
                  })}
                  placeholder="Enter emergency contact"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.emergencyContact && (
                  <p className="text-red-500 text-sm">{errors.emergencyContact.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4">
              <div className="flex items-center space-x-2 text-white">
                <IoHomeOutline className="text-xl" />
                <h3 className="text-lg font-semibold">Address Information</h3>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Village */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Village</label>
                <input
                  {...register('village')}
                  placeholder="Enter village"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Post Office */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Post Office</label>
                <input
                  {...register('postOffice')}
                  placeholder="Enter post office"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Upazila */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Upazila/Thana</label>
                <input
                  {...register('upazila')}
                  placeholder="Enter upazila/thana"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* District */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">District</label>
                <input
                  {...register('district')}
                  placeholder="Enter district"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Division */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Division</label>
                <input
                  {...register('division')}
                  placeholder="Enter division"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4">
              <div className="flex items-center space-x-2 text-white">
                <IoDocumentTextOutline className="text-xl" />
                <h3 className="text-lg font-semibold">Additional Information</h3>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <IoImageOutline />
                  <span>Upload Image</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors duration-200">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="w-full"
                    accept="image/*"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Student Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Notes</label>
                <textarea
                  {...register('notes')}
                  placeholder="Any additional notes..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  rows={6}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-[1.01] shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Updating Student Information...</span>
                </>
              ) : (
                <>
                  <IoPersonAddOutline className="text-xl" />
                  <span>Update Student Information</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
