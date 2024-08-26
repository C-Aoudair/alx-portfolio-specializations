import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
} from "@mui/material";

const UsersHistorySection = ({
  userId,
  users,
  setUsers,
  selectedUser,
  setSelectedUser,
  conversations,
  setConversations,
}) => {
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch(`http://localhost:4000/connections/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const newUsers = await response.json();
          setUsers((prevUsers) => [...prevUsers, ...newUsers]);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, [userId]);

  const handleUserSelect = async (user) => {
    try {
      const response = await fetch(
        `http://localhost:4000/conversation?userId1=${user.userId}&userId2=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const conversationData = await response.json();
        setConversations((prevConversations) => [
          ...prevConversations,
          conversationData,
        ]);
      } else {
        const newConversation = { ownersId: [userId, user.userId], messages: [] };
        setConversations((prevConversations) => [
          ...prevConversations,
          newConversation,
        ]);
      }

      setSelectedUser(user);
    } catch (error) {
      console.error("Error handling user select:", error);
    }
  };

  return (
    <Paper sx={{ width: "30%", overflowY: "auto", marginRight: 2 }}>
      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            button
            onClick={() => handleUserSelect(user)}
            selected={selectedUser && selectedUser.userId === user.userId}
            sx={{
              backgroundColor:
                selectedUser && selectedUser.userId === user.userId
                  ? "#f0f0f0"
                  : "inherit",
            }}
          >
            <ListItemAvatar>
              <Avatar src={user.avatar ? user.avatar : undefined}>
                {!user.avatar ? user.name[0] : null}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={user.isOnline ? "Online" : "Offline"}
              sx={{ color: user.isOnline ? "green" : "gray" }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default UsersHistorySection;
