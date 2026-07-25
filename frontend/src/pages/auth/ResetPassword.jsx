import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { Alert } from '@mui/material';
import api from '../../services/api';
import { showSuccess } from '../../utils/toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      const user = { _id: data._id, name: data.name, email: data.email, role: data.role, token: data.token };
      localStorage.setItem('user', JSON.stringify(user));
      showSuccess('Password updated! Redirecting...');
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <Scissors className="w-10 h-10 text-primary-600 mx-auto mb-2" />
          <h1 className="text-xl font-bold">Set New Password</h1>
        </div>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" className="input-field" placeholder="New password (min 6 chars)"
            value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          <button type="submit" className="btn-primary w-full">Update Password</button>
        </form>
        <p className="text-center mt-4 text-sm">
          <Link to="/login" className="text-primary-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
