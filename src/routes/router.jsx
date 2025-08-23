import { createBrowserRouter } from 'react-router';
import MainLayout from './../layouts/MainLayout';
import Home from '../pages/Home/Home';
import AuthencationLayout from './../layouts/AuthencationLayout';
import Login from './../pages/Login/Login';
import Register from './../pages/Register/Register';
import ContactUs from '../pages/Contact/ContactUs';
import MaintenancePage from '../pages/Maintenance/MaintenancePage';
import PrivateRoute from './../provider/PrivateRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import AddStudents from '../pages/Dashboard/Students/AddStudents';
import ViewStudents from '../pages/Dashboard/Students/ViewStudents';
import AddMarks from '../pages/Dashboard/Marks/AddMarks';
import EditStudent from './../pages/Dashboard/Students/EditStudent';
import ViewMarks from '../pages/Dashboard/Marks/ViewMarks';
import EditMarks from '../pages/Dashboard/Marks/EditMarks';
import AddTeacher from '../pages/Dashboard/Teacher/AddTeacher';
import ViewTeacher from '../pages/Dashboard/Teacher/ViewTeacher';
import EditTeacher from '../pages/Dashboard/Teacher/EditTeacher';
import StaffManagement from './../pages/MenuPage/StaffManagement';
import AdmitCard from '../pages/Dashboard/Marks/AdmitCard';
import ResultStatistic from '../pages/Dashboard/Marks/ResultStatistic';
import SeatPlan from '../pages/Dashboard/Marks/SeatPlan';
import Overview from '../pages/Dashboard/Overview/Overview';
import StudentMigration from '../pages/Dashboard/Students/StudentMigration';
import AdmissionForm from '../components/Admission/AdmissionForm';
import AboutUs from '../components/Campus/AboutUs';
import Mission from '../components/Campus/Mission';
import AdmissionProcess from '../components/Admission/AdmissionProcess';
import ViewAdmission from '../pages/Dashboard/Admission/ViewAdmission';
import SixToTen from '../components/ClassAndSubject/SixToTen';
import ClassRutin from '../components/ClassAndSubject/ClassRutin';
import SchoolResult from '../components/ExamResult/SchoolResult';
import BoardResult from '../components/ExamResult/BoardResult';
import ComputerLab from '../components/ResourceSchool/ComputerLab';
import Library from '../components/ResourceSchool/Library';
import Laboratory from '../components/ResourceSchool/Laboratory';
import SchoolInfo from '../pages/Dashboard/Setting/SchoolInfo';
import AcademicCard from '../pages/Dashboard/Marks/AcademicCard';
import MediaManagement from '../pages/Dashboard/Setting/MediaManagement';
import NoticePage from '../components/NoticeBord/NoticePage';
import PublicNotice from '../components/NoticeBord/PublicNotice';
import StudentProfile from '../components/StudentCorner/StudentProfile';
import ClassReport from '../components/ReportPage/ClassReport';
import StudentReport from '../components/ReportPage/StudentReport';
import Forbidden from '../components/Forbidden/Forbidden';
import SubjectMangement from '../pages/Dashboard/Setting/SubjectMangement';
import TeachirProfile from '../pages/Dashboard/TeachirProfile';
import AssignMark from '../pages/Dashboard/TeacherRole/AssignMark';
import AdminRoute from './AdminRoute';


const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/aboutus',
        Component: AboutUs,
      },
      {
        path: '/mission',
        Component: Mission,
      },
      {
        path: '/contact',
        Component: ContactUs,
      },
      {
        path: '/staff',
        Component: StaffManagement,
      },
      {
        path: '/admissionform',
        Component: AdmissionForm,
      },
      {
        path: '/admissionprocess',
        Component: AdmissionProcess,
      },
      {
        path: '/sixtoTen',
        Component: SixToTen,
      },
      {
        path: '/class-routine',
        Component: ClassRutin,
      },
      {
        path: '/school-result',
        Component: SchoolResult,
      },
      {
        path: '/board-result',
        Component: BoardResult,
      },
      {
        path: '/computer-lab',
        Component: ComputerLab,
      },
      {
        path: '/library',
        Component: Library,
      },
      {
        path: '/laboratory',
        Component: Laboratory,
      },
      {
        path: '/public-notice',
        Component: PublicNotice,
      },
      {
        path: 'student-profile',
        Component: StudentProfile,
      },
    ],
  },
  {
    path: 'forbidden',
    Component: Forbidden,
  },

  {
    path: '/',
    Component: AuthencationLayout,
    children: [
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
    ],
  },
  {
    path: '/dashboard',
    Component: () => (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'overview',
        element: (
          <AdminRoute>
            <Overview />
          </AdminRoute>
        ),
     
      },
      {
        path: 'add-student',
        element:<AdminRoute>
          <AddStudents/>
        </AdminRoute>
        
      },
      {
        path: 'manage-students',
        element:<AdminRoute>
          <ViewStudents/>
        </AdminRoute>
        // Component: ViewStudents,
      },
      {
        path: 'edit-student/:id',
        element:<AdminRoute>
          <EditStudent/>
        </AdminRoute>
        // Component: EditStudent,
      },
      {
        path: 'student-migration',
        element:<AdminRoute>
          <StudentMigration/>
        </AdminRoute>
        // Component: StudentMigration,
      },
      {
        path: 'add-marks',
        element:<AdminRoute>
          <AddMarks/>
        </AdminRoute>
        // Component: AddMarks,
      },
      {
        path: 'view-marks',
        element:<AdminRoute>
          <ViewMarks/>
        </AdminRoute>
        // Component: ViewMarks,
      },
      {
        path: 'edit-marks/:id',
        element:<AdminRoute>
          <EditMarks/>
        </AdminRoute>
        // Component: EditMarks,
      },
      {
        path: 'add-teacher',
        element:<AdminRoute>
          <AddTeacher/>
        </AdminRoute>
        // Component: AddTeacher,
      },
      {
        path: 'manage-teachers',
        element:<AdminRoute>
          <ViewTeacher/>
        </AdminRoute>
        // Component: ViewTeacher,
      },
      {
        path: 'edit-teacher/:id',
        element:<AdminRoute>
          <EditTeacher/>
        </AdminRoute>
        // Component: EditTeacher,
      },
      {
        path: 'admit-card',
        element:<AdminRoute>
          <AdmitCard/>
        </AdminRoute>
        // Component: AdmitCard,
      },
      {
        path: 'result-statistic',
        element:<AdminRoute>
          <ResultStatistic/>
        </AdminRoute>
        // Component: ResultStatistic,
      },
      {
        path: 'seat-plan',
        element:<AdminRoute>
          <SeatPlan/>
        </AdminRoute>
        // Component: SeatPlan,
      },
      {
        path: 'acdemic-card',
        element:<AdminRoute>
          <AcademicCard/>
        </AdminRoute>
        // Component: AcademicCard,
      },
      {
        path: 'view-admissions',
        element:<AdminRoute>
          <ViewAdmission/>
        </AdminRoute>
        // Component: ViewAdmission,
      },
      {
        path: 'school-info',
        element:<AdminRoute>
          <SchoolInfo/>
        </AdminRoute>
        // Component: SchoolInfo,
      },
      {
        path: 'media-management',
        element:<AdminRoute>
          <MediaManagement/>
        </AdminRoute>
        // Component: MediaManagement,
      },
      {
        path: 'notice-management',
        element:<AdminRoute>
          <NoticePage/>
        </AdminRoute>
        // Component: NoticePage,
      },
      {
        path: 'class-report',
        element:<AdminRoute>
          <ClassReport/>
        </AdminRoute>
        // Component: ClassReport,
      },
      {
        path: 'student-report',
        element:<AdminRoute>
          <StudentReport/>
        </AdminRoute>
        // Component: StudentReport,
      },
      {
        path: 'subject-management',
        element:<AdminRoute>
          <SubjectMangement/>
        </AdminRoute>
        // Component: SubjectMangement,
      },
      {
        path: 'techer-profile',
        Component: TeachirProfile,
      },
      {
        path: 'assign-mark',
        Component: AssignMark,
      },
    ],
  },

  {
    path: '*',
    Component: MaintenancePage,
  },
]);

export default router;
