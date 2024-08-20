import express from "express";
import { checkAdmin } from "../middleware/admin.middleare.js";
import { createCategory, deleteCategory, getCategoryProducts, updateCategoryName } from "../controller/admin.category.controller.js";
export const categoryRouter = express.Router();
categoryRouter.get("/get-category-product", getCategoryProducts);
categoryRouter.post("/create-product", checkAdmin, createCategory);
categoryRouter.put("/update-category-name", checkAdmin, updateCategoryName);
categoryRouter.delete("/delete-category", checkAdmin, deleteCategory);
