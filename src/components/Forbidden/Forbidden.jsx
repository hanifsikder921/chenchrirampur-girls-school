import { FaLock, FaHome } from 'react-icons/fa';
import { Link } from 'react-router';

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 mb-6">
            <FaLock className="text-3xl text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          403 Forbidden Access
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to access this resource. Please contact your administrator or
          return to the homepage.
        </p>

        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <FaHome className="mr-2" />
            Return to Homepage
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help?{' '}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
