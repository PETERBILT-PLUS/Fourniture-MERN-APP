import express from "express";
import { checkAdmin } from "../middleware/admin.middleare.js";
import { changeOrderStatus, getAdminOrders } from "../controller/admin.order.controller.js";
export const adminOrderRouter = express.Router();
adminOrderRouter.get("/get-orders", checkAdmin, getAdminOrders);
adminOrderRouter.get("/change-order-status", checkAdmin, changeOrderStatus);
