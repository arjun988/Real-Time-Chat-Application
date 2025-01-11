import React, { useState } from 'react';
import { searchUsers } from '../services/api';
import { Search } from 'lucide-react';

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
    <div className="p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleSearch}
          className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => onSelectUser(user)}
            className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 cursor-pointer"
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
