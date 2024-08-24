import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const UserSection = ({ user }) => {
	console.log(user)
  const [username, setUsername] = useState(user.username);
console.log(username);
  const [email, setEmail] = useState(user.email);
  const [rating] = useState(user.rating || 4.5);
  const [profileImage] = useState(user.profileImage);

  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }} src={profileImage}>
            {profileImage ? null : username.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4">{username}</Typography>
            <Rating value={rating} readOnly precision={0.5} />
          </Box>
          <IconButton
            color="primary"
            onClick={handleOpenSettings}
            sx={{ ml: "auto" }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </CardContent>

      {/* Settings and Edit Profile Dialog */}
      <Dialog open={openSettings} onClose={handleCloseSettings}>
        <DialogTitle>Settings & Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCloseSettings}
            color="primary"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UserSection;
