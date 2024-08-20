import dotenv from 'dotenv';
dotenv.config();
import http from "http";
import express from "express";
import { Server } from "socket.io";
export const app = express();
const CLIENT = process.env.CLIENT;
if (!CLIENT) {
    throw new Error("The CLIENT variable is not availabe please check the .env file");
}
export const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: CLIENT,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});
const userSocketId = {};
export const getUserSocketId = (userId) => {
    return userSocketId[userId];
};
io.on("connection", (socket) => {
    console.log("a user is entred", socket.id);
    const userId = socket.handshake.query.userId;
    console.log(userId);
    if (userId != "undefined") {
        userSocketId[userId] = socket.id;
    }
    io.emit("onlineUsers", Object.keys(userSocketId));
    socket.on("disconnect", () => {
        console.log("a user is disconnected", userId);
        delete userSocketId[userId];
        io.emit("onlineUsers", Object.keys(userSocketId));
    });
});
