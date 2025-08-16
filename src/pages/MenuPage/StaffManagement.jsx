import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { IoPersonOutline, IoCallOutline, IoMailOutline, IoSchoolOutline } from 'react-icons/io5';
import { Link } from 'react-router';

import MaleIcon from '../../../../chenchri-client/src/assets/images/man.png';
import FemaleIcon from '../../../../chenchri-client/src/assets/images/woman.png';
import useAxios from '../../assets/hooks/useAxios';

const StaffManagement = () => {
  const axios = useAxios();

  // Fetch Teachers (no search, no pagination)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await axios.get('/teachers');
      return res.data;
    },
    retry: 1,
  });

  const teachers = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-gray-600">Loading Teachers...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-red-200 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h3>
          <p className="text-gray-600">{error?.message || 'Failed to load teacher data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* -------- TABLE VIEW (Desktop) -------- */}
        <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Index
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teachers.length > 0 ? (
                  teachers.map((teacher, index) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <span className=" bg-blue-100 rounded p-2 text-blue-600 font-semibold text-sm">
                          {teacher.indexno || index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={teacher.image || (teacher.gender === 'Male' ? MaleIcon : FemaleIcon)}
                          alt={teacher.fullName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 shadow-md hover:ring-blue-300 transition-all duration-200"
                          onError={(e) => {
                            e.target.src = teacher.gender === 'Male' ? MaleIcon : FemaleIcon;
                          }}
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{teacher.fullName}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <IoPersonOutline className="text-xs" /> {teacher.gender}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <IoSchoolOutline className="text-green-600 text-lg" />
                          <span className="text-gray-800 font-medium">
                            {teacher.designation || 'Not Assigned'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <p className="flex items-center gap-2 text-sm text-gray-600">
                          <IoCallOutline className="text-blue-500" /> {teacher.phone || 'N/A'}
                        </p>
                        {teacher.email && (
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <IoMailOutline className="text-green-500" /> {teacher.email}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <NoTeachers />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* -------- CARD VIEW (Mobile) -------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.image || (teacher.gender === 'Male' ? MaleIcon : FemaleIcon)}
                    alt={teacher.fullName}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100 shadow-md"
                    onError={(e) => {
                      e.target.src = teacher.gender === 'Male' ? MaleIcon : FemaleIcon;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{teacher.fullName}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <IoPersonOutline className="text-xs" /> {teacher.gender}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <IoSchoolOutline className="text-green-600" />{' '}
                    {teacher.designation || 'Not Assigned'}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <IoCallOutline className="text-blue-500" /> {teacher.phone || 'N/A'}
                  </p>
                  {teacher.indexno && (
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <IoMailOutline className="text-green-500" /> {teacher.indexno} <span className='text-sm bg-green-200 px-1 text-green-800 rounded'>index No.</span>
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <NoTeachers />
          )}
        </div>
      </div>
    </div>
  );
};

const NoTeachers = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <FaUsers className="text-3xl text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Teachers Found</h3>
    <p className="text-gray-500 mb-6">Get started by adding your first teacher</p>
    <Link
      to="/dashboard/add-teacher"
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
    >
      <FaPlus className="text-sm" /> Add First Teacher
    </Link>
  </div>
);

export default StaffManagement;
