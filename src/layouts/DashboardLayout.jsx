import React from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  FaHome,
  FaBoxOpen,
  FaUserEdit,
  FaUserShield,
  FaUserClock,
  FaTasks,
  FaStar,
} from 'react-icons/fa';



const DashboardLayout = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 mt-2 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
    }`;

  return (
    <div>
    
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col">
          {/* Mobile Navbar */}
          <div className="navbar dark:bg-gray-800 w-full lg:hidden sticky top-0 z-10 bg-white">
            <div className="flex-none">
              <label
                htmlFor="my-drawer-2"
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
            <div className="mx-2 dark:text-white flex-1 px-2 lg:hidden">Dashboard</div>
          </div>

          {/* Main Content */}
          <div className="p-5 dark:bg-gray-700 min-h-full">
            <Outlet />
          </div>
        </div>

        {/* Sidebar */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 dark:bg-gray-800 text-base-content min-h-full w-80 p-4">
            
            {/* Admin Links */}
            <div>
              <NavLink to="/dashboard" end className={navLinkClass}>
                <FaHome className="inline-block mr-2" />
                Dashboard
              </NavLink>

              <NavLink to="/dashboard/admin-profile" className={navLinkClass}>
                <FaUserShield className="inline-block mr-2" />
                Admin Profile
              </NavLink>

              <NavLink to="/dashboard/manage-donations" className={navLinkClass}>
                <FaBoxOpen className="inline-block mr-2" />
                Manage Donations
              </NavLink>

              <NavLink to="/dashboard/manage-users" className={navLinkClass}>
                <FaUserEdit className="inline-block mr-2" />
                Manage Users
              </NavLink>

              <NavLink to="/dashboard/manage-role-requests" className={navLinkClass}>
                <FaUserClock className="inline-block mr-2" />
                Manage Role Requests
              </NavLink>

              <NavLink to="/dashboard/manage-requests" className={navLinkClass}>
                <FaTasks className="inline-block mr-2" />
                Manage Requests
              </NavLink>

              <NavLink to="/dashboard/feature-donations" className={navLinkClass}>
                <FaStar className="inline-block mr-2" />
                Feature Donations
              </NavLink>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
