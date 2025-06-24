import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import messageService from "./services/message.service.js";

dotenv.config();

// Create a single HTTP server instance and pass the Express app to it
const server = http.createServer(app);

// Initialize Socket.IO with the same HTTP server instance
const io = new Server(server);

// Socket.IO event handlers
io.on('connection', (socket) => {
    let roomName = "";

    socket.on("join", (name) => {
        socket.join(name);
        roomName = name;
    });

    socket.on("send message", async (message) => {
        const { session_id, sender_id, receiver_id, message_body } = message;
        await messageService.createMessage(session_id, sender_id, receiver_id, message_body);
        socket.to(roomName).emit('message', message_body);
    });

    socket.on("update message", async (message_id, message_body) => {


        await messageService.updateMessage(message_id, message_body);
        io.to(roomName).emit("update message", (message_id, message_body));
    });

    socket.on("delete message", async (message_id) => {
        await messageService.deleteMessage(message_id);
        io.to(roomName).emit('delete message', message_id);
    });
});

// Start the server on the specified port 
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
