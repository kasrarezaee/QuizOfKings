// Using ES Modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import messageService from './services/message.service.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {

    let roomName = ""

    socket.on("join", (name) => {
        socket.join(name)
        roomName = name
        //socket.broadcast.to(name).emit('message', `${socket.id} joined to room ${name}`)
    })

    socket.on("send message", async (message) => {
        const { sender_id, receiver_id, message_body } = message
        await messageService.createMessage(sender_id, receiver_id, message_body)
        socket.to(roomName).emit('message', message_body)
    })


    socket.on("update message", async (message_id, message_body) => {
        await messageService.updateMessage(message_id, message_body)
        io.to(roomName).emit("update message", (message_id, message_body))
    })

    socket.on("delete message", async (message_id) => {
        await messageService.deleteMessage(message_id)
        io.to(roomName).emit('delete message', message_id)
    })

});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});