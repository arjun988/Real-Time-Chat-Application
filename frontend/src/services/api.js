import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const signup = (userData) => axios.post(`${API_URL}/auth/signup`, userData);
export const login = (userData) => axios.post(`${API_URL}/auth/login`, userData);
export const searchUsers = (query, token) =>
  axios.get(`${API_URL}/users/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { query },
  });
export const fetchChatHistory = (userId, contactId, token) =>
  axios.get(`${API_URL}/chats/${userId}/${contactId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
