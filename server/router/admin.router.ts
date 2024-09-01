import express, { Request, Response } from "express";
import { createListing, deleteProduct, deleteUser, getProducts, getProductsByBrand, getSingleProduct, getUsers, searchProductByName, setStoreDetails, updateProduct } from "../controller/admin.controller.js";
import { checkAdmin } from "../middleware/admin.middleare.js";
import adminModel, { IAdmin } from "../model/admin.model.js";
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

adminRouter.post("/create-admin", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const admin: IAdmin = new adminModel({
        name: name,
        email: email,
        password: hashPass,
    });

    admin.save().then(() => {
        res.status(201).json({ success: true });
    }).catch((error: any) => {
        console.error(error);
        res.status(500).json({ success: false })
    });
})