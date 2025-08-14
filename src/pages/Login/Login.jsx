import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../assets/context/AuthContext';

const Login = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const from = location.state?.from?.pathname || '/dashboard';
  const onSubmit = async (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const { email, password } = data;

    Swal.fire({
      title: 'Logging In...',
      text: 'Please wait.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await signIn(email, password);
      Swal.fire('Success', 'Login successfully', 'success').then(() => {
        navigate(from, { replace: true });
        setIsLoading(false);
      });
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center ">
      <div className="w-full max-w-md">
        <div className="bg-white shadow  rounded-2xl p-8 ">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaLock className="w-8 h-8 text-white" />
            </div>
            <h1 className="md:text-3xl text-2xl font-bold text-green-800">Login To Your Account</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('email', { required: true })}
                  className="w-full pl-10 pr-4 py-3 border focus:outline outline-green-800 border-gray-300 rounded-xl "
                  placeholder="Enter your institution email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">Email is required.</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: true })}
                  className="w-full pl-10 pr-10 py-3 border focus:outline outline-green-800 border-gray-300 rounded-xl"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">Password is required.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 hover:bg-green-700  text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Logging In...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
