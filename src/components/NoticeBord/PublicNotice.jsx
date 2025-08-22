import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import useAxios from '../../assets/hooks/useAxios';

const PublicNotice = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // নোটিশ গুলো লোড করার ফাংশন
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/notices');
      const noticesData = Array.isArray(res.data) ? res.data : [];
      setNotices(noticesData);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ভিউ বাটনে ক্লিক করলে নোটিশ ডিটেইল পেজে নেওয়ার ফাংশন
  // ভিউ বাটনে ক্লিক করলে নতুন ট্যাবে ইমেজ ওপেন হবে
  const handleViewNotice = (imageUrl) => {
    window.open(imageUrl, '_blank');
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
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Notices</h1>
          <p className="text-gray-600">Important announcements and updates</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-800">All Notices</h2>
              <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                {sortedNotices.length} {sortedNotices.length === 1 ? 'notice' : 'notices'} found
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : !notices || notices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
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
              <p className="text-gray-500 text-lg">No notices available at the moment.</p>
              <p className="text-gray-400 mt-1">Please check back later for updates.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      SL No
                    </th>
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Date
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
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedNotices.map((notice, index) => (
                    <tr
                      key={notice._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(notice.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewNotice(notice.imageUrl)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <FiEye className="mr-1.5 h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>For any queries regarding notices, please contact the administration.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicNotice;
