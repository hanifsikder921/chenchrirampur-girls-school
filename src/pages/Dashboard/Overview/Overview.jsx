import React, { useState, useEffect } from 'react';
import useAxios from '../../../assets/hooks/useAxios';

const Overview = () => {
  const axios = useAxios();
  const [stats, setStats] = useState({
    teachers: { total: 0, male: 0, female: 0 },
    staff: { total: 0, male: 0, female: 0 },
    students: { total: 0, male: 0, female: 0, muslim: 0, hindu: 0 },
  });
  const [detailedStats, setDetailedStats] = useState({
    teacherSubjects: [],
    staffDesignations: [],
    studentClasses: [],
    bloodGroups: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewStats();
    fetchDetailedStats();
  }, []);

  const fetchOverviewStats = async () => {
    try {
      const response = await axios.get('/stats/overview');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching overview stats:', error);
    }
  };

  const fetchDetailedStats = async () => {
    try {
      const [teacherRes, staffRes, studentRes] = await Promise.all([
        axios.get('/stats/teachers'),
        axios.get('/stats/staff'),
        axios.get('/stats/students/detailed'),
      ]);

      setDetailedStats({
        teacherSubjects: teacherRes.data.success ? teacherRes.data.data.subjectWise : [],
        staffDesignations: staffRes.data.success ? staffRes.data.data.designationWise : [],
        studentClasses: studentRes.data.success ? studentRes.data.data.classStats : [],
        bloodGroups: studentRes.data.success ? studentRes.data.data.bloodGroupStats : [],
      });
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, bgColor, textColor }) => (
    <div
      className={`${bgColor} rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor || 'text-gray-600'}`}>{title}</p>
          <p className={`text-3xl font-bold ${textColor || 'text-gray-800'} mt-1`}>
            {value.toLocaleString('bn-BD')}
          </p>
          {subtitle && <p className={`text-xs ${textColor || 'text-gray-500'} mt-2`}>{subtitle}</p>}
        </div>
        <div className={`text-4xl ${textColor || 'text-gray-400'}`}>{icon}</div>
      </div>
    </div>
  );

  const SectionCard = ({ title, children, bgColor = 'bg-white' }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg`}>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">{title}</h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">স্কুল ড্যাশবোর্ড</h1>
          <p className="text-gray-600">একনজরে সকল পরিসংখ্যান</p>
        </div>

        {/* Teachers Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            👨‍🏫 শিক্ষক পরিসংখ্যান
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="মোট শিক্ষক"
              value={stats.teachers.total}
              subtitle="সর্বমোট শিক্ষকদের সংখ্যা"
              icon="👥"
              bgColor="bg-gradient-to-r from-blue-400 to-blue-600"
              textColor="text-white"
            />
            <StatCard
              title="পুরুষ শিক্ষক"
              value={stats.teachers.male}
              subtitle={`${((stats.teachers.male / stats.teachers.total) * 100 || 0).toFixed(
                1
              )}% পুরুষ`}
              icon="👨‍🏫"
              bgColor="bg-gradient-to-r from-green-400 to-green-600"
              textColor="text-white"
            />
            <StatCard
              title="মহিলা শিক্ষক"
              value={stats.teachers.female}
              subtitle={`${((stats.teachers.female / stats.teachers.total) * 100 || 0).toFixed(
                1
              )}% মহিলা`}
              icon="👩‍🏫"
              bgColor="bg-gradient-to-r from-purple-400 to-purple-600"
              textColor="text-white"
            />
          </div>

          {/* Subject-wise Teacher Distribution */}
          {detailedStats.teacherSubjects.length > 0 && (
            <SectionCard title="📚 বিষয়ভিত্তিক শিক্ষকদের তথ্য">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {detailedStats.teacherSubjects.map((item, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">{item.subject}</p>
                    <p className="text-2xl font-bold text-blue-600">{item.count}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Staff Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            👷 কর্মচারী পরিসংখ্যান
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="মোট কর্মচারী"
              value={stats.staff.total}
              subtitle="সর্বমোট কর্মচারী সংখ্যা"
              icon="👥"
              bgColor="bg-gradient-to-r from-orange-400 to-orange-600"
              textColor="text-white"
            />
            <StatCard
              title="পুরুষ কর্মচারী"
              value={stats.staff.male}
              subtitle={`${((stats.staff.male / stats.staff.total) * 100 || 0).toFixed(1)}% পুরুষ`}
              icon="👨‍💼"
              bgColor="bg-gradient-to-r from-teal-400 to-teal-600"
              textColor="text-white"
            />
            <StatCard
              title="মহিলা কর্মচারী"
              value={stats.staff.female}
              subtitle={`${((stats.staff.female / stats.staff.total) * 100 || 0).toFixed(
                1
              )}% মহিলা`}
              icon="👩‍💼"
              bgColor="bg-gradient-to-r from-pink-400 to-pink-600"
              textColor="text-white"
            />
          </div>

          {/* Designation-wise Staff Distribution */}
          {detailedStats.staffDesignations.length > 0 && (
            <SectionCard title="📋 পদভিত্তিক কর্মচারীদের তথ্য">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {detailedStats.staffDesignations.map((item, index) => (
                  <div key={index} className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">{item.designation}</p>
                    <p className="text-2xl font-bold text-orange-600">{item.count}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Students Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            🎓 শিক্ষার্থী পরিসংখ্যান
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="মোট শিক্ষার্থী"
              value={stats.students.total}
              subtitle="সর্বমোট শিক্ষার্থী সংখ্যা"
              icon="👨‍🎓"
              bgColor="bg-gradient-to-r from-indigo-400 to-indigo-600"
              textColor="text-white"
            />
            <StatCard
              title="পুরুষ শিক্ষার্থী"
              value={stats.students.male}
              subtitle={`${((stats.students.male / stats.students.total) * 100 || 0).toFixed(
                1
              )}% পুরুষ`}
              icon="👨‍🎓"
              bgColor="bg-gradient-to-r from-cyan-400 to-cyan-600"
              textColor="text-white"
            />
            <StatCard
              title="মহিলা শিক্ষার্থী"
              value={stats.students.female}
              subtitle={`${((stats.students.female / stats.students.total) * 100 || 0).toFixed(
                1
              )}% মহিলা`}
              icon="👩‍🎓"
              bgColor="bg-gradient-to-r from-rose-400 to-rose-600"
              textColor="text-white"
            />
            <StatCard
              title="মুসলিম শিক্ষার্থী"
              value={stats.students.muslim}
              subtitle={`${((stats.students.muslim / stats.students.total) * 100 || 0).toFixed(
                1
              )}% মুসলিম`}
              icon="🕌"
              bgColor="bg-gradient-to-r from-emerald-400 to-emerald-600"
              textColor="text-white"
            />
            <StatCard
              title="হিন্দু শিক্ষার্থী"
              value={stats.students.hindu}
              subtitle={`${((stats.students.hindu / stats.students.total) * 100 || 0).toFixed(
                1
              )}% হিন্দু`}
              icon="🕉️"
              bgColor="bg-gradient-to-r from-amber-400 to-amber-600"
              textColor="text-white"
            />
          </div>

          {/* Class-wise Student Distribution */}
          {detailedStats.studentClasses.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title="📚 শ্রেণীভিত্তিক শিক্ষার্থীদের তথ্য">
                <div className="space-y-3">
                  {detailedStats.studentClasses.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-indigo-50 rounded-lg p-3"
                    >
                      <span className="font-medium">শ্রেণী {item.className}</span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-indigo-600">{item.total}</span>
                        <div className="text-xs text-gray-600">
                          ♂️ {item.male} | ♀️ {item.female}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Blood Group Distribution */}
              {detailedStats.bloodGroups.length > 0 && (
                <SectionCard title="🩸 রক্তের গ্রুপ বিতরণ">
                  <div className="grid grid-cols-2 gap-3">
                    {detailedStats.bloodGroups.map((item, index) => (
                      <div key={index} className="bg-red-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600">{item.bloodGroup}</p>
                        <p className="text-xl font-bold text-red-600">{item.count}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>
          )}
        </div>

        {/* Total Summary */}
        <SectionCard
          title="📊 সার্বিক সারসংক্ষেপ"
          bgColor="bg-gradient-to-r from-gray-800 to-gray-900"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {(stats.teachers.total + stats.staff.total).toLocaleString('bn-BD')}
              </p>
              <p className="text-gray-300">মোট শিক্ষক ও কর্মচারী</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.students.total.toLocaleString('bn-BD')}</p>
              <p className="text-gray-300">মোট শিক্ষার্থী</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {(stats.teachers.total + stats.staff.total + stats.students.total).toLocaleString(
                  'bn-BD'
                )}
              </p>
              <p className="text-gray-300">মোট জনবল</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Overview;
