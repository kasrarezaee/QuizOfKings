import { io } from "socket.io-client";

const socket = io('http://localhost:9000')
//when select a session , select chat
socket.emit("join", 23)
