import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Paper } from "@mui/material";

import UsersHistorySection from "./ChatComponents/usersHistorySection";
import ConversationSection from "./ChatComponents/conversationSection";
import MessageInputSection from "./ChatComponents/messageInputSection";

const Chat = ({ me, socket }) => {
  const [user] = useState(me);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [conversations, setConversations] = useState([]);
  const location = useLocation();

  const userId = user.id;

  useEffect(() => {
    if (location.state) {
      const { user } = location.state;
      let userExist = false;
      users.forEach((existUser) => {
        if (user.userId === existUser.userId) {
          userExist = true;
        }
      });
      if (!userExist) {
        setUsers([...users, user]);
      }
      setSelectedUser(user);
    }
  }, [location.state, userId]);

  useEffect(() => {
    const handleMessage = async (message) => {
      const sender = message.sender;
      const text = message.text;
      const userExists = users.some((user) => user.userId === parseInt(sender));
      if (userExists) {
        const updatedMessages = [
          ...conversations.filter((conversation) =>
            conversation.ownersId.includes(parseInt(sender)),
          )[0].messages,
          { text, sender },
        ];
        setConversations((prevConversations) =>
          prevConversations.map((conversation) =>
            conversation.ownersId.includes(parseInt(sender))
              ? { ...conversation, messages: updatedMessages }
              : conversation,
          ),
        );
      } else {
        const response = await fetch(`http://localhost:4000/user/${sender}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const newUser = await response.json();
          setUsers((prevUsers) => [...prevUsers, newUser]);
        }
      }
    };

    socket.on(`receiveMessage_${userId}`, handleMessage);

    return () => {
      socket.off(`receiveMessage_${userId}`, handleMessage);
    };
  }, [conversations, userId, users, socket]);

  return (
    <Box
      sx={{
        display: "flex",
        padding: 2,
        boxSizing: "border-box",
        height: "500px",
      }}
    >
      <UsersHistorySection
        userId={userId}
        users={users}
        setUsers={setUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        conversations={conversations}
        setConversations={setConversations}
      />
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
          userId={user.id}
        />
      </Paper>
    </Box>
  );
};

export default Chat;
