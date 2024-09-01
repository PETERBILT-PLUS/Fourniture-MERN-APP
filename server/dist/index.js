var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { server, app } from "./socket/socket.js";
import cors from "cors";
// Load the .env file explicitly
import cookieParser from "cookie-parser";
import { authRouter } from "./router/auth.router.js";
import { connectToDataBase } from "./db/connection.js";
import { adminRouter } from "./router/admin.router.js";
import { categoryRouter } from './router/admin.category.router.js';
import { adminOrderRouter } from './router/admin.order.router.js';
import { orderRouter } from './router/order.router.js';
import { basketRouter } from './router/basket.router.js';
import { userRouter } from './router/user.router.js';
import { messageRouter } from './router/message.router.js';
import { stateRouter } from './router/state.router.js';
const PORT = process.env.PORT || 3000;
const CLIENT = process.env.CLIENT;
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(cors({
    origin: CLIENT,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// for the auth
app.use("/auth", authRouter);
// for the checking user state
app.use("/check-state", stateRouter);
//for the message
app.use("/message", messageRouter);
// all for the admin
app.use("/admin-category", categoryRouter);
app.use("/admin", adminRouter);
app.use("/admin-order", adminOrderRouter);
// for the user
app.use("/user", userRouter);
app.use("/order", orderRouter);
app.use("/user-basket", basketRouter);
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectToDataBase();
    console.log(`the server is running on port ${PORT}`);
}));
