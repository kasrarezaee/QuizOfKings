import {
  Button, Box, Paper, Typography, TextField, IconButton, Menu, MenuItem
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { apiCall } from "../services/apiClient";
import { API_CONFIG, ROUTES } from "../config/settings";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:9000");

const ChatPage = () => {
  const { accessToken, userInfo } = useAuth();
  const { sessionId, senderId, receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const scrollRef = useRef();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuMessage, setMenuMessage] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.MESSAGE + "session/" + sessionId, 'GET', accessToken, null);
      const result = await response.json();
      setMessages(result);
    };
    fetchMessages();
  }, [sessionId]);

  useEffect(() => {
    socket.emit("join", sessionId);

    socket.on("message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("update message", (data) => {
      const {message_id, message_body} = data
        console.log("updata message")
        console.log(message_body)
        setMessages(prev =>
        prev.map(m =>
          m.message_id === message_id ? { ...m, message_body: message_body } : m
        )
      );
    });

    socket.on("delete message", (msg_id) => {
      setMessages(prev => prev.filter(m => m.message_id !== msg_id));
    });

    return () => {
      socket.off("message");
      socket.off("update message");
      socket.off("delete message");
    };
  }, [sessionId]);

  const handleSend = () => {
    if (input.trim()) {
      if (editingMessageId) {
        socket.emit("update message",editingMessageId, input.trim() );
        setEditingMessageId(null);
      } else {
        const messageData = {
          session_id: sessionId,
          message_body: input.trim(),
          receiver_id: receiverId,
          sender_id: senderId,
        };   
        socket.emit("send message", messageData);
      }
      setInput("");
    }
  };

  const handleContextMenu = (event, message) => {
    event.preventDefault();
    if (message.sender_id !== userInfo.user_id) return;
    setAnchorEl(event.currentTarget);
    setMenuMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuMessage(null);
  };

  const handleEdit = () => {
    if (menuMessage) {
      setInput(menuMessage.message_body);
      setEditingMessageId(menuMessage.message_id);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuMessage) {
      socket.emit("delete message", menuMessage.message_id);
    }
    handleMenuClose();
  };

  const handleBack = () => window.history.back();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="97vh"
      bgcolor="rgba(54, 140, 238, 0.36)"
    >
      <Paper
        elevation={12}
        sx={{
          width: '90%',
          height: 600,
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          background: "white"
        }}
      >
        <Box sx={{
          background: "linear-gradient(90deg, #3f51b5, #2196f3)",
          padding: 2,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2
        }}>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "#ddd",
                backgroundColor: "rgba(255,255,255,0.1)"
              }
            }}
          >
            Back
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Chat
          </Typography>
        </Box>

        <Box
          flex={1}
          p={2}
          sx={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            bgcolor: "#f5f5f5",
            backgroundImage: "url('/images/chat_background.jpeg')"
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              onContextMenu={(e) => handleContextMenu(e, msg)}
              alignSelf={msg.sender_id === userInfo.user_id ? "flex-end" : "flex-start"}
              bgcolor={msg.sender_id === userInfo.user_id ? "#1976d2" : "#e0e0e0"}
              color={msg.sender_id === userInfo.user_id ? "white" : "black"}
              px={2}
              py={1}
              borderRadius={2}
              maxWidth="75%"
              sx={{ wordWrap: "break-word", whiteSpace: "pre-wrap", cursor: msg.sender_id === userInfo.user_id ? "context-menu" : "default" }}
            >
              <Typography variant="body2">{msg.message_body}</Typography>
            </Box>
          ))}
          <div ref={scrollRef} />
        </Box>

        <Box
          p={1}
          display="flex"
          alignItems="center"
          borderTop="1px solid #ccc"
          bgcolor="#fafafa"
        >
          <TextField
            fullWidth
            size="small"
            placeholder={editingMessageId ? "Edit your message..." : "Type a message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default ChatPage;
