import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaEye, FaTrash, FaSearch, FaSync, FaFilter } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxios from '../../../assets/hooks/useAxios';
import { MdDownloadDone } from 'react-icons/md';

const ViewAdmission = () => {
  const axios = useAxios();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const modalContentRef = React.useRef();

  const handlePrint = () => {
    const printContent = modalContentRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };
  // Helper function to calculate age from date of birth
  const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';

    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Fetch admissions data
  const {
    data: admissions,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admissions'],
    queryFn: async () => {
      const response = await axios.get('/admissions');
      return response.data;
    },
  });

  // Delete admission mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/admissions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admissions']);
      Swal.fire('Deleted!', 'Admission has been deleted.', 'success');
    },
    onError: (error) => {
      Swal.fire(
        'Error!',
        `Error deleting admission: ${error.response?.data?.message || error.message}`,
        'error'
      );
    },
  });

  // Update admission status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axios.patch(`/admissions/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admissions']);
      Swal.fire('Success!', 'Admission status updated.', 'success');
    },
    onError: (error) => {
      Swal.fire(
        'Error!',
        `Error updating status: ${error.response?.data?.message || error.message}`,
        'error'
      );
    },
  });

  // Filter and search admissions
  const filteredAdmissions =
    admissions
      ?.filter((admission) => {
        const matchesSearch =
          admission.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admission.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admission.phone?.includes(searchTerm) ||
          admission.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || admission.status === statusFilter;
        const matchesClass = classFilter === 'all' || admission.className === classFilter;

        return matchesSearch && matchesStatus && matchesClass;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
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

  const handleApproved = (id) => {
    updateStatusMutation.mutate({ id, status: 'approved' });
  };

  const handleView = (admission) => {
    setSelectedAdmission(admission);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
        <button
          onClick={() => refetch()}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <style>
        {`
          @media print {
            .no-print {
              display: none;
            }
          }
        `}
      </style>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admission Requests</h1>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Classes</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredAdmissions.length} of {admissions.length} requests
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            <FaSync className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Class
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submitted
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No admission requests found
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((admission) => (
                  <tr key={admission._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admission.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Father: {admission.fatherName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admission.phone}</div>
                      <div className="text-sm text-gray-500">{admission.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Class {admission?.className}
                      </span>
                      {admission.group && (
                        <div className="text-sm text-gray-500 mt-1">Group: {admission.group}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admission.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : admission.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {admission.status?.charAt(0).toUpperCase() + admission.status?.slice(1) ||
                          'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(admission.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(admission)}
                          className="text-blue-600 hover:text-blue-900 flex bg-red-100 p-2 items-center gap-1 rounded "
                          title="View Details"
                        >
                          <FaEye /> view
                        </button>

                        <button
                          onClick={() => handleApproved(admission._id)}
                          className="text-green-600 hover:text-green-900 flex bg-green-100 p-2 items-center gap-1 rounded"
                          title="Approved"
                        >
                          <MdDownloadDone /> Approve
                        </button>

                        <button
                          onClick={() => handleDelete(admission._id)}
                          className="text-red-600 hover:text-red-900 flex bg-red-100 p-2 items-center gap-1 rounded"
                          title="Delete"
                          disabled={deleteMutation.isLoading}
                        >
                          <FaTrash /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedAdmission && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto  w-full z-50">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 scale-95 hover:scale-100">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-xl no-print">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">Admission Details</h3>
                    <p className="text-blue-100 mt-1">Complete application information</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-blue-200 bg-blue-700 hover:bg-blue-800 rounded-full p-2 transition-colors duration-200"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6" ref={modalContentRef}>
                <div className='w-full text-center mb-6'>
                  <h2 className="text-xl font-bold mx-auto text-green-800">Chenchri Rampur Girls High School</h2>
                  <p className="text-gray-600">Admission Application</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information Card */}
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-full mr-3">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Personal Information</h4>
                    </div>

                    <dl className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                        <dd className="text-sm text-gray-900 font-medium sm:col-span-2">
                          {selectedAdmission.studentName || 'Not provided'}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Father's Name</dt>
                        <dd className="text-sm text-gray-900 sm:col-span-2">
                          {selectedAdmission.fatherName || 'Not provided'}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Mother's Name</dt>
                        <dd className="text-sm text-gray-900 sm:col-span-2">
                          {selectedAdmission.motherName || 'Not provided'}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Birth Certificate No</dt>
                        <dd className="text-sm text-gray-900 sm:col-span-2">
                          {selectedAdmission.birthCertificate ? (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {selectedAdmission.birthCertificate}
                            </span>
                          ) : (
                            'Not provided'
                          )}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                        <dd className="text-sm text-gray-900 sm:col-span-2">
                          {selectedAdmission.dob ? (
                            <span className="flex items-center">
                              {selectedAdmission.dob}
                              <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {calculateAge(selectedAdmission.dob)} years
                              </span>
                            </span>
                          ) : (
                            'Not provided'
                          )}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Gender</dt>
                        <dd className="text-sm text-gray-900 sm:col-span-2">
                          {selectedAdmission.gender ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                selectedAdmission.gender === 'Male'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-pink-100 text-pink-800'
                              }`}
                            >
                              {selectedAdmission.gender}
                            </span>
                          ) : (
                            'Not provided'
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Contact Information Card */}
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-3 rounded-full mr-3">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Contact Information</h4>
                    </div>

                    <dl className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="text-sm text-gray-900 font-medium sm:col-span-2">
                          {selectedAdmission.phone ? (
                            <a
                              href={`tel:${selectedAdmission.phone}`}
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              {selectedAdmission.phone}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="text-sm text-gray-900 sm:col-span-2">
                          {selectedAdmission.email ? (
                            <a
                              href={`mailto:${selectedAdmission.email}`}
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              {selectedAdmission.email}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </dd>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="text-sm text-gray-900 sm:col-span-2">
                          {selectedAdmission.address || 'Not provided'}
                        </dd>
                      </div>
                    </dl>

                    {/* Academic Information */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="bg-purple-100 p-3 rounded-full mr-3">
                          <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          Academic Information
                        </h4>
                      </div>

                      <dl className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <dt className="text-sm font-medium text-gray-500">Class</dt>
                          <dd className="text-sm text-gray-900 font-medium sm:col-span-2">
                            {selectedAdmission.className ? (
                              <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                Class {selectedAdmission.className}
                              </span>
                            ) : (
                              'Not provided'
                            )}
                          </dd>
                        </div>

                        {selectedAdmission.group && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <dt className="text-sm font-medium text-gray-500">Group</dt>
                            <dd className="text-sm text-gray-900 sm:col-span-2">
                              <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {selectedAdmission.group}
                              </span>
                            </dd>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <dt className="text-sm font-medium text-gray-500">Previous School</dt>
                          <dd className="text-sm text-gray-900 sm:col-span-2">
                            {selectedAdmission.previousSchool || 'Not provided'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-3 justify-end border-t pt-6 no-print">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Print Details
                  </button>
                  <button className="px-5 py-2.5 hidden text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300">
                    Approve Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAdmission;
