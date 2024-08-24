import React, { useState } from "react";
import { Box, Avatar, Typography, Paper } from "@mui/material";

const ConversationSection = ({ selectedUser, conversations }) => {
  return (
    <Box sx={{ overflowY: "auto", flexGrow: 1, marginBottom: 2 }}>
      {selectedUser &&
        conversations
          .filter((conversation) =>
            conversation.ownersId.includes(selectedUser.id),
          )[0]
          .messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender !== selectedUser.id
                    ? "flex-end"
                    : "flex-start",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              {message.sender === selectedUser.id && (
                <Avatar sx={{ marginRight: 1 }}>{selectedUser.avatar}</Avatar>
              )}
              <Paper
                sx={{
                  padding: 1,
                  borderRadius: 2,
                  maxWidth: "60%",
                  backgroundColor:
                    message.sender !== selectedUser.id ? "#dcf8c6" : "#ffffff",
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
              </Paper>
              {message.sender !== selectedUser.id && (
                <Avatar sx={{ marginLeft: 1 }}>Me</Avatar>
              )}
            </Box>
          ))}
    </Box>
  );
};

export default ConversationSection;
