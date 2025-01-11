import React, { useState } from 'react';
import { signup } from '../services/api';
import { User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'; // Import icons from Lucide
import { useNavigate } from 'react-router-dom'; // React Router for navigation

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

      // Redirect to login after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.error === 'Account already exists') {
        setMessage('Account already exists. Redirecting to login...');
        setIsSuccess(false);

        // Redirect to login if account exists
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Create an Account</h2>
        <p className="text-gray-600 text-center mb-4">Sign up to get started!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign Up
          </button>
        </form>

        {/* Message Section */}
        {message && (
          <div
            className={`mt-4 flex items-center gap-2 p-3 rounded-lg ${
              isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {isSuccess ? <CheckCircle className="text-green-500" /> : <AlertCircle className="text-red-500" />}
            <span>{message}</span>
          </div>
        )}

        {/* Link to Login */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
