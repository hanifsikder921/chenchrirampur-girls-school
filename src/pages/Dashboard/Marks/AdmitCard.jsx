import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Loader2,
  GraduationCap,
  Calendar,
  Users,
  BookOpen,
  PrinterIcon,
} from 'lucide-react';
import useAxios from '../../../assets/hooks/useAxios';

const AdmitCard = () => {
    const axios =useAxios();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedExamYear, setSelectedExamYear] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [admitCards, setAdmitCards] = useState([]);
  const printRef = useRef();

  const classes = ['6', '7', '8', '9', '10'];
  const examTypes = ['Test Exam', 'Half Yearly', 'Yearly', 'Pre Test'];
  const examYears = ['2025', '2026', '2027', '2028', '2029', '2030'];

 const handleGenerate = async () => {
   if (!selectedClass || !selectedExamType || !selectedExamYear) {
     alert('দয়া করে সব ফিল্ড নির্বাচন করুন');
     return;
   }

   setLoading(true);
   try {
     // ব্যাকএন্ড রুট অনুযায়ী axios কল
     const response = await axios.get(`/students/by-class`, {
       params: {
         className: selectedClass,
         status: 'active',
       },
     });

     // response.data.data তে স্টুডেন্ট ডেটা থাকে
     const filteredStudents = response.data.success ? response.data.data : [];

     setStudents(filteredStudents);
     setAdmitCards(filteredStudents);
   } catch (error) {
     console.error('Error fetching students:', error);
     alert('স্টুডেন্ট ডেটা আনতে সমস্যা হয়েছে');
   } finally {
     setLoading(false);
   }
 };


  const handlePrint = () => {
    const printContent = printRef.current;
    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(`
      <html>
        <head>
          <title>Admit Cards</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0;
            }
            .page-container {
              display: flex;
              flex-direction: column;
              height: 100vh;
              page-break-after: always;
            }
            .admit-card {
              border: 2px solid #2563eb;
              margin-bottom: 15px;
              padding: 10px;
              background: white;
              border-radius: 8px;
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            .admit-card:nth-child(3n) {
              margin-bottom: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
            }
            .school-name {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 3px;
            }
            .exam-info {
              font-size: 16px;
              color: #374151;
              font-weight: 600;
            }
            .content {
              display: flex;
              gap: 20px;
              flex: 1;
            }
            .student-info {
              flex: 1;
            }
            .info-row {
              display: flex;
              margin-bottom: 11px;
              padding: 5px 0;
            }
            .label {
              font-weight: bold;
              min-width: 120px;
              color: #374151;
            }
            .value {
              color: #1f2937;
              border-bottom: 1px dotted #9ca3af;
              flex: 1;
            }
            .photo-section {
              width: 120px;
              text-align: center;
            }
            .photo {
              width: 100px;
              height: 120px;
              border: 2px solid #d1d5db;
              object-fit: cover;
              margin-bottom: 10px;
            }
            .signature {
              margin-top: 40px;
              text-align: right;
            }
            .signature-line {
              border-bottom: 1px solid #374151;
              width: 200px;
              margin-left: auto;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  const renderAdmitCards = () => {
    const cards = [];
    for (let i = 0; i < admitCards.length; i += 3) {
      const pageCards = admitCards.slice(i, i + 3);
      cards.push(
        <div key={i} className="page-container">
          {pageCards.map((student, index) => (
            <div key={student.id || student._id} className="admit-card">
              <div className="header">
                <div className="school-name">চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয়</div>
                <div className="exam-info">
                  {selectedExamType} Examination - {selectedExamYear}
                  <p className="border w-max mx-auto px-4 rounded-full">Admit Card</p>
                </div>
              </div>

              <div className="content">
                <div className="student-info">
                  <div className="info-row">
                    <span className="label">নাম:</span>
                    <span className="value">{student.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">পিতার নাম:</span>
                    <span className="value">{student.fatherName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">মাতার নাম:</span>
                    <span className="value">{student.motherName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">শ্রেণি:</span>
                    <span className="value">
                      {{
                        6: 'Six',
                        7: 'Seven',
                        8: 'Eight',
                        9: 'Nine',
                        10: 'Ten',
                      }[student.dclassName] || student.dclassName}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">রোল নং:</span>
                    <span className="value">{student.roll}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">শাখা:</span>
                    <span className="value">{student.section || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">লিঙ্গ:</span>
                    <span className="value">{student.gender === 'Male' ? 'পুরুষ' : 'মহিলা'}</span>
                  </div>
                </div>

                <div className="photo-section">
                  <img
                    src={student.image || 'https://via.placeholder.com/100x120?text=Photo'}
                    alt="Student"
                    className="photo"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x120?text=Photo';
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>ছবি</div>
                </div>
              </div>

              <div className="signature">
                <div className="signature-line"></div>
                <div style={{ fontSize: '14px', color: '#374151' }}>প্রধান শিক্ষকের স্বাক্ষর</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return cards;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <GraduationCap className="text-white" size={32} />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              এডমিট কার্ড জেনারেটর
            </h1>
          </div>
          <p className="text-gray-600 text-lg">পরীক্ষার এডমিট কার্ড তৈরি করুন</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Selection Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Class Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="bg-blue-100 p-1 rounded">
                  <Users size={16} className="text-blue-600" />
                </div>
                শ্রেণি নির্বাচন করুন
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 lg:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-300"
              >
                <option value="">শ্রেণি নির্বাচন করুন</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    শ্রেণি {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Type Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="bg-green-100 p-1 rounded">
                  <BookOpen size={16} className="text-green-600" />
                </div>
                পরীক্ষার ধরন
              </label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full p-3 lg:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-300"
              >
                <option value="">পরীক্ষার ধরন নির্বাচন করুন</option>
                {examTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Year Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="bg-purple-100 p-1 rounded">
                  <Calendar size={16} className="text-purple-600" />
                </div>
                পরীক্ষার বছর
              </label>
              <select
                value={selectedExamYear}
                onChange={(e) => setSelectedExamYear(e.target.value)}
                className="w-full p-3 lg:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-300"
              >
                <option value="">পরীক্ষার বছর নির্বাচন করুন</option>
                {examYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedClass || !selectedExamType || !selectedExamYear}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  জেনারেট হচ্ছে...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  এডমিট কার্ড জেনারেট করুন
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {admitCards.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">জেনারেট করা এডমিট কার্ড</h2>
                <p className="text-gray-600">মোট {admitCards.length} টি এডমিট কার্ড তৈরি হয়েছে</p>
                <div className="text-sm text-gray-500 mt-1">
                  শ্রেণি: {selectedClass} | {selectedExamType} | {selectedExamYear}
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <PrinterIcon size={20} />
                প্রিন্ট করুন (PDF)
              </button>
            </div>

            {/* Student List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {admitCards.map((student, index) => (
                <div
                  key={student.id || student._id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{student.roll}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{student.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{student.section}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Print Preview (Hidden) */}
            <div ref={printRef} style={{ display: 'none' }}>
              {renderAdmitCards()}
            </div>

            {/* Preview Cards (Visible on screen) */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">প্রিভিউ</h3>
              {admitCards.slice(0, 3).map((student, index) => (
                <div
                  key={student.id || student._id}
                  className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white"
                >
                  {/* Header */}
                  <div className="text-center mb-6 border-b-2 border-blue-200 pb-4">
                    <h2 className="text-2xl font-bold text-blue-800 mb-2">
                      চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয়
                    </h2>
                    <p className="text-lg text-gray-700 font-semibold">
                      {selectedExamType} - {selectedExamYear}
                    </p>
                    <p className="border w-max mx-auto py-1 px-4 rounded-full">Admit Card</p>
                  </div>

                  {/* Content */}
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex">
                        <span className="font-semibold w-24 text-gray-700">নাম:</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 text-gray-800">
                          {student.name}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold w-24 text-gray-700">পিতার নাম:</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 text-gray-800">
                          {student.fatherName}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold w-24 text-gray-700">মাতার নাম:</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 text-gray-800">
                          {student.motherName}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold w-24 text-gray-700">শ্রেণি:</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 text-gray-800">
                          {{
                            6: 'Six',
                            7: 'Seven',
                            8: 'Eight',
                            9: 'Nine',
                            10: 'Ten',
                          }[student.dclassName] || student.dclassName}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold w-24 text-gray-700">রোল নং:</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 text-gray-800">
                          {student.roll}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold w-24 text-gray-700">শাখা:</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 text-gray-800">
                          {student.section || 'N/A'}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold w-24 text-gray-700">লিঙ্গ:</span>
                        <span className="flex-1 border-b border-dotted border-gray-400 text-gray-800">
                          {student.gender === 'Male' ? 'পুরুষ' : 'মহিলা'}
                        </span>
                      </div>
                    </div>

                    {/* Photo */}
                    <div className="w-32 text-center">
                      <img
                        src={student.image || 'https://via.placeholder.com/100x120?text=Photo'}
                        alt="Student"
                        className="w-24 h-28 border-2 border-gray-300 rounded object-cover mb-2 mx-auto"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x120?text=Photo';
                        }}
                      />
                      <p className="text-xs text-gray-600">ছবি</p>
                    </div>
                  </div>

                  {/* Signature */}
                  <div className="flex justify-end mt-8">
                    <div className="text-right">
                      <div className="w-48 border-b border-gray-400 mb-2"></div>
                      <p className="text-sm text-gray-700">প্রধান শিক্ষকের স্বাক্ষর</p>
                    </div>
                  </div>
                </div>
              ))}

              {admitCards.length > 3 && (
                <div className="text-center py-4">
                  <p className="text-gray-600">
                    আরও {admitCards.length - 3} টি কার্ড প্রিন্টে দেখা যাবে
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Loader2 size={32} className="animate-spin text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">এডমিট কার্ড তৈরি হচ্ছে...</h3>
              <p className="text-gray-600">অনুগ্রহ করে অপেক্ষা করুন</p>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading &&
          admitCards.length === 0 &&
          selectedClass &&
          selectedExamType &&
          selectedExamYear && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <Users size={32} className="text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">কোন স্টুডেন্ট পাওয়া যায়নি</h3>
                <p className="text-gray-600">নির্বাচিত শ্রেণিতে কোন সক্রিয় স্টুডেন্ট নেই</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdmitCard;
