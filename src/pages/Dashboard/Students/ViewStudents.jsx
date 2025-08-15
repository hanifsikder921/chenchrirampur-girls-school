import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import useAxios from '../../../assets/hooks/useAxios';
import MaleIcon from '../../../assets/images/man.png';
import FemaleIcon from '../../../assets/images/woman.png'

const ViewStudents = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [rollFilter, setRollFilter] = useState('');
  const [page, setPage] = useState(1);
  const axios = useAxios();

  // Fetch Students with proper error handling
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['students', classFilter, sectionFilter, rollFilter, searchTerm, page],
    queryFn: async () => {
      try {
        const res = await axios.get('/students', {
          params: {
            class: classFilter || undefined,
            section: sectionFilter || undefined,
            roll: rollFilter || undefined,
            search: searchTerm || undefined,
            page,
            limit: 10,
          },
        });
        return res.data;
      } catch (err) {
        throw new Error('Failed to fetch students' ,err);
      }
    },
    retry: 1,
  });

  const students = data?.data || [];
  const totalPages = data?.pages || 1;

  // Delete Mutation with proper error handling
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      Swal.fire({
        title: 'Deleted!',
        text: 'Student has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete student.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    },
  });

  // Delete confirmation handler
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



  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  // Error state
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
          <span>{error?.message || 'Failed to load student data'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto">
      {/* Header and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-green-800">Student Management</h2>
        <Link
          to="/dashboard/add-student"
          className="btn bg-green-800 hover:bg-green-700 text-white"
        >
          <FaPlus className="mr-2" />
          Add New Student
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative md:col-span-1">
          <input
            type="text"
            placeholder="Search by name..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <select
          className="select select-bordered"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="">All Classes</option>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
        </select>

        <select
          className="select select-bordered"
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
        >
          <option value="">All Sections</option>
          <option value="Science">Science</option>
          <option value="Humanities">Humanities</option>
          <option value="Business Studies">Business Studies</option>
        </select>

        <input
          type="number"
          placeholder="Filter by Roll"
          className="input input-bordered"
          value={rollFilter}
          onChange={(e) => setRollFilter(e.target.value)}
        />
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                SL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Roll
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{(page - 1) * 10 + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={student.image || (student.gender === 'Male' ? MaleIcon : FemaleIcon)}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = student.gender === 'Male' ? MaleIcon : FemaleIcon;
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Class {student.dclassName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.section || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.roll}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <Link
                      to={`/dashboard/edit-student/${student.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(student.id, student.name)}
                      className="text-red-600 hover:text-red-900"
                      disabled={deleteMutation.isLoading}
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                   
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-600">No students found</p>
                    <p className="text-gray-500">Try adjusting your filters or add a new student</p>
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

export default ViewStudents;
