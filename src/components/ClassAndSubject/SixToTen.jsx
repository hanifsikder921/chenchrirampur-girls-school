import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from './../../assets/hooks/useAxios';

const StudentStatistics = () => {
  const axios = useAxios();

  // Fetch detailed student statistics
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['student-statistics'],
    queryFn: async () => {
      const res = await axios.get('/students/stats/detailed');
      return res.data.data;
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Statistics</h2>
          <p className="text-gray-600">{error?.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  const { overview, classWise, sectionWise } = stats || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ছাত্র-ছাত্রী পরিসংখ্যান</h1>
        </div>

        {/* Overall Statistics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">সামগ্রিক পরিসংখ্যান</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">মোট ছাত্র-ছাত্রী</p>
                  <p className="text-3xl font-bold">{overview?.totalStudents || 0}</p>
                </div>
                <div className="bg-blue-400 rounded-full p-3">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">মোট ছাত্র</p>
                  <p className="text-3xl font-bold">{overview?.totalMaleStudents || 0}</p>
                </div>
                <div className="bg-green-400 rounded-full p-3">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">মোট ছাত্রী</p>
                  <p className="text-3xl font-bold">{overview?.totalFemaleStudents || 0}</p>
                </div>
                <div className="bg-pink-400 rounded-full p-3">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Class-wise Statistics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            শ্রেণীভিত্তিক পরিসংখ্যান
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      শ্রেণী
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      মোট ছাত্র-ছাত্রী
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ছাত্র
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ছাত্রী
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      শতাংশ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classWise?.map((classData, index) => (
                    <tr
                      key={classData.className}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {classData.className === '6'
                          ? '৬ষ্ঠ'
                          : classData.className === '7'
                          ? '৭ম'
                          : classData.className === '8'
                          ? '৮ম'
                          : classData.className === '9'
                          ? '৯ম'
                          : classData.className === '10'
                          ? '১০ম'
                          : `${classData.className}ম`}{' '}
                        শ্রেণী
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {classData.totalStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {classData.maleStudents}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                          {classData.femaleStudents}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${(
                                  (classData.totalStudents / overview?.totalStudents) *
                                  100
                                ).toFixed(1)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {((classData.totalStudents / overview?.totalStudents) * 100).toFixed(1)}
                            %
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section-wise Statistics for Classes 9 & 10 */}
        {sectionWise && sectionWise.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ৯ম ও ১০ম শ্রেণীর বিভাগভিত্তিক পরিসংখ্যান
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Class 9 Sections */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">৯ম শ্রেণী</h3>
                <div className="space-y-4">
                  {sectionWise
                    .filter((section) => section.className === '9')
                    .map((section, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-800">{section.section}</h4>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            মোট: {section.totalStudents}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">ছাত্র:</span>
                            <span className="font-medium text-green-600">
                              {section.maleStudents}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ছাত্রী:</span>
                            <span className="font-medium text-pink-600">
                              {section.femaleStudents}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Class 10 Sections */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">১০ম শ্রেণী</h3>
                <div className="space-y-4">
                  {sectionWise
                    .filter((section) => section.className === '10')
                    .map((section, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-800">{section.section}</h4>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            মোট: {section.totalStudents}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">ছাত্র:</span>
                            <span className="font-medium text-green-600">
                              {section.maleStudents}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ছাত্রী:</span>
                            <span className="font-medium text-pink-600">
                              {section.femaleStudents}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-2">{classWise?.length || 0}</div>
            <div className="text-sm text-gray-600">মোট শ্রেণী</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {sectionWise?.length || 0}
            </div>
            <div className="text-sm text-gray-600">মোট বিভাগ (৯ম ও ১০ম)</div>
          </div>




          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {overview?.totalMaleStudents && overview?.totalFemaleStudents
                ? ((overview?.totalFemaleStudents / overview?.totalStudents) * 100).toFixed(2)
                : '0.0'}
              %
            </div>
            <div className="text-sm text-gray-600">ছাত্রীদের অনুপাত</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {overview?.totalMaleStudents && overview?.totalFemaleStudents
                ? ((overview.totalMaleStudents / overview.totalStudents) * 100).toFixed(2)
                : '0.0'}
              %
            </div>
            <div className="text-sm text-gray-600">ছাত্রদের অনুপাত</div>
          </div>





          <div className="bg-white rounded-lg shadow-lg p-6 text-center col-span-2">
            <div className="text-2xl font-bold text-teal-600 mb-2">
              {classWise?.length ? Math.round(overview?.totalStudents / classWise.length) : 0}
            </div>
            <div className="text-sm text-gray-600">গড় ছাত্র/শ্রেণী</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>সর্বশেষ হালনাগাদ: {new Date().toLocaleDateString('bn-BD')}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentStatistics;
