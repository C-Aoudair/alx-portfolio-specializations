import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";


const MessageInputSection = ({
  selectedUser,
  conversations,
  setConversations,
  socket,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const updatedMessages = [
        ...conversations.filter((conversation) =>
          conversation.ownersId.includes(selectedUser.id),
        )[0].messages,
        { text: newMessage, sender: 1 },
      ];
      setConversations(
        conversations.map((conversation) =>
          conversation.ownersId.includes(selectedUser.id)
            ? { ...conversation, messages: updatedMessages }
            : conversation,
        ),
      );

      socket.emit('sendMessage', {
        id: selectedUser.id,
        message: newMessage,
      });

      setNewMessage("");
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
      <IconButton color="primary" onClick={handleSendMessage}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInputSection;
