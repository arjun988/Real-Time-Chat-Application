import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import { login } from '../services/api';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });  // Ensure 'email' is in the form data
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging in with:", formData);  // Log form data to ensure email is included
      const response = await login(formData);
      setToken(response.data.token);  // Set the token after login
      setMessage('Login successful!');
      navigate('/chat');
    } catch (error) {
      console.log(error);  // Log the error for more details
      setMessage('Error: ' + error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"  // Correct name attribute for email input
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Log In</button>
      <p>{message}</p>
    </form>
  );
};

export default Login;
