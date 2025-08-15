import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useAxios from './../../../assets/hooks/useAxios';
import { useState } from 'react';
import useAuth from './../../../assets/hooks/useAuth';
import { IoPersonAddOutline } from 'react-icons/io5';

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

  // const onSubmit = async (data) => {
  //   const studentData = {
  //     ...data,
  //     image: studentImage,
  //     status: 'active',
  //     createdAt: new Date().toISOString(),
  //   };

  //   try {
  //     const res = await axios.post('/students', studentData);
  //     if (res.data.insertedId) {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Student added successfully',
  //       });
  //       reset();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Failed to add student',
  //     });
  //   }
  // };

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

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 max-w-4xl mx-auto my-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-green-800 text-center flex items-center gap-2 justify-center">
        <IoPersonAddOutline /> Add New Student
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold bg-green-600 px-2 text-white  mb-3">
            Personal Information
          </h3>
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="Enter full name"
            className="input input-bordered w-full"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
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

        {/* DOB */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('dob', { required: 'Date of Birth is required' })}
            className="input input-bordered w-full"
          />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
        </div>

        {/* Blood Group */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Blood Group</label>
          <select {...register('bloodGroup')} className="select select-bordered w-full">
            <option value="">Select blood group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Religion */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Religion <span className="text-red-500">*</span>
          </label>
          <select
            {...register('religion', { required: 'Religion is required' })}
            className="select select-bordered w-full"
          >
            <option value="">Select religion</option>
            {religions.map((religion) => (
              <option key={religion} value={religion}>
                {religion}
              </option>
            ))}
          </select>
          {errors.religion && (
            <p className="text-red-500 text-sm mt-1">{errors.religion.message}</p>
          )}
        </div>

        {/* Academic Information Section */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold bg-green-600 px-2 text-white mb-3">
            Academic Information
          </h3>
        </div>

        {/* Class */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            {...register('dclassName', { required: 'Class is required' })}
            className="select select-bordered w-full"
          >
            <option value="">Select class</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
          {errors.className && (
            <p className="text-red-500 text-sm mt-1">{errors.className.message}</p>
          )}
        </div>

        {/* Roll */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Roll Number <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('roll', { required: 'Roll is required' })}
            placeholder="Enter roll number"
            className="input input-bordered w-full"
          />
          {errors.roll && <p className="text-red-500 text-sm mt-1">{errors.roll.message}</p>}
        </div>

        {/* Section */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Section</label>
          <select
            {...register('section')}
            className="select select-bordered w-full"
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
        <div>
          <label className="block font-medium mb-1 text-gray-700">Admission Date</label>
          <input
            type="date"
            {...register('admissionDate')}
            className="input input-bordered w-full"
          />
        </div>

        {/* Parent Information Section */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold bg-green-600 px-2 text-white mb-3">
            Parent Information
          </h3>
        </div>

        {/* Father Name */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Father's Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fatherName', { required: 'Father name is required' })}
            placeholder="Enter father's name"
            className="input input-bordered w-full"
          />
          {errors.fatherName && (
            <p className="text-red-500 text-sm mt-1">{errors.fatherName.message}</p>
          )}
        </div>

        {/* Mother Name */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Mother's Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('motherName', { required: 'Mother name is required' })}
            placeholder="Enter mother's name"
            className="input input-bordered w-full"
          />
          {errors.motherName && (
            <p className="text-red-500 text-sm mt-1">{errors.motherName.message}</p>
          )}
        </div>

        {/* Father Occupation */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Father's Occupation</label>
          <input
            {...register('fatherOccupation')}
            placeholder="Enter father's occupation"
            className="input input-bordered w-full"
          />
        </div>

        {/* Mother Occupation */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Mother's Occupation</label>
          <input
            {...register('motherOccupation')}
            placeholder="Enter mother's occupation"
            className="input input-bordered w-full"
          />
        </div>

        {/* Parent Contact */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Parent's Contact <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('parentContact', {
              required: 'Parent contact is required',
              pattern: { value: /^[0-9]{11}$/, message: 'Enter valid 11 digit number' },
            })}
            placeholder="Enter parent's contact number"
            className="input input-bordered w-full"
          />
          {errors.parentContact && (
            <p className="text-red-500 text-sm mt-1">{errors.parentContact.message}</p>
          )}
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Emergency Contact</label>
          <input
            type="tel"
            {...register('emergencyContact', {
              pattern: { value: /^[0-9]{11}$/, message: 'Enter valid 11 digit number' },
            })}
            placeholder="Enter emergency contact"
            className="input input-bordered w-full"
          />
          {errors.emergencyContact && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.message}</p>
          )}
        </div>

        {/* Address Information Section */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold bg-green-600 px-2 text-white mb-3">
            Address Information
          </h3>
        </div>

        {/* Village */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Village</label>
          <input
            {...register('village')}
            placeholder="Enter village"
            className="input input-bordered w-full"
          />
        </div>

        {/* Post Office */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Post Office</label>
          <input
            {...register('postOffice')}
            placeholder="Enter post office"
            className="input input-bordered w-full"
          />
        </div>

        {/* Upazila */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Upazila/Thana</label>
          <input
            {...register('upazila')}
            placeholder="Enter upazila/thana"
            className="input input-bordered w-full"
          />
        </div>

        {/* District */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">District</label>
          <input
            {...register('district')}
            placeholder="Enter district"
            className="input input-bordered w-full"
          />
        </div>

        {/* Division */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Division</label>
          <input
            {...register('division')}
            placeholder="Enter division"
            className="input input-bordered w-full"
          />
        </div>

        {/* Additional Information */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold bg-green-600 px-2 text-white mb-3">
            Additional Information
          </h3>
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            placeholder="Enter email address"
            className="input input-bordered w-full"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Previous School */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Previous School</label>
          <input
            {...register('previousSchool')}
            placeholder="Enter previous school name"
            className="input input-bordered w-full"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-gray-700 font-medium mb-1">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <input
            {...register('image', { required: true })}
            type="file"
            onChange={handleImageUpload}
            className="w-full px-4 py-2  rounded-md "
          />
          {errors.image && <p className="text-red-500 text-sm">Image URL is required</p>}
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Student Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1 text-gray-700">Notes</label>
          <textarea
            {...register('notes')}
            placeholder="Any additional notes..."
            className="textarea textarea-bordered w-full"
            rows={3}
          ></textarea>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="btn bg-green-800 hover:bg-green-700 text-white w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Saving...
              </>
            ) : (
              'Save Student Information'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudents;
