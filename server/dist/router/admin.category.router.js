import express from "express";
import { checkAdmin } from "../middleware/admin.middleare.js";
import { createBrand, createCategory, deleteCategory, getCategoryAndBrands, updateCategoryName } from "../controller/admin.category.controller.js";
export const categoryRouter = express.Router();
categoryRouter.get("/get-category-product", getCategoryAndBrands);
categoryRouter.post("/create-category", checkAdmin, createCategory);
categoryRouter.post("/create-brand", checkAdmin, createBrand);
categoryRouter.put("/update-category-name", checkAdmin, updateCategoryName);
categoryRouter.delete("/delete-category", checkAdmin, deleteCategory);
