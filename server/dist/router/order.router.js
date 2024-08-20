import express from "express";
import { makeOrder } from "../controller/order.controller.js";
import { checkUser } from "../middleware/user.middleware.js";
export const orderRouter = express.Router();
orderRouter.post("/create-order", checkUser, makeOrder);
