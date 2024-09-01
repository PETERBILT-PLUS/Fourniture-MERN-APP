import express from "express";
import { getUserOrders, makeOrder } from "../controller/order.controller.js";
import { checkUser } from "../middleware/user.middleware.js";
export const orderRouter = express.Router();
orderRouter.get("/get-orders", checkUser, getUserOrders);
orderRouter.post("/create-order", checkUser, makeOrder);
