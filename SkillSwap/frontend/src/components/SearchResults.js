import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, Grid, IconButton, Rating, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ProfileOverlay from './ProfileOverlay';  // Import the ProfileOverlay component
import { Avatar } from '@mui/material';

const SearchResults = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, username: 'Alice', rating: 4.7, skills: ['JavaScript', 'React', 'Node.js'], image: '' },
    { id: 2, username: 'Bob', rating: 4.5, skills: ['Python', 'Django', 'Machine Learning'], image: '' },
    { id: 3, username: 'Charlie', rating: 4.9, skills: ['Java', 'Spring', 'AWS'], image: '' },
  ];

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user); // Set selected user to trigger ProfileOverlay
  };

  const handleCloseOverlay = () => {
    setSelectedUser(null); // Clear selected user to close ProfileOverlay
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ width: 80, height: 80 }} src={user.image || undefined}>
                  {!user.image && user.username[0]}
                </Avatar>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">{user.username}</Typography>
                  <Rating value={user.rating} readOnly precision={0.1} sx={{ mb: 1 }} />
                  <Typography variant="body2">Skills:</Typography>
                  <Box sx={{ mb: 2 }}>
                    {user.skills.map((skill, index) => (
                      <Typography key={index} variant="body2">
                        - {skill}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                <IconButton color="primary" sx={{ flex: 1, mr: 1 }} onClick={() => handleChat(user.id)}>
                  <ChatIcon />
                </IconButton>
                <IconButton color="secondary" sx={{ flex: 1 }} onClick={() => handleViewProfile(user)}>
                  <VisibilityIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedUser && <ProfileOverlay user={selectedUser} onClose={handleCloseOverlay} />}
    </Box>
  );
};

export default SearchResults;
