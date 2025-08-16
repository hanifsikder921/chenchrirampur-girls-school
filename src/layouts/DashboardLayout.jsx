import React from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  FaHome,
  FaUserEdit,
  FaTasks,
  FaStar,
  FaUserShield,
  FaChevronDown,
  FaBars,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAuth from './../assets/hooks/useAuth';
import Overview from '../pages/Dashboard/Overview/Overview';
import logo from '../assets/images/logo.png';

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
        : 'text-gray-700 hover:text-blue-600 hover:translate-x-1'
    }`;

  const summaryClass =
    'flex items-center justify-between w-full gap-3 px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-xl transition-all duration-300 font-semibold text-gray-800 group';

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-semibold text-lg">Access Denied</p>
          <p className="text-gray-600 mt-2">You must be logged in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-600 font-semibold mt-4 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col bg-gray-50">
        {/* Modern Mobile Navbar */}
        <div className="navbar w-full lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="flex-none">
            <label
              htmlFor="my-drawer"
              aria-label="open sidebar"
              className="btn btn-ghost btn-circle hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FaBars className="h-5 w-5" />
            </label>
          </div>
          <div className="flex-1 px-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <div className="flex-none">
            <div className="w-10 h-10  rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                <img src={user?.photoURL || logo} alt="User Avatar" className="rounded-full" />
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 min-h-screen">
          <Outlet />
        </div>
      </div>

      {/* Professional Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="drawer-side"
      >
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        {/* Sidebar Content */}
        <div className="min-h-full w-80 bg-white shadow-2xl">
          {/* Sidebar Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 md:mt-0 mt-15 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaUserShield className="text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-xl">Admin Panel</h2>
                <p className="text-blue-100 text-sm">Management System</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-100 md:flex hidden">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
              <div className="w-10 h-10  rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {/* ============================================================================ */}
                  <img src={user?.photoURL || logo} alt="User Avatar" className="rounded-full" />
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.name || 'Admin'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {/* Overview */}
            <NavLink to="/dashboard" end className={navLinkClass}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors ">
                  <FaHome className="text-blue-600 text-sm" />
                </div>
                <span >Overview</span>
              </div>
            </NavLink>

            {/* Teacher Management */}
            <details className="group">
              <summary className={summaryClass}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FaUserEdit className="text-green-600 text-sm" />
                  </div>
                  <span>Teacher Management</span>
                </div>
                <FaChevronDown className="text-gray-400 group-hover:text-green-600 transition-all duration-300 group-open:rotate-180" />
              </summary>
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                <NavLink to="/dashboard/add-teacher" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center">
                      <span className="text-green-600 text-xs">➕</span>
                    </div>
                    <span className="text-sm">Add Teacher</span>
                  </div>
                </NavLink>
                <NavLink to="/dashboard/manage-teachers" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center">
                      <span className="text-green-600 text-xs">📋</span>
                    </div>
                    <span className="text-sm">View Teachers</span>
                  </div>
                </NavLink>
              </div>
            </details>

            {/* Student Management */}
            <details className="group">
              <summary className={summaryClass}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <FaUserEdit className="text-purple-600 text-sm" />
                  </div>
                  <span>Student Management</span>
                </div>
                <FaChevronDown className="text-gray-400 group-hover:text-purple-600 transition-all duration-300 group-open:rotate-180" />
              </summary>
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                <NavLink to="/dashboard/add-student" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                      <span className="text-purple-600 text-xs">➕</span>
                    </div>
                    <span className="text-sm">Add Student</span>
                  </div>
                </NavLink>
                <NavLink to="/dashboard/manage-students" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                      <span className="text-purple-600 text-xs">📋</span>
                    </div>
                    <span className="text-sm">View Students</span>
                  </div>
                </NavLink>
              </div>
            </details>

            {/* Result Management */}
            <details className="group">
              <summary className={summaryClass}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <FaTasks className="text-orange-600 text-sm" />
                  </div>
                  <span>Result Management</span>
                </div>
                <FaChevronDown className="text-gray-400 group-hover:text-orange-600 transition-all duration-300 group-open:rotate-180" />
              </summary>
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                <NavLink to="/dashboard/add-marks" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center">
                      <span className="text-orange-600 text-xs">➕</span>
                    </div>
                    <span className="text-sm">Add Marks</span>
                  </div>
                </NavLink>
                <NavLink to="/dashboard/view-marks" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center">
                      <span className="text-orange-600 text-xs">📊</span>
                    </div>
                    <span className="text-sm">View Marks</span>
                  </div>
                </NavLink>
              </div>
            </details>

            {/* Reports */}
            <details className="group">
              <summary className={summaryClass}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <FaStar className="text-yellow-600 text-sm" />
                  </div>
                  <span>Reports</span>
                </div>
                <FaChevronDown className="text-gray-400 group-hover:text-yellow-600 transition-all duration-300 group-open:rotate-180" />
              </summary>
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                <NavLink to="/dashboard/class-report" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-yellow-50 flex items-center justify-center">
                      <span className="text-yellow-600 text-xs">🏫</span>
                    </div>
                    <span className="text-sm">Class Report</span>
                  </div>
                </NavLink>
                <NavLink to="/dashboard/student-report" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-yellow-50 flex items-center justify-center">
                      <span className="text-yellow-600 text-xs">🧾</span>
                    </div>
                    <span className="text-sm">Student Report</span>
                  </div>
                </NavLink>
              </div>
            </details>

            {/* Settings */}
            <details className="group">
              <summary className={summaryClass}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <FaUserShield className="text-gray-600 text-sm" />
                  </div>
                  <span>Settings</span>
                </div>
                <FaChevronDown className="text-gray-400 group-hover:text-gray-600 transition-all duration-300 group-open:rotate-180" />
              </summary>
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                <NavLink to="/dashboard/manage-subjects" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">📚</span>
                    </div>
                    <span className="text-sm">Manage Subjects</span>
                  </div>
                </NavLink>
                <NavLink to="/dashboard/manage-classes" className={navLinkClass}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">🏷</span>
                    </div>
                    <span className="text-sm">Manage Classes</span>
                  </div>
                </NavLink>
              </div>
            </details>
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
            <div className="text-center text-xs text-gray-500">
              <p>© 2025 School Management System</p>
              <p className="mt-1">Version 2.0</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
