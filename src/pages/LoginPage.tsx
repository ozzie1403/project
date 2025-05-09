import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, register, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const ok = await register(email, password);
      if (ok) {
        setSuccess('Registration successful! You can now log in.');
        setIsRegister(false);
      }
    } else {
      const ok = await login(email, password);
      if (ok) {
        navigate('/');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-2 text-center">{isRegister ? 'Register' : 'Login'}</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition"
          disabled={loading}
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
        <button
          type="button"
          className="w-full text-primary-600 underline text-sm mt-2"
          onClick={() => { setIsRegister(!isRegister); setSuccess(''); }}
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
        <div className="text-xs text-gray-400 mt-2 text-center">
          <div>Test admin: <b>admin@gmail.com</b> / <b>admin</b></div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 