import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Mail, Lock, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      setToken(response.data.token);
      setMessage('Login successful!');
      setIsSuccess(true);
      setTimeout(() => navigate('/chat'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/90 rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4 shadow-lg">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-600">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-purple-100"
            >
              Sign in
            </button>
          </form>

          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm ${
                isSuccess 
                  ? 'bg-green-50/80 text-green-700 border border-green-100' 
                  : 'bg-red-50/80 text-red-700 border border-red-100'
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;