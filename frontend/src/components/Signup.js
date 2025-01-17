import React, { useState } from 'react';
import { signup } from '../services/api';
import { User, Mail, Lock, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      setMessage(response.data.message);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.error === 'Account already exists') {
        setMessage('Account already exists. Redirecting to login...');
        setIsSuccess(false);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
        setIsSuccess(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/90 rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4 shadow-lg">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600">Join us today and get started!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 bg-white/50 backdrop-blur-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none"
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 bg-white/50 backdrop-blur-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 bg-white/50 backdrop-blur-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-purple-100"
            >
              Create Account
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
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;