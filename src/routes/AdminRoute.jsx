import React, { Children } from 'react';
import { Navigate } from 'react-router';
import useAuth from '../assets/hooks/useAuth';
import useUserRole from '../assets/hooks/useUserRole';
import Loading from '../components/Loading/Loading';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loading />;
  }

  if (!user || role !== 'admin') {
    return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>;
  }

  return children;
};

export default AdminRoute;
