import express from "express";
import { addToBasket, getBasket, minusProductQuantity, removeFromBasket } from "../controller/basket.controller.js";
import { checkUser } from "../middleware/user.middleware.js";
export const basketRouter = express.Router();
basketRouter.get("/get-basket", checkUser, getBasket);
basketRouter.post("/add-to-basket", checkUser, addToBasket);
basketRouter.post("/add-product-quantity", checkUser, addToBasket);
basketRouter.post("/minus-product-quantity", checkUser, minusProductQuantity);
basketRouter.delete("/delete-from-basket", checkUser, removeFromBasket);
