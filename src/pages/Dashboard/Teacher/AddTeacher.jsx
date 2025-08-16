import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useAxios from './../../../assets/hooks/useAxios';
import useAuth from './../../../assets/hooks/useAuth';
import { IoPersonAddOutline } from 'react-icons/io5';

const MySwal = withReactContent(Swal);

const AddTeacher = () => {
  const axios = useAxios();
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
  const designations = ['Head Teacher', 'Assistant Head Teacher', 'Assistant Teacher', 'Office Assistant', 'Computer Teacher', 'Computer Lab Operator', 'Librarian','MLSS','Cleaner','4th Class Employee'];
  const subjects = ['Bangla', 'English', 'Math', 'Science', 'History', 'Geography', 'ICT', 'N/A'];

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

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 max-w-7xl mx-auto my-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-green-800 text-center flex items-center gap-2 justify-center">
        <IoPersonAddOutline /> Add New Teacher
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name English */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Full Name (English) <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fullName', { required: 'Full name is required' })}
            placeholder="Enter full name in English"
            className="input input-bordered w-full"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Full Name Bangla */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Full Name (Bangla)</label>
          <input
            {...register('fullNameBangla')}
            placeholder="Enter full name in Bangla"
            className="input input-bordered w-full"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            {...register('gender', { required: 'Gender is required' })}
            className="select select-bordered w-full"
          >
            <option value="">Select gender</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('dob', { required: 'Date of birth is required' })}
            className="input input-bordered w-full"
          />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
        </div>

        {/* National ID */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">National ID / Passport No</label>
          <input
            {...register('nid')}
            placeholder="Enter NID or Passport number"
            className="input input-bordered w-full"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phone', { required: 'Phone number is required' })}
            placeholder="Enter phone number"
            className="input input-bordered w-full"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1 text-gray-700">Address</label>
          <textarea
            {...register('address')}
            placeholder="Enter full address"
            className="textarea textarea-bordered w-full"
            rows={3}
          ></textarea>
        </div>

        {/* Designation */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Designation</label>
          <select {...register('designation')} className="select select-bordered w-full">
            <option value="">Select designation</option>
            {designations.map((des) => (
              <option key={des} value={des}>
                {des}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Specialization */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Subject Specialization</label>
          <select {...register('subject')} className="select select-bordered w-full">
            <option value="">Select subject</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Index / Staff ID */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Index / Staff ID</label>
          <input
            type="text"
            {...register('indexno')}
            placeholder="Enter index / staff ID"
            className="input input-bordered w-full"
          />
        </div>

        {/* Photo Upload */}
        <div className="md:col-span-2">
          <label className="text-gray-700 font-medium mb-1">Upload Photo</label>
          <input
            type="file"
            {...register('image', { required: true })}
            onChange={handleImageUpload}
            className="w-full px-4 py-2 rounded-md"
          />
          {errors.image && <p className="text-red-500 text-sm">Image is required</p>}
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Teacher Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="btn bg-purple-600 hover:bg-purple-700 text-white text-lg w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Teacher Information'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeacher;
