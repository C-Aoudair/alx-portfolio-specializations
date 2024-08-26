import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const MessageInputSection = ({
  selectedUser,
  conversations,
  setConversations,
  socket,
  userId,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentConv = conversations.find((conv) => (conv.ownersId.includes(selectedUser.userId)));
	    if (currentConv) {
      const updatedMessages = [
	      ...currentConv.messages,
        { text: newMessage, sender: userId },
      ];
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.ownersId.includes(selectedUser.userId)
            ? { ...conversation, messages: updatedMessages }
            : conversation
        )
      );
} else {
	      setConversations([{ownersId: [userId, selectedUser.userId],
		      messages: [{text: newMessage, sender: userId}]
	      }]);
      }
console.log(selectedUser.userId, newMessage, userId);

      socket.emit('sendMessage', {
        id: selectedUser.userId,
        message: newMessage,
      });
console.log('new message has been sended');

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
