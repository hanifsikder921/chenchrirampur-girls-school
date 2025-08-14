import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

// API URL
const API_URL = 'https://your-api.com/students';

const ViewStudents = () => {
  const queryClient = useQueryClient();

  // Filters State
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [rollFilter, setRollFilter] = useState('');

  // Fetch Students
  const {
    data: students = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['students', classFilter, sectionFilter, rollFilter],
    queryFn: async () => {
      const res = await axios.get(API_URL, {
        params: {
          class: classFilter || undefined,
          section: sectionFilter || undefined,
          roll: rollFilter || undefined,
        },
      });
      return res.data;
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
    },
  });

  // Handlers
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="text-center">Loading students...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load students.</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-green-800 dark:text-green-400">View Students</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2 rounded"
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
          className="border p-2 rounded"
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
        >
          <option value="">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
        </select>

        <input
          type="number"
          placeholder="Roll"
          className="border p-2 rounded"
          value={rollFilter}
          onChange={(e) => setRollFilter(e.target.value)}
        />
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Roll</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-3">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.class}</td>
                <td className="p-3">{student.section}</td>
                <td className="p-3">{student.roll}</td>
                <td className="p-3 flex gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => alert('Edit ' + student.name)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(student.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewStudents;
