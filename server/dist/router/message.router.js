import express from "express";
import { checkUser } from "../middleware/user.middleware.js";
import { getSingleMessages, sendMessage } from "../controller/message.controller.js";
export const messageRouter = express.Router();
messageRouter.get("/get-single-messages", checkUser, getSingleMessages);
messageRouter.post("/send-message", checkUser, sendMessage);
