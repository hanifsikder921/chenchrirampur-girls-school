import React, { useState } from 'react';
import {
  FaUserGraduate,
  FaBook,
  FaIdCard,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaVenusMars,
  FaSchool,
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    phone: '',
    email: '',
    address: '',
    dob: '',
    gender: '',
    class: '',
    group: '',
    previousSchool: '',
  });

  const [errors, setErrors] = useState({});

  const groups = {
    Science: 'বিজ্ঞান',
    Commerce: 'ব্যবসায় শিক্ষা',
    Arts: 'মানবিক',
    General: 'সাধারণ',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father name is required';
    if (!formData.motherName.trim()) newErrors.motherName = 'Mother name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (formData.class === '9' && !formData.group) newErrors.group = 'Group is required';
    if (!formData.previousSchool.trim()) newErrors.previousSchool = 'Previous school is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Form submission logic here
      console.log('Form submitted:', formData);
      alert('Admission form submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 py-4 px-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FaUserGraduate className="mr-2" />
            Admission Form (Class 6-9)
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaIdCard className="mr-2 text-blue-500" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
              {/* Full Name */}
              <div className="sm:col-span-3">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              {/* Father's Name */}
              <div className="sm:col-span-3">
                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
                  Father's Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="fatherName"
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.fatherName ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  />
                </div>
                {errors.fatherName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>
                )}
              </div>

              {/* Mother's Name */}
              <div className="sm:col-span-3">
                <label htmlFor="motherName" className="block text-sm font-medium text-gray-700">
                  Mother's Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="motherName"
                    id="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.motherName ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  />
                </div>
                {errors.motherName && (
                  <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>
                )}
              </div>

              {/* Phone */}
              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-10 rounded-md border ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdEmail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 rounded-md border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-2 flex items-start pointer-events-none">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className={`block w-full pl-10 rounded-md border ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  />
                </div>
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              {/* Date of Birth */}
              <div className="sm:col-span-2">
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`block w-full pl-10 rounded-md border ${
                      errors.dob ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  />
                </div>
                {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
              </div>

              {/* Gender */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="male"
                      name="gender"
                      type="radio"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="male"
                      className="ml-2 block text-sm text-gray-700 flex items-center"
                    >
                      <FaVenusMars className="mr-1" /> Male
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="female"
                      name="gender"
                      type="radio"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="female"
                      className="ml-2 block text-sm text-gray-700 flex items-center"
                    >
                      <FaVenusMars className="mr-1" /> Female
                    </label>
                  </div>
                </div>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaBook className="mr-2 text-blue-500" />
              Academic Information
            </h2>

            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
              {/* Class */}
              <div className="sm:col-span-3">
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.class ? 'border-red-300' : 'border-gray-300'
                  } py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                >
                  <option value="">Select Class</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                </select>
                {errors.class && <p className="mt-1 text-sm text-red-600">{errors.class}</p>}
              </div>

              {/* Group (only shown for class 9) */}
              {formData.class === '9' && (
                <div className="sm:col-span-3">
                  <label htmlFor="group" className="block text-sm font-medium text-gray-700">
                    Group
                  </label>
                  <select
                    id="group"
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.group ? 'border-red-300' : 'border-gray-300'
                    } py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                  >
                    <option value="">Select Group</option>
                    {Object.entries(groups).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value} ({key})
                      </option>
                    ))}
                  </select>
                  {errors.group && <p className="mt-1 text-sm text-red-600">{errors.group}</p>}
                </div>
              )}

              {/* Previous School */}
              <div className="sm:col-span-6">
                <label htmlFor="previousSchool" className="block text-sm font-medium text-gray-700">
                  Previous School
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSchool className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="previousSchool"
                    id="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    className={`block w-full pl-10 rounded-md border ${
                      errors.previousSchool ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  />
                </div>
                {errors.previousSchool && (
                  <p className="mt-1 text-sm text-red-600">{errors.previousSchool}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
