import { createBrowserRouter } from 'react-router';
import MainLayout from './../layouts/MainLayout';
import Home from '../pages/Home/Home';
import AuthencationLayout from './../layouts/AuthencationLayout';
import Login from './../pages/Login/Login';
import Register from './../pages/Register/Register';
import About from '../pages/About/About';
import ContactUs from '../pages/Contact/ContactUs';
import MaintenancePage from '../pages/Maintenance/MaintenancePage';
import PrivateRoute from './../provider/PrivateRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import AddStudents from '../pages/Dashboard/Students/AddStudents';
import ViewStudents from '../pages/Dashboard/Students/ViewStudents';
import AddMarks from '../pages/Dashboard/Marks/AddMarks';
import EditStudent from './../pages/Dashboard/Students/EditStudent';
import ViewMarks from '../pages/Dashboard/Marks/ViewMarks';

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
        path: '/about',
        Component: About,
      },
      {
        path: '/contact',
        Component: ContactUs,
      },
    ],
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
        path: 'add-student',
        Component: AddStudents,
      },
      {
        path: 'manage-students',
        Component: ViewStudents,
      },
      {
        path: 'edit-student/:id',
        Component: EditStudent,
      },
      {
        path: 'add-marks',
        Component: AddMarks,
      },
      {
        path: 'view-marks',
        Component: ViewMarks,
      }
    ],
  },

  {
    path: '*',
    Component: MaintenancePage,
  },
]);

export default router;
