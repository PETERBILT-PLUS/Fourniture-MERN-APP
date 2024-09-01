import express from "express";
import { checkAdmin } from "../middleware/admin.middleare.js";
import { changeOrderStatus, deleteOrder, getAdminOrders } from "../controller/admin.order.controller.js";
export const adminOrderRouter = express.Router();
adminOrderRouter.get("/get-orders", checkAdmin, getAdminOrders);
adminOrderRouter.post("/change-order-status", checkAdmin, changeOrderStatus);
adminOrderRouter.delete("/delete-order", checkAdmin, deleteOrder);
