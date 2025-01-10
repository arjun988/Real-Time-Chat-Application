import React, { useState } from 'react';
import UserSearch from '../components/UserSearch';
import ChatWindow from '../components/ChatWindow';

const ChatPage = ({ token, userId }) => {
  const [contact, setContact] = useState(null);

  return (
    <div>
      {contact ? (
        <ChatWindow token={token} userId={userId} contact={contact} />
      ) : (
        <UserSearch token={token} onSelectUser={setContact} />
      )}
    </div>
  );
};

export default ChatPage;
