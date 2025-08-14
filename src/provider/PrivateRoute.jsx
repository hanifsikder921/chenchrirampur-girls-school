
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import Loading from '../components/Loading/Loading';
import useAuth from '../assets/hooks/useAuth';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('PrivateRoute re-rendered:', { user, loading });
  }, [user, loading]);

  if (loading) {
    return <Loading />;
  }
  if (user && user?.email) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
