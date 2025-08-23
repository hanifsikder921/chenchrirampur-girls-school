import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  IoPersonAddOutline,
  IoPersonOutline,
  IoBriefcaseOutline,
  IoLocationOutline,
  IoImageOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import useAxios from '../../../assets/hooks/useAxios';

const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [teacherImage, setTeacherImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: teacherData, isLoading: isTeacherLoading } = useQuery({
    queryKey: ['teacher', id],
    queryFn: async () => {
      const res = await axios.get(`/teachers/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (teacherData) {
      Object.keys(teacherData).forEach((key) => setValue(key, teacherData[key]));
      setTeacherImage(teacherData.image);
      setImagePreview(teacherData.image);
    }
  }, [teacherData, setValue]);

  const mutation = useMutation({
    mutationFn: (updatedData) => axios.put(`/teachers/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      Swal.fire({
        icon: 'success',
        title: 'Teacher updated successfully',
      });
      navigate('/dashboard/manage-teachers');
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: error.response?.data?.message || 'Failed to update teacher',
      });
    },
  });

  const onSubmit = async (data) => {
    const updatedData = { ...data, image: teacherImage };
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
    setTeacherImage(res.data.data.url);
    setImagePreview(URL.createObjectURL(image));
  };

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
  const genders = ['Male', 'Female', 'Other'];
  const statuses = ['active', 'inactive'];
  const roles = ['employee', 'teacher','admin'];

  if (isTeacherLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading teacher information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-emerald-600 p-3 rounded-full">
              <IoPersonAddOutline className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Teacher Information</h1>
              <p className="text-gray-600 mt-1">
                Update teacher details and professional information
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4">
              <div className="flex items-center space-x-2 text-white">
                <IoPersonOutline className="text-xl" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('fullName', { required: 'Full Name is required' })}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                )}
              </div>

              {/* Full Name Bangla */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name Bangla
                </label>
                <input
                  {...register('fullNameBangla')}
                  placeholder="Enter full name in Bangla"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
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

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  {...register('dob')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* NID */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  National ID (NID)
                </label>
                <input
                  {...register('nid')}
                  placeholder="Enter NID number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: { value: /^[0-9]{11}$/, message: 'Enter valid 11 digit number' },
                  })}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <div className="flex items-center space-x-2 text-white">
                <IoBriefcaseOutline className="text-xl" />
                <h3 className="text-lg font-semibold">Professional Information</h3>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Designation */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Designation</label>
                <select
                  {...register('designation')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select designation</option>
                  {designations.map((des) => (
                    <option key={des} value={des}>
                      {des}
                    </option>
                  ))}
                </select>
              </div>
              {/* Subject */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Subject</label>
                <input
                  {...register('subject')}
                  placeholder="Enter subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              {/* Index No */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Index Number</label>
                <input
                  {...register('indexno')}
                  placeholder="Enter index number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
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
              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Employment Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Select Role <span className='text-red-500 text-sm'>(select Carefully)</span>
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

          {/* Address Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
              <div className="flex items-center space-x-2 text-white">
                <IoLocationOutline className="text-xl" />
                <h3 className="text-lg font-semibold">Address Information</h3>
              </div>
            </div>

            <div className="p-6">
              {/* Address */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Full Address</label>
                <input
                  {...register('address')}
                  placeholder="Enter complete address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
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
                  <span>Upload Profile Image</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors duration-200">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="w-full"
                    accept="image/*"
                  />
                  <p className="text-gray-500 text-sm mt-2">Choose an image file to upload</p>
                </div>
                {imagePreview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Teacher Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  {...register('notes')}
                  placeholder="Enter any additional notes or comments..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  rows={6}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-[1.01] shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Updating Teacher Information...</span>
                </>
              ) : (
                <>
                  <IoPersonAddOutline className="text-xl" />
                  <span>Update Teacher Information</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacher;
