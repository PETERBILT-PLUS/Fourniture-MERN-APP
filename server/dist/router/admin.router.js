var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { createListing, deleteProduct, deleteUser, getProducts, getProductsByBrand, getSingleProduct, getUsers, searchProductByName, setStoreDetails, updateProduct } from "../controller/admin.controller.js";
import { checkAdmin } from "../middleware/admin.middleare.js";
import adminModel from "../model/admin.model.js";
import bcrypt from "bcrypt";
//import { getAdminUsersForSidebar, getUsers } from "../controller/message.controller.js";
export const adminRouter = express.Router();
adminRouter.get("/get-products", getProducts);
adminRouter.get("/get-single-product", getSingleProduct);
adminRouter.get("/search-product-by-name", checkAdmin, searchProductByName);
adminRouter.get("/get-product-by-brand", checkAdmin, getProductsByBrand);
// adminRouter.get("/get-admin-users-for-sidebar", checkAdmin, getAdminUsersForSidebar);
adminRouter.put("/set-store-details", checkAdmin, setStoreDetails);
adminRouter.get("/get-users", checkAdmin, getUsers);
adminRouter.post("/create-listing", checkAdmin, createListing);
adminRouter.put("/update-product", checkAdmin, updateProduct);
adminRouter.delete("/delete-user", checkAdmin, deleteUser);
adminRouter.delete("/delete-product", checkAdmin, deleteProduct);
adminRouter.post("/create-admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const salt = yield bcrypt.genSalt(10);
    const hashPass = yield bcrypt.hash(password, salt);
    const admin = new adminModel({
        name: name,
        email: email,
        password: hashPass,
    });
    admin.save().then(() => {
        res.status(201).json({ success: true });
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ success: false });
    });
}));
