import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import { login } from '../services/api';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Initialize the navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      setToken(response.data.token);  // Set the token after login
      setMessage('Login successful!');
      
      // Logic to redirect the user
      // Here you can choose between "usersearch" or "chat" based on your app's flow
      // Example: Navigate to the 'usersearch' screen after login:
      navigate('/chat');  // Or `/chat` if you want to redirect to chat page directly
    } catch (error) {
      setMessage('Error: ' + error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
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
