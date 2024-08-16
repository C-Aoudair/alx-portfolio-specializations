import React, { useState } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, IconButton, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Messages = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Bob', avatar: 'B', isOnline: true, messages: [{ text: 'Hey there!', sender: 'Bob' }] },
    { id: 2, name: 'Charlie', avatar: 'C', isOnline: false, messages: [{ text: 'Hello!', sender: 'Charlie' }] }
  ]);

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, messages: [...user.messages, { text: newMessage, sender: 'Me' }] }
          : user
      );
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, messages: [...selectedUser.messages, { text: newMessage, sender: 'Me' }] });
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', padding: 2, boxSizing: 'border-box' }}>
      {/* Users History Section */}
      <Paper sx={{ width: '30%', overflowY: 'auto', marginRight: 2 }}>
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              button
              onClick={() => handleUserSelect(user)}
              selected={selectedUser.id === user.id}
              sx={{ backgroundColor: selectedUser.id === user.id ? '#f0f0f0' : 'inherit' }}
            >
              <ListItemAvatar>
                <Avatar>{user.avatar}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={user.isOnline ? 'Online' : 'Offline'}
                sx={{ color: user.isOnline ? 'green' : 'gray' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Conversation Section */}
      <Paper sx={{ width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 2 }}>
        <Box sx={{ overflowY: 'auto', flexGrow: 1, marginBottom: 2 }}>
          {selectedUser.messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'Me' ? 'flex-end' : 'flex-start',
                alignItems: 'center',
                marginBottom: 1,
              }}
            >
              {message.sender !== 'Me' && <Avatar sx={{ marginRight: 1 }}>{selectedUser.avatar}</Avatar>}
              <Paper
                sx={{
                  padding: 1,
                  borderRadius: 2,
                  maxWidth: '60%',
                  backgroundColor: message.sender === 'Me' ? '#dcf8c6' : '#ffffff',
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
              </Paper>
              {message.sender === 'Me' && <Avatar sx={{ marginLeft: 1 }}>Me</Avatar>}
            </Box>
          ))}
        </Box>

        {/* Input Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Messages;
