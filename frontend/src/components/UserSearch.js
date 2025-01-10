import React, { useState } from 'react';
import { searchUsers } from '../services/api';

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
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => onSelectUser(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
