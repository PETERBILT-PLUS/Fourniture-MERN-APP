import express from "express";
import { editProfile, getStoreDetails, sendMessageToAdmin, viewProfile } from "../controller/user.controller.js";
import { checkUser } from "../middleware/user.middleware.js";
import { getSingleProduct } from "../controller/admin.controller.js";

export const userRouter = express.Router();


userRouter.get("/get-single-product", getSingleProduct);
userRouter.get("/view-profile", checkUser, viewProfile);
userRouter.get("/get-store-details", getStoreDetails);
userRouter.post("/send-message-to-admin", sendMessageToAdmin);
userRouter.post("/edit-profile", checkUser, editProfile);