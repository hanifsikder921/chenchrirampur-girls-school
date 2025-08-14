import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
// import Loading from '../components/Loading/Loading';
import { AuthContext } from '../assets/context/AuthContext';


const PrivateRoute = ({ children }) => {
  const { user} = useContext(AuthContext);
  const location = useLocation();


  if (user && user?.email) {
    return children;
  }
  return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
