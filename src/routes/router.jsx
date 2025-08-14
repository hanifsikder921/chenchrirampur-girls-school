import { createBrowserRouter } from 'react-router';
import MainLayout from './../layouts/MainLayout';
import Home from '../pages/Home/Home';
import AuthencationLayout from './../layouts/AuthencationLayout';
import Login from './../pages/Login/Login';
import Register from './../pages/Register/Register';
import About from '../pages/About/About';
import ContactUs from '../pages/Contact/ContactUs';
import MaintenancePage from '../pages/Maintenance/MaintenancePage';

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
    path: '*',
    Component:MaintenancePage
  }
]);

export default router;
