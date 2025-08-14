import React from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  FaHome,
  FaUserEdit,
  FaTasks,
  FaStar,
  FaUserShield,
  FaBookOpen,
  FaChalkboardTeacher,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 mt-1 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
    }`;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="navbar dark:bg-gray-800 w-full lg:hidden sticky top-0 z-10 bg-white shadow">
          <div className="flex-none">
            <label
              htmlFor="my-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 dark:text-white flex-1 px-2 font-bold">
            Dashboard
          </div>
        </div>

        {/* Page Content */}
        <div className="p-5 dark:bg-gray-700 min-h-screen">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="drawer-side"
      >
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 dark:bg-gray-800 text-base-content min-h-full w-80 p-4">
          {/* Overview */}
          <NavLink to="/dashboard" end className={navLinkClass}>
            <FaHome className="inline-block mr-2" />
            Overview
          </NavLink>

          {/* Students */}
          <details className="mt-2">
            <summary className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <FaUserEdit /> Students
            </summary>
            <ul className="pl-8">
              <li>
                <NavLink to="/dashboard/add-student" className={navLinkClass}>
                  ➕ Add Student
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manage-students" className={navLinkClass}>
                  📋 View Students
                </NavLink>
              </li>
            </ul>
          </details>

          {/* Marks */}
          <details className="mt-2">
            <summary className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <FaTasks /> Marks
            </summary>
            <ul className="pl-8">
              <li>
                <NavLink to="/dashboard/add-marks" className={navLinkClass}>
                  ➕ Add Marks
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/view-marks" className={navLinkClass}>
                  📊 View Marks
                </NavLink>
              </li>
            </ul>
          </details>

          {/* Reports */}
          <details className="mt-2">
            <summary className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <FaStar /> Reports
            </summary>
            <ul className="pl-8">
              <li>
                <NavLink to="/dashboard/class-report" className={navLinkClass}>
                  🏫 Class Report
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/student-report" className={navLinkClass}>
                  🧾 Student Report
                </NavLink>
              </li>
            </ul>
          </details>

          {/* Settings */}
          <details className="mt-2">
            <summary className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <FaUserShield /> Settings
            </summary>
            <ul className="pl-8">
              <li>
                <NavLink to="/dashboard/manage-subjects" className={navLinkClass}>
                  📚 Manage Subjects
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manage-classes" className={navLinkClass}>
                  🏷 Manage Classes
                </NavLink>
              </li>
            </ul>
          </details>
        </ul>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
