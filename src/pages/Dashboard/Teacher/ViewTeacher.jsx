import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaUsers, FaFilter, FaEye } from 'react-icons/fa';
import { IoPersonOutline, IoCallOutline, IoMailOutline, IoSchoolOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import useAxios from '../../../assets/hooks/useAxios';
import MaleIcon from '../../../assets/images/man.png';
import FemaleIcon from '../../../assets/images/woman.png';

const ViewTeacher = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const axios = useAxios();

  // Fetch Teachers
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['teachers', searchTerm, page],
    queryFn: async () => {
      const res = await axios.get('/teachers', {
        params: {
          search: searchTerm || undefined,
          page,
          limit: 10,
        },
      });
      
      return res.data;
    },
    retry: 1,
  });

  const teachers = data?.data || [];
  const totalPages = data?.pages || 1;

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/teachers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      Swal.fire({
        title: 'Deleted!',
        text: 'Teacher has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete teacher.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    },
  });

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Delete ${name}?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col justify-center items-center h-96">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaUsers className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Teacher Management
                </h1>
                <p className="text-gray-600 mt-1">Manage and view all teachers in the system</p>
              </div>
            </div>
            <Link
              to="/dashboard/add-teacher"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add New Teacher
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{teachers.length}</p>
                <p className="text-gray-600 text-sm">Total Teachers</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <IoSchoolOutline className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalPages}</p>
                <p className="text-gray-600 text-sm">Total Pages</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaEye className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{page}</p>
                <p className="text-gray-600 text-sm">Current Page</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search teachers by name, designation, or phone..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-2">
                <FaFilter className="text-gray-600" />
                <span className="text-gray-700 font-medium">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Teachers Grid/Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Actions
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
                        <div className="flex items-center ">
                          <span className=" bg-blue-100 rounded p-2 flex items-center justify-center text-blue-600 font-semibold text-sm">
                            {teacher.indexno || index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={
                                teacher.image || (teacher.gender === 'Male' ? MaleIcon : FemaleIcon)
                              }
                              alt={teacher.fullName}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 shadow-md hover:ring-blue-300 transition-all duration-200"
                              onError={(e) => {
                                e.target.src = teacher.gender === 'Male' ? MaleIcon : FemaleIcon;
                              }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{teacher.fullName}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <IoPersonOutline className="text-xs" />
                              {teacher.gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <IoSchoolOutline className="text-green-600 text-sm" />
                          </div>
                          <span className="text-gray-800 font-medium">
                            {teacher.designation || 'Not Assigned'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <IoCallOutline className="text-blue-500" />
                            <span>{teacher.phone || 'N/A'}</span>
                          </div>
                          {teacher.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <IoMailOutline className="text-green-500" />
                              <span>{teacher.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/dashboard/edit-teacher/${teacher.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                          >
                            <FaEdit className="text-sm" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(teacher.id, teacher.fullName)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={deleteMutation.isLoading}
                          >
                            <FaTrash className="text-sm" />
                            {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FaUsers className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          No Teachers Found
                        </h3>
                        <p className="text-gray-500 mb-6">
                          {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Get started by adding your first teacher'}
                        </p>
                        <Link
                          to="/dashboard/add-teacher"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaPlus className="text-sm" />
                          Add First Teacher
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing page <span className="font-semibold">{page}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-xl transition-colors font-medium"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                            page === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-xl transition-colors font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTeacher;
