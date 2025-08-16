import React, { useState } from 'react';
import useAxios from './../../../assets/hooks/useAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router';

const ViewMarks = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    examType: '',
    examYear: '',
    classesName: '',
    roll: '',
  });

  // Fetch Marks with React Query
  const {
    data: marks = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['marks', filters],
    queryFn: async () => {
      const res = await axios.get('/marks', { params: filters });
      return res.data;
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`/marks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['marks']); // reload data
      Swal.fire('Deleted!', 'Result deleted successfully!', 'success');
    },
    onError: () => {
      Swal.fire('Error!', 'Failed to delete result.', 'error');
    },
  });

  // Handle Filter Change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    refetch();
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this result!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">View Marks</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select
          name="classesName"
          className="border p-2 rounded"
          value={filters.classesName}
          onChange={handleFilterChange}
        >
          <option value="">All Classes</option>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
        </select>

        <select
          name="examYear"
          className="border p-2 rounded"
          value={filters.examYear}
          onChange={handleFilterChange}
        >
          <option value="">All Years</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

        <select
          name="examType"
          className="border p-2 rounded"
          value={filters.examType}
          onChange={handleFilterChange}
        >
          <option value="">All Exams</option>
          <option value="half_yearly">Half Yearly</option>
          <option value="yearly">Yearly</option>
          <option value="test_exam">Test Exam</option>
          <option value="pre_test">Pre Test</option>
        </select>

        <input
          type="text"
          name="roll"
          className="border p-2 rounded"
          placeholder="Search Roll"
          value={filters.roll}
          onChange={handleFilterChange}
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600"
      >
        Search
      </button>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
        </div>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-green-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Class</th>
              <th className="border px-4 py-2">Roll</th>
              <th className="border px-4 py-2">Exam Type</th>
              <th className="border px-4 py-2">Exam Year</th>
              <th className="border px-4 py-2">CGPA</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {marks.length > 0 ? (
              marks.map((m, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{m.studentName}</td>
                  <td className="border px-4 py-2">Class {m.classesName}</td>
                  <td className="border px-4 py-2">{m.roll}</td>
                  <td className="border px-4 py-2">{m.examType}</td>
                  <td className="border px-4 py-2">{m.examYear}</td>
                  <td
                    className={`border px-4 py-2 ${
                      [
                        'F1',
                        'F2',
                        'F3',
                        'F4',
                        'F5',
                        'F6',
                        'F7',
                        'F8',
                        'F9',
                        'F10',
                        'F11',
                        'F12',
                        'F13',
                        'F14',
                        'F15',
                      ].includes(m.cgpa)
                        ? 'bg-red-500 text-white'
                        : ''
                    }`}
                  >
                    {m.cgpa}
                  </td>

                  <td className="border px-4 py-2">
                    <div className="flex items-center justify-center gap-3">
                      <Link to={`/dashboard/edit-marks/${m._id}`} className="bg-blue-500 text-white px-4 py-2 flex items-center gap-1 rounded hover:bg-blue-600">
                        <FaEdit /> Edit
                      </Link>
                      <button
                        className="bg-red-500 text-white px-4 py-2 flex items-center gap-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(m._id)}
                        disabled={deleteMutation.isLoading}
                      >
                        <MdDelete /> 
                        {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2 text-center" colSpan="7">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewMarks;
