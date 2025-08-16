import React, { useEffect, useState } from 'react';
import useAxios from './../../../assets/hooks/useAxios';

const ViewMarks = () => {
  const axios = useAxios();
  const [marks, setMarks] = useState([]);
  const [filters, setFilters] = useState({
    examType: '',
    examYear: '',
    classesName: '',
    roll: '',
  });

  // Fetch marks from backend
  const fetchMarks = async () => {
    try {
      const response = await axios.get('/marks', { params: filters });
      setMarks(response.data);
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchMarks();
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
                <td className="border px-4 py-2">{m.cgpa}</td>
                <td className="border px-4 py-2 gap-2">
                  <div className='w-full flex items-center justify-center gap-3'>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => alert(`Viewing marks for ${m.studentName}`)}
                    >
                      View
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => alert(`Deleting marks for ${m.studentName}`)}
                    >
                      Delete
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
    </div>
  );
};

export default ViewMarks;
