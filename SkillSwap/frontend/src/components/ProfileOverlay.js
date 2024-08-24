import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
  Rating,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfileOverlay = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate("/chat");
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 70,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(255, 255, 255)',
        zIndex: 99,
      }}
    >

    <Box sx={{ 
	    p: 4,
            maxWidth: "800px",
	    margin: "auto",
    }}>
      {/* close button */}
      <IconButton
        sx={{ position: "absolute", top: 5, right: 5 }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      {/* Profile Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 3 }}
              src={user.profileimage_url || undefined}
            >
              {user.profileimage_url ? null : user.username.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4">{user.username}</Typography>
              <Rating value={user.rating || 4.5} readOnly precision={0.5} />
            </Box>
            <IconButton
              color="primary"
              sx={{ flex: 1, mr: 1 }}
              onClick={() => handleChat}
            >
              <ChatIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Skills</Typography>
          </Box>
          <Grid container spacing={1}>
            {user.skills.map((skill) => (
              <Grid item key={skill.id}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="body1">{skill.name}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Experience</Typography>
          </Box>
          <List>
            {user.experiences.map((exp) => (
              <React.Fragment key={exp.id}>
                <ListItem>
                  <ListItemText
                    primary={exp.title}
                    secondary={`${exp.description} (${exp.years})`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
	  </Box>
  );
};

export default ProfileOverlay;
