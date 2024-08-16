import React from 'react';
import { Box, Typography, Card, CardContent, Divider, IconButton, Rating } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileOverlay = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate(`/chat/${user.id}`);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <Card sx={{ p: 2, maxWidth: 600, width: '100%', position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', top: 10, right: 10 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ width: 80, height: 80 }} src={user.image || undefined}>
              {!user.image && user.username[0]}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 2 }}>{user.username}</Typography>
            <Rating value={user.rating} readOnly precision={0.1} sx={{ mb: 1 }} />
            <Typography variant="body2" fontWeight="bold">Skills:</Typography>
            <Box sx={{ mb: 2 }}>
              {user.skills.map((skill, index) => (
                <Typography key={index} variant="body2">
                  - {skill}
                </Typography>
              ))}
            </Box>
          </Box>
        </CardContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <IconButton color="primary" onClick={handleChat}>
            <ChatIcon />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
};

export default ProfileOverlay;
