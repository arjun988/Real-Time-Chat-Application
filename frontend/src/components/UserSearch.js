import React, { useState } from 'react';
import { searchUsers } from '../services/api';
import { Search, User } from 'lucide-react';

const UserSearch = ({ token, onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await searchUsers(query, token);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 border-t border-gray-100/20">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-5 h-5 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search users"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-gray-100/10 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-200 outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500/30"
        >
          Search
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => onSelectUser(user)}
            className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-white/20 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-black">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;