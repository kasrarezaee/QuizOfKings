import { Button , Box, Paper, Typography, TextField, IconButton, Stack } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { text: "Hi there!", sender: "other" },
        { text: "Hi there!", sender: "other" },
        { text: "Hello! How are you?", sender: "me" }
    ]);
    const [input, setInput] = useState("");
    const handleBack = () => {
        window.history.back(); 
    }
    const handleSend = () => {
        if (input.trim()) {
            setMessages(prev => [...prev, { text: input.trim(), sender: "me" }]);
            setInput("");
        }
    }

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
                {/* Header */}
                <Box
                  sx={{
                    background: "linear-gradient(90deg, #3f51b5, #2196f3)",
                    padding: 2,
                    color: "white",
                    display: "flex",           // use flexbox
                    alignItems: "center",      // vertical center
                    gap: 2                     // spacing between items
                  }}
                >
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
                            alignSelf={msg.sender === "me" ? "flex-end" : "flex-start"}
                            bgcolor={msg.sender === "me" ? "#1976d2" : "#e0e0e0"}
                            color={msg.sender === "me" ? "white" : "black"}
                            px={2}
                            py={1}
                            borderRadius={2}
                            maxWidth="75%"
                            sx={{
                                wordWrap: "break-word",      
                                overflowWrap: "break-word",  
                                whiteSpace: "pre-wrap",      
                                overflowX: "hidden"          
                            }}
                        >
                            <Typography variant="body2">{msg.text}</Typography>
                        </Box>

                    ))}
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
                        placeholder="Type a message..."
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
        </Box>
    )
}

export default ChatPage;
