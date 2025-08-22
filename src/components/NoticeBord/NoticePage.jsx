import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUpload,
  FiEdit,
  FiTrash2,
  FiX,
  FiCheck,
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiEye,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxios from '../../assets/hooks/useAxios';

const NoticePage = () => {
  const axios = useAxios();
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [noticeImage, setNoticeImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [editingNotice, setEditingNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [viewModal, setViewModal] = useState({ isOpen: false, imageUrl: '', title: '' });

  // নোটিশ গুলো লোড করার ফাংশন
  const fetchNotices = async () => {
    try {
      setLoadingNotices(true);
      const res = await axios.get('/notices');
      const noticesData = Array.isArray(res.data) ? res.data : [];
      setNotices(noticesData);
    } catch (error) {
      console.error('Error fetching notices:', error);
      Swal.fire('Error', 'Failed to load notices', 'error');
      setNotices([]);
    } finally {
      setLoadingNotices(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;

    try {
      const res = await axios.post(imagUploadUrl, formData);
      setNoticeImage(res.data.data.url);
      setImagePreview(URL.createObjectURL(image));
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire('Error', 'Image upload failed', 'error');
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noticeImage || !title) {
      Swal.fire('Warning', 'Please provide both image and title', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      if (editingNotice) {
        // এডিট মোড
        await axios.put(`/notices/${editingNotice._id}`, {
          title,
          imageUrl: noticeImage,
        });
        Swal.fire('Success', 'Notice updated successfully', 'success');
        setEditingNotice(null);
      } else {
        // নতুন নোটিশ আপলোড
        await axios.post('/notices', {
          title,
          imageUrl: noticeImage,
        });
        Swal.fire('Success', 'Notice uploaded successfully', 'success');
      }

      // রিসেট এবং রিফ্রেশ
      setTitle('');
      setNoticeImage('');
      setImagePreview('');
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      Swal.fire('Error', 'Failed to save notice', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // নোটিশ ডিলিট হ্যান্ডলার
  const deleteNotice = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/notices/${id}`);
        Swal.fire('Deleted!', 'Your notice has been deleted.', 'success');
        fetchNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
        Swal.fire('Error', 'Failed to delete notice', 'error');
      }
    }
  };

  // এডিট মোডে সেট করার ফাংশন
  const startEditing = (notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setNoticeImage(notice.imageUrl);
    setImagePreview(notice.imageUrl);
  };

  // এডিট ক্যান্সেল করার ফাংশন
  const cancelEdit = () => {
    setEditingNotice(null);
    setTitle('');
    setNoticeImage('');
    setImagePreview('');
  };

  // ভিউ মডাল খোলার ফাংশন
  const openViewModal = (imageUrl, title) => {
    setViewModal({ isOpen: true, imageUrl, title });
  };

  // ভিউ মডাল বন্ধ করার ফাংশন
  const closeViewModal = () => {
    setViewModal({ isOpen: false, imageUrl: '', title: '' });
  };

  // সর্টিং ফাংশন
  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // সর্টেড নোটিশ পেতে
  const sortedNotices = React.useMemo(() => {
    if (!notices.length) return [];

    const sortableItems = [...notices];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // createdAt ফিল্ডের জন্য বিশেষ হ্যান্ডলিং
        if (sortConfig.key === 'createdAt') {
          const dateA = new Date(a.createdAt || a._id.getTimestamp?.() || 0);
          const dateB = new Date(b.createdAt || b._id.getTimestamp?.() || 0);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

        // অন্যান্য ফিল্ডের জন্য সাধারণ সর্টিং
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [notices, sortConfig]);

  // তারিখ ফরম্যাট করার ফাংশন
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ইমেজ ভিউ মডাল */}
      {viewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">{viewModal.title}</h3>
              <button
                onClick={closeViewModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] flex justify-center">
              <img
                src={viewModal.imageUrl}
                alt={viewModal.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Notice Management</h1>
        <p className="text-gray-600 mb-8">Manage and organize your notices efficiently</p>

        {/* আপলোড ফর্ম */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editingNotice ? 'Edit Notice' : 'Add New Notice'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter notice title"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? (
                      <span>Processing...</span>
                    ) : editingNotice ? (
                      <>
                        <FiCheck className="mr-2" />
                        Update Notice
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2" />
                        Add Notice
                      </>
                    )}
                  </button>

                  {editingNotice && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>
                      <input
                        id="image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        required={!editingNotice}
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md shadow-sm border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => openViewModal(imagePreview, title || 'Preview')}
                          className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70 transition-colors"
                          title="View larger"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* নোটিশ টেবিল */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">All Notices</h2>
            <span className="text-sm text-gray-500">
              {sortedNotices.length} {sortedNotices.length === 1 ? 'notice' : 'notices'}
            </span>
          </div>

          {loadingNotices ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : !notices || notices.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-500">No notices added yet.</p>
              <p className="text-gray-400 text-sm mt-1">
                Add your first notice using the form above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Title
                        {sortConfig.key === 'title' &&
                          (sortConfig.direction === 'asc' ? (
                            <FiArrowUp className="ml-1" />
                          ) : (
                            <FiArrowDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Preview
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Date Added
                        {sortConfig.key === 'createdAt' &&
                          (sortConfig.direction === 'asc' ? (
                            <FiArrowUp className="ml-1" />
                          ) : (
                            <FiArrowDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedNotices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 relative">
                          <img
                            className="h-12 w-16 object-cover rounded border border-gray-200"
                            src={notice.imageUrl}
                            alt={notice.title}
                          />
                         
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(notice.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openViewModal(notice.imageUrl, notice.title)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="View notice"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => startEditing(notice)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit notice"
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteNotice(notice._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete notice"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NoticePage;
