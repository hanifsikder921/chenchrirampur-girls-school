import React, { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router';
import useAxios from '../../assets/hooks/useAxios';

const NoticeBord = () => {
  const axios = useAxios();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডেটা ফেচ করার ফাংশন
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/notices');
      const data = Array.isArray(res.data) ? res.data : [];
      // সর্বোচ্চ ৬ টা নোটিশ রাখবো
      setNotices(data.slice(0, 6));
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

  // টাইটেল ক্লিক করলে নতুন ট্যাবে ইমেজ ওপেন
  const handleOpenNotice = (imageUrl) => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="mx-auto bg-gray-50 shadow p-4 my-6">
      <div className="flex items-center mb-4">
        <img
          src="https://i.ibb.co.com/DDH1K0JR/globe-removebg-preview.png"
          alt="Globe Icon"
          className="w-10 h-10 mr-3"
        />
        <h2 className="text-xl font-bold text-gray-800">নোটিশ বোর্ড</h2>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">লোড হচ্ছে...</p>
      ) : notices.length === 0 ? (
        <p className="text-gray-500 text-sm">কোনো নোটিশ পাওয়া যায়নি।</p>
      ) : (
        <ul className="space-y-2 text-gray-500">
          {notices.map((notice, index) => (
            <li key={notice._id || index} className="flex items-start">
              <FaPlay className="text-green-800 mt-1 mr-2 text-xs" />
              <p
                onClick={() => handleOpenNotice(notice.imageUrl)}
                className="hover:underline cursor-pointer text-sm text-gray-700"
              >
                {notice.title}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Button */}
      <div className="text-right mt-4">
        <Link
          to="/public-notice"
          className="bg-gray-700 text-white px-4 py-1 text-sm rounded hover:bg-gray-800 cursor-pointer"
        >
          সকল
        </Link>
      </div>
    </div>
  );
};

export default NoticeBord;
