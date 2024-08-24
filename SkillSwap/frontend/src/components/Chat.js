import React, { useState, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import io from "socket.io-client";

import UsersHistorySection from "./ChatComponents/usersHistorySection";
import ConversationSection from "./ChatComponents/conversationSection";
import MessageInputSection from "./ChatComponents/messageInputSection";

const userId = sessionStorage.getItem("userId");

const socket = io("http://localhost:3001", {
  query: {
    userId,
  },
});

const Chat = () => {
  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");

  const [conversations, setConversations] = useState([]);

  useEffect(async () => {
    socket.on(`message_${userId}`, (message) => {
      const sender = message.sender;
      const text = message.text;
      const updatedMessages = [
        ...conversations.filter((conversation) =>
          conversation.ownersId.includes(senderId),
        )[0].messages,
        { text, sender },
      ];
      setConversations(
        conversations.map((conversation) =>
          conversation.ownersId.includes(senderId)
            ? { ...conversation, messages: updatedMessages }
            : conversation,
        ),
      );
    });

    const response = await fetch(`http://localhost:4000/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const users = await response.json();
      setUsers(users);
    }

    return () => {
      socket.off(`message_${userId}`);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        padding: 2,
        boxSizing: "border-box",
        height: "500px",
      }}
    >
      {/* Users History Section */}
      <UsersHistorySection
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* Conversation Section */}
      <Paper
        sx={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <ConversationSection
          selectedUser={selectedUser}
          conversations={conversations}
        />
        <MessageInputSection
          selectedUser={selectedUser}
          conversations={conversations}
          setConversations={setConversations}
          socket={socket}
        />
      </Paper>
    </Box>
  );
};

export default Chat;
