import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { FiUpload, FiEdit, FiTrash2, FiStar, FiAward, FiX, FiCheck } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxios from '../../../assets/hooks/useAxios';

const MediaManagement = () => {
  const axios = useAxios();
  const [images, setImages] = useState([]); // শুরুতে empty array দিয়ে initialize করুন
  const [title, setTitle] = useState('');
  const [studentImage, setStudentImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [editingImage, setEditingImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true); // নতুন state যোগ করুন

  // ইমেজ গুলো লোড করার ফাংশন
  const fetchImages = async () => {
    try {
      setLoadingImages(true);
      const res = await axios.get('/imageMedia');
      // নিশ্চিত করুন যে response data একটি array
      setImages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching images:', error);
      Swal.fire('Error', 'Failed to load images', 'error');
      setImages([]); // error হলে empty array set করুন
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    fetchImages();
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
      setStudentImage(res.data.data.url);
      setImagePreview(URL.createObjectURL(image));
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire('Error', 'Image upload failed', 'error');
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentImage || !title) {
      Swal.fire('Warning', 'Please provide both image and title', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      if (editingImage) {
        // এডিট মোড
        await axios.put(`/imageMedia/${editingImage._id}`, {
          title,
          imageUrl: studentImage,
        });
        Swal.fire('Success', 'Image updated successfully', 'success');
        setEditingImage(null);
      } else {
        // নতুন ইমেজ আপলোড
        await axios.post('/imageMedia', {
          title,
          imageUrl: studentImage,
          feature: false,
          banner: false,
          gallery: false,
        });
        Swal.fire('Success', 'Image uploaded successfully', 'success');
      }

      // রিসেট এবং রিফ্রেশ
      setTitle('');
      setStudentImage('');
      setImagePreview('');
      fetchImages();
    } catch (error) {
      console.error('Error saving image:', error);
      Swal.fire('Error', 'Failed to save image', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ফিচার টগল হ্যান্ডলার
  const toggleFeature = async (id, currentStatus) => {
    try {
      await axios.patch(`/imageMedia/${id}`, {
        feature: !currentStatus,
      });
      fetchImages();
    } catch (error) {
      console.error('Error updating feature status:', error);
      Swal.fire('Error', 'Failed to update feature status', 'error');
    }
  };

  // ব্যানার টগল হ্যান্ডলার
  const toggleBanner = async (id, currentStatus) => {
    try {
      await axios.patch(`/imageMedia/${id}`, {
        banner: !currentStatus,
      });
      fetchImages();
    } catch (error) {
      console.error('Error updating banner status:', error);
      Swal.fire('Error', 'Failed to update banner status', 'error');
    }
  };
  // ব্যানার টগল হ্যান্ডলার
  const toggleGallery = async (id, currentStatus) => {
    try {
      await axios.patch(`/imageMedia/${id}`, {
        gallery: !currentStatus,
      });
      fetchImages();
    } catch (error) {
      console.error('Error updating banner status:', error);
      Swal.fire('Error', 'Failed to update banner status', 'error');
    }
  };

  // ইমেজ ডিলিট হ্যান্ডলার
  const deleteImage = async (id) => {
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
        await axios.delete(`/imageMedia/${id}`);
        Swal.fire('Deleted!', 'Your image has been deleted.', 'success');
        fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
        Swal.fire('Error', 'Failed to delete image', 'error');
      }
    }
  };

  // এডিট মোডে সেট করার ফাংশন
  const startEditing = (image) => {
    setEditingImage(image);
    setTitle(image.title);
    setStudentImage(image.imageUrl);
    setImagePreview(image.imageUrl);
  };

  // এডিট ক্যান্সেল করার ফাংশন
  const cancelEdit = () => {
    setEditingImage(null);
    setTitle('');
    setStudentImage('');
    setImagePreview('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Media Management</h1>

        {/* আপলোড ফর্ম */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editingImage ? 'Edit Image' : 'Upload New Image'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">Click here to upload photo</p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required={!editingImage}
                  />
                </label>
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Preview</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : editingImage ? (
                  <>
                    <FiCheck className="mr-2" />
                    Update
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2" />
                    Upload
                  </>
                )}
              </button>

              {editingImage && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* ইমেজ টেবিল */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Uploaded Images</h2>

          {loadingImages ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : !images || images.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No images uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Featured
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Banner
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      gallery
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
                  {images.map((image) => (
                    <tr key={image._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={image.imageUrl}
                          alt={image.title}
                          className="w-16 h-16 object-cover rounded-md shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {image.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className={`flex items-center justify-center px-3 py-1 rounded-full text-sm ${
                            image.feature
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                          onClick={() => toggleFeature(image._id, image.feature)}
                        >
                          <FiStar className="mr-1" />
                          {image.feature ? 'Featured' : 'Set Feature'}
                        </button>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className={`flex items-center justify-center px-3 py-1 rounded-full text-sm ${
                            image.banner
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                          onClick={() => toggleBanner(image._id, image.banner)}
                        >
                          <FiAward className="mr-1" />
                          {image.banner ? 'Banner' : 'Set Banner'}
                        </button>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className={`flex items-center justify-center px-3 py-1 rounded-full text-sm ${
                            image.gallery
                              ? 'bg-purple-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                          onClick={() => toggleGallery(image._id, image.gallery)}
                        >
                          <FiAward className="mr-1" />
                          {image.gallery ? 'Gallery' : 'Set Gallery'}
                        </button>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => startEditing(image)}
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteImage(image._id)}
                          >
                            <FiTrash2 size={18} />
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

export default MediaManagement;
