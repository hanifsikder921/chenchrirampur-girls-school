import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { IoPersonAddOutline } from 'react-icons/io5';
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

  if (isTeacherLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 max-w-5xl mx-auto my-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-green-800 text-center flex items-center gap-2 justify-center">
        <IoPersonAddOutline /> Edit Teacher
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fullName', { required: 'Full Name is required' })}
            placeholder="Enter full name"
            className="input input-bordered w-full"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Full Name Bangla */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Full Name Bangla</label>
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
          <label className="block font-medium mb-1 text-gray-700">Date of Birth</label>
          <input type="date" {...register('dob')} className="input input-bordered w-full" />
        </div>

        {/* NID */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">NID</label>
          <input
            {...register('nid')}
            placeholder="Enter NID"
            className="input input-bordered w-full"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phone', {
              required: 'Phone is required',
              pattern: { value: /^[0-9]{11}$/, message: 'Enter valid 11 digit number' },
            })}
            placeholder="Enter phone number"
            className="input input-bordered w-full"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1 text-gray-700">Address</label>
          <input
            {...register('address')}
            placeholder="Enter address"
            className="input input-bordered w-full"
          />
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

        {/* Subject */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Subject</label>
          <input
            {...register('subject')}
            placeholder="Enter subject"
            className="input input-bordered w-full"
          />
        </div>

        {/* Index No */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Index No</label>
          <input
            {...register('indexno')}
            placeholder="Enter index number"
            className="input input-bordered w-full"
          />
        </div>

     

        {/* Status */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Status</label>
          <select {...register('status')} className="select select-bordered w-full">
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div className="md:col-span-2">
          <label className="text-gray-700 font-medium mb-1">Upload Image</label>
          <input type="file" onChange={handleImageUpload} className="w-full px-4 py-2 rounded-md" />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Teacher Preview"
              className="w-32 h-32 object-cover rounded-md mt-2"
            />
          )}
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1 text-gray-700">Notes</label>
          <textarea
            {...register('notes')}
            placeholder="Any notes..."
            className="textarea textarea-bordered w-full"
            rows={3}
          ></textarea>
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="btn bg-purple-600 hover:bg-purple-700 text-white w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Teacher Information'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeacher;
