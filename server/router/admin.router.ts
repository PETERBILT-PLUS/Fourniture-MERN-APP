import express, { Request, Response } from "express";
import { createListing, deleteProduct, getProducts, getProductsByBrand, searchProductByName, updateProduct } from "../controller/admin.controller.js";
import { checkAdmin } from "../middleware/admin.middleare.js";


export const adminRouter = express.Router();

adminRouter.get("/get-products", checkAdmin, getProducts);
adminRouter.get("/search-product-by-name", checkAdmin, searchProductByName);
adminRouter.get("/get-product-by-brand", checkAdmin, getProductsByBrand);
adminRouter.post("/create-listing", checkAdmin, createListing);
adminRouter.put("/update-product", checkAdmin, updateProduct);
adminRouter.delete("/delete-product", checkAdmin, deleteProduct);