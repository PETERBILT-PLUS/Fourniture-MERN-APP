import dotenv from 'dotenv';
dotenv.config();
import http from "http";
import express, { Express } from "express";
import { Server } from "socket.io";

export const app: Express = express();

const CLIENT = process.env.CLIENT as string;

if (!CLIENT) {
    throw new Error("The CLIENT variable is not availabe please check the .env file");
}

export const server = http.createServer(app);

app.use(express.json({ limit: "1mb" }))

export const io = new Server(server, {
    cors: {
        origin: CLIENT,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

const userSocketId: { [key: string]: string } = {};

export const getUserSocketId = (userId: string): string => {
    return userSocketId[userId];
}

io.on("connection", (socket: any): void => {
    console.log("a user is entred", socket.id);
    const userId: string = socket.handshake.query.userId as string;
    console.log(userId);

    if (userId != "undefined") {
        userSocketId[userId] = socket.id;
    }
    io.emit("onlineUsers", Object.keys(userSocketId));

    socket.on("disconnect", (): void => {
        console.log("a user is disconnected", userId);
        delete userSocketId[userId];
        io.emit("onlineUsers", Object.keys(userSocketId));
    })
});