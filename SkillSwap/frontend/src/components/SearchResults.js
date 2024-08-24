import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Grid,
  IconButton,
  Rating,
  Divider,
  Avatar,
  Skeleton,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProfileOverlay from "./ProfileOverlay";

const SearchResults = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchQurey = location.state.searchQuery;

  fetch(`http://localhost:8000/api/search?query=${searchQurey}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
	    console.log(data);
	    console.log(data.users);
      setUsers(data.users);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  const handleChat = (userId) => {
    navigate("/chat/");
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
  };

  const handleCloseOverlay = () => {
    setSelectedUser(null);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {(loading ? Array.from(new Array(6)) : users).map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} mx='auto'>
            {user ? (
              <Card
                sx={{
		  height: 350,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{ width: 80, height: 80 }}
                    src={user.profileimage_url || undefined}
                  >
                    {!user.profileimage_url && user.username[0]}
                  </Avatar>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">{user.username}</Typography>
                    <Rating
                      value={user.rating || 4.5}
                      readOnly
                      precision={0.1}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2">Skills:</Typography>
                    <Box sx={{ mb: 2, height: 75, overflow: 'auto' }}>
                      {user.skills.map((skill, index) => (
                        <Typography key={index} variant="body2">
                          - {skill.name}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                  }}
                >
                  <IconButton
                    color="primary"
                    sx={{ flex: 1, mr: 1 }}
                    onClick={() => handleChat(user.id)}
                  >
                    <ChatIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    sx={{ flex: 1 }}
                    onClick={() => handleViewProfile(user)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              </Card>
            ) : (
              <Card
                sx={{
		  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
		}}
              >
                <Skeleton
                  variant="circular"
                  width={80}
                  height={80}
                  animation="wave"
                />
                <Skeleton variant="text" width="80%" animation="wave" />
                <Skeleton variant="text" width="60%" animation="wave" />
                <Skeleton variant="text" width="40%" animation="wave" />
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    px: 4,
                  }}
                >
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    animation="wave"
                  />
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    animation="wave"
                  />
                </Box>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>
      {selectedUser && (
        <ProfileOverlay user={selectedUser} onClose={handleCloseOverlay} />
      )}
    </Box>
  );
};

export default SearchResults;
