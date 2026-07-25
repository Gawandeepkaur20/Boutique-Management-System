import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ roles, children }) => {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    const redirect = { admin: '/admin/dashboard', customer: '/customer/dashboard', worker: '/worker' };
    return <Navigate to={redirect[user.role] || '/login'} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
