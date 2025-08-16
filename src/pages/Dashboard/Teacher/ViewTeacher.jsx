import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error shadow-lg max-w-4xl mx-auto">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error?.message || 'Failed to load teacher data'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-green-800">Teacher Management</h2>
        <Link
          to="/dashboard/add-teacher"
          className="btn bg-green-800 hover:bg-green-700 text-white"
        >
          <FaPlus className="mr-2" />
          Add New Teacher
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative md:w-1/3">
        <input
          type="text"
          placeholder="Search by name..."
          className="input input-bordered w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* Teachers Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Index
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Designation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-green-800 font-semibold">
                    {teacher.indexno}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={teacher.image || (teacher.gender === 'Male' ? MaleIcon : FemaleIcon)}
                      alt={teacher.fullName}
                      className="w-12 h-12 rounded-full object-cover hover:scale-105 duration-300"
                      onError={(e) => {
                        e.target.src = teacher.gender === 'Male' ? MaleIcon : FemaleIcon;
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{teacher.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{teacher.designation || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{teacher.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap ">
                    <div className='w-full flex justify-center items-center gap-2'>
                      <Link
                        to={`/dashboard/edit-teacher/${teacher.id}`}
                        className="text-blue-600 hover:text-blue-900 flex bg-blue-100 py-2 px-4 rounded-lg transition-colors"
                      >
                        <FaEdit className="w-5 h-5" /> Edit 
                      </Link>
                      <button
                        onClick={() => handleDelete(teacher.id, teacher.fullName)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1 bg-red-100 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        disabled={deleteMutation.isLoading}
                      >
                        <FaTrash className="w-5 h-5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="mt-4 text-lg font-medium text-gray-600">No teachers found</p>
                    <p className="text-gray-500">Try adjusting your search or add a new teacher</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn btn-outline"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewTeacher;
