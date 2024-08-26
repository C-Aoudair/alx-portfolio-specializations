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
  useEffect(async () => {
  const response = await fetch(`http://localhost:4000/connections/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const newUsers = await response.json();
    setUsers([...users, ...newUsers]);
  }
}, []);

  const handleUserSelect = async (user) => {
    const response = await fetch(
      `http://loaclhost:4000//conversation?userId1=${user.id}&userId2=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const conversationData = await response.json();
      setConversations([...conversations, conversationData]);
    } else {
      const newConversation = { ownersId: [1, user.id], messages: [] };
      setConversations([...conversations, newConversation]);
    }

    setSelectedUser(user);
  };

  return (
    <Paper sx={{ width: "30%", overflowY: "auto", marginRight: 2 }}>
      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            button
            onClick={() => handleUserSelect(user)}
            selected={selectedUser && selectedUser.id === user.id}
            sx={{
              backgroundColor:
                selectedUser && selectedUser.id === user.id
                  ? "#f0f0f0"
                  : "inherit",
            }}
          >
            <ListItemAvatar>
              <Avatar>{user.avatar}</Avatar>
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
