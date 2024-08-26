import React from "react";
import { Box, Avatar, Typography, Paper } from "@mui/material";

const ConversationSection = ({ selectedUser, conversations }) => {
  const conversation = conversations.find((conv) =>
    conv.ownersId.includes(selectedUser.userId)
  );

  if (!selectedUser || !conversation || conversation.messages.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Typography variant="h5">No messages yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowY: "auto", flexGrow: 1, marginBottom: 2 }}>
      {conversation.messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent:
              parseInt(message.sender) !== selectedUser.userId
                ? "flex-end"
                : "flex-start",
            alignItems: "center",
            marginBottom: 1,
          }}
        >
          {parseInt(message.sender) === selectedUser.userId && (
            <Avatar
              sx={{ marginRight: 1 }}
              src={selectedUser.avatar ? selectedUser.avatar : undefined}
            >
              {!selectedUser.avatar ? selectedUser.name[0] : null}
            </Avatar>
          )}
          <Paper
            sx={{
              padding: 1,
              borderRadius: 2,
              maxWidth: "60%",
              backgroundColor:
                parseInt(message.sender) !== selectedUser.userId ? "#dcf8c6" : "#ffffff",
            }}
          >
            <Typography variant="body1">{message.text}</Typography>
          </Paper>
          {parseInt(message.sender) !== selectedUser.userId && (
            <Avatar sx={{ marginLeft: 1 }}>Me</Avatar>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ConversationSection;
