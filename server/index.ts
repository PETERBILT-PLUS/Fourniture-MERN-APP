import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { server, app } from "./socket/socket.js";

// Load the .env file explicitly

import cookieParser from "cookie-parser";
import { authRouter } from "./router/auth.router.js";
import { connectToDataBase } from "./db/connection.js";
import { adminRouter } from "./router/admin.router.js";
import { categoryRouter } from './router/admin.category.router.js';
import { adminOrderRouter } from './router/admin.order.router.js';
import { orderRouter } from './router/order.router.js';
import { basketRouter } from './router/basket.router.js';


const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/auth", authRouter);
app.use("/admin-category", categoryRouter);
app.use("/admin", adminRouter);
app.use("/admin-order", adminOrderRouter);
app.use("/order", orderRouter);
app.use("/user-basket", basketRouter);

server.listen(PORT, async (): Promise<void> => {
    await connectToDataBase();
    console.log(`the server is running on port ${PORT}`);
});