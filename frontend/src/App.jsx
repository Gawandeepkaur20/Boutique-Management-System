import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './redux/slices/authSlice';
import { useThemeInit } from './hooks/useThemeInit';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminLayout from './components/layouts/AdminLayout';
import CustomerLayout from './components/layouts/CustomerLayout';
import WorkerLayout from './components/layouts/WorkerLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminPayments from './pages/admin/Payments';
import AdminMeasurements from './pages/admin/Measurements';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminCustomers from './pages/admin/Customers';
import AdminWorkers from './pages/admin/Workers';
import AdminInvoices from './pages/admin/Invoices';
import AdminInvoiceDetail from './pages/admin/InvoiceDetail';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerProfile from './pages/customer/Profile';
import CustomerMeasurements from './pages/customer/Measurements';
import CustomerOrders from './pages/customer/Orders';
import CustomerTrackOrder from './pages/customer/TrackOrder';
import WorkerDashboard from './pages/worker/Dashboard';
import WorkerTasks from './pages/worker/Tasks';
import FashionAdvisor from './pages/customer/FashionAdvisor';


const RoleRedirect = () => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  const routes = { admin: '/admin/dashboard', customer: '/customer/dashboard', worker: '/worker' };
  return <Navigate to={routes[user.role] || '/login'} replace />;
};

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  useThemeInit();

  useEffect(() => {
    if (user?.token) dispatch(fetchMe());
  }, [dispatch, user?.token]);

  return (
    <Routes>
      <Route path="/login" element={user ? <RoleRedirect /> : <Login />} />
      <Route path="/register" element={user ? <RoleRedirect /> : <Register />} />
      <Route path="/forgot-password" element={user ? <RoleRedirect /> : <ForgotPassword />} />
      <Route path="/reset-password/:token" element={user ? <RoleRedirect /> : <ResetPassword />} />
      <Route path="/" element={user ? <RoleRedirect /> : <Navigate to="/login" />} />

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="workers" element={<AdminWorkers />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="invoices/:id" element={<AdminInvoiceDetail />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="measurements" element={<AdminMeasurements/>} />
      </Route>

      <Route path="/customer" element={<ProtectedRoute roles={['customer']}><CustomerLayout /></ProtectedRoute>}>
        <Route index element={<CustomerDashboard />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="measurements" element={<CustomerMeasurements />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="track" element={<CustomerTrackOrder />} />
      </Route>

      <Route path="/worker" element={<ProtectedRoute roles={['worker']}><WorkerLayout /></ProtectedRoute>}>
        <Route index element={<WorkerDashboard />} />
        <Route path="tasks" element={<WorkerTasks />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
      <Route
  path="/customer"
  element={
    <ProtectedRoute roles={['customer']}>
      <CustomerLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<CustomerDashboard />} />
  <Route path="dashboard" element={<CustomerDashboard />} />
  <Route path="profile" element={<CustomerProfile />} />
  <Route path="measurements" element={<CustomerMeasurements />} />
  <Route path="orders" element={<CustomerOrders />} />
  <Route path="track" element={<CustomerTrackOrder />} />

  {/* ADD THIS */}
  <Route
    path="fashion-advisor"
    element={<FashionAdvisor />}
  />
</Route>
    </Routes>
  );
}
