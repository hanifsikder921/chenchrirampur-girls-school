import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../assets/hooks/useAxios';
import { FaPrint, FaSpinner, FaDownload } from 'react-icons/fa';

const SeatPlan = () => {
  const axios = useAxios();
  const [selectedClass, setSelectedClass] = useState('');
  const [examType, setExamType] = useState('');
  const [examYear, setExamYear] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState([]);

  // Fetch students based on selected class
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students', selectedClass],
    queryFn: async () => {
      if (!selectedClass) return [];
      const response = await axios.get(`/students?class=${selectedClass}&status=active`);
      return response.data.data || [];
    },
    enabled: !!selectedClass,
  });

  // Class options
  const classOptions = ['6', '7', '8', '9', '10'];

  // Exam type options
  const examTypeOptions = ['Test Exam', 'Half Yearly', 'Yearly', 'Pre Test'];

  // Year options
  const yearOptions = ['2025', '2026', '2027', '2028', '2029', '2030'];

  // Handle generate admit cards
  const handleGenerateAdmitCards = () => {
    if (!selectedClass || !examType || !examYear) {
      alert('Please select class, exam type, and exam year');
      return;
    }

    setIsGenerating(true);

    // Simulate loading for better UX
    setTimeout(() => {
      setGeneratedCards(students);
      setIsGenerating(false);
    }, 1500);
  };

  // Handle print all admit cards
  const handlePrintAll = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admit Cards - ${examType} ${examYear}</title>
        <meta charset="utf-8">
        <style>
          @media print {
           @page {
            size: A4 portrait;
            margin: 10mm;
            }
            body, html {
             margin: 0 !important;
            padding: 0 !important;
            background: white !important;
  }
            
            .no-print {
              display: none !important;
            }

            #admit-cards-container {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 6mm !important; 
  justify-items: center !important;
  align-items: start !important;
}


  .admit-card {
    display: inline-block !important;
    width: 90mm !important; 
    height: 55mm !important;
    margin-bottom: 10mm !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    border: 1px solid #000 !important;
    border-radius: 5px !important;
    padding: 5mm !important;
    box-sizing: border-box !important;
  }


           
            
            .school-header {
              text-align: center !important;
              margin-bottom: 2mm !important;
              padding-bottom: 2mm !important;
              border-bottom: 1px solid #000 !important;
            }
            
            .school-name {
              font-size: 15px !important;
              font-weight: bold !important;
              color: #166534 !important;
              margin-bottom: 1mm !important;
            }
            
            .exam-info {
              font-size: 12px !important;
              font-weight: bold !important;
              color: #4b5563 !important;
              margin-bottom: 1mm !important;
            }
            
            .seat-label {
              font-size: 9px !important;
              font-weight: bold !important;
              border: 0.5px solid #000 !important;
              padding: 1mm 3mm !important;
              border-radius: 10mm !important;
              display: inline-block !important;
              margin: 1mm 0 !important;
            }
            
            .student-info {
              display: flex !important;
              justify-content: space-between !important;
              align-items: flex-start !important;
              margin-top: 2mm !important;
            }
            
            .info-text {
              font-size: 14px !important;
              font-weight: bold !important;
              line-height: 1.3 !important;
            }
            
            .student-photo {
              width: 18mm !important;
              height: 18mm !important;
              border: 1px solid #000 !important;
              overflow: hidden !important;
            }
            
            .student-photo img {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
            }
          }
        </style>
      </head>
      <body>
        <div id="admit-cards-container">
          ${document.getElementById('admit-cards-container').innerHTML}
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.print();
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Seat Plan Generator</h1>

      {/* Selection Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Exam Type</option>
              {examTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Year Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Year</label>
            <select
              value={examYear}
              onChange={(e) => setExamYear(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateAdmitCards}
          disabled={isGenerating || !selectedClass || !examType || !examYear}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <FaDownload className="mr-2" />
              Generate Seat Cards
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {generatedCards.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6 no-print">
            <h2 className="text-xl font-semibold text-gray-800">
              Generated Seat Cards ({generatedCards.length} Students)
            </h2>
            <button
              onClick={handlePrintAll}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
            >
              <FaPrint className="mr-2" />
              Print All Cards
            </button>
          </div>

          <div id="admit-cards-container" className="grid grid-cols-1 md:grid-cols-3  gap-4 ">
            {generatedCards.map((student, index) => (
              <AdmitCardItem
                key={student._id || index}
                student={student}
                examType={examType}
                examYear={examYear}
              />
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

// Individual Admit Card Component
const AdmitCardItem = ({ student, examType, examYear }) => {
  return (
    <div className="admit-card border border-gray-300 rounded-lg p-4 bg-white shadow-md">
      {/* School Header */}
      <div className="school-header text-center mb-3 border-b-2 border-gray-200 pb-2">
        <h2 className="school-name text-lg font-bold text-green-800">
          Chenchri Rampur Girls High School
        </h2>
        <p className="exam-info text-gray-600 text-sm">
          {examType} Exam : {examYear}
        </p>
        <p className="seat-label text-gray-600 text-sm font-bold">Seat</p>
      </div>

      <div className="student-info flex justify-between items-start">
        <div className="info-text text-sm">
          <div className="mb-1">
            <span className="font-semibold">Name:</span> {student.name}
          </div>
          <div className="mb-1">
            <span className="font-semibold">Class:</span> {student.dclassName}
          </div>
          <div className="mb-1">
            <span className="font-semibold">Roll:</span> {student.roll}
          </div>
          {student.section && (
            <div className="mb-1">
              <span className="font-semibold">Section:</span> {student.section}
            </div>
          )}
        </div>
        <div className="student-photo w-16 h-16 border-2 border-gray-300 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={student.image || '/default-avatar.png'}
            alt={student.name}
          />
        </div>
      </div>

   
    </div>
  );
};

export default SeatPlan;
