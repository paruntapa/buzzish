import { Server } from 'socket.io';
import http from 'http'; // from node.js
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"] // frontend url
    },
});

export function getReceiverSocketId(userId) {
return userSocketMap[userId];
}
//store online users    
const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
    console.log(`User Connected ${socket.id}`)

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    //io.emit() -> send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Listen for typing events
    socket.on("typing", ({ receiverId, isTyping }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", {
                senderId: userId,
                isTyping,
            });
        }
    });
    
    socket.on('disconnect', () => {
    console.log(`User Disconnected ${socket.id}`)
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));  
    })
})

export { io, server, app};