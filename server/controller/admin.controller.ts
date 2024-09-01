import { Request, Response } from "express";
import productModel, { IProduct } from "../model/product.model.js";
import categoryModel, { ICategory } from "../model/category.model.js";
import mongoose from "mongoose";
import { getUserSocketId, io } from "../socket/socket.js";
import userModel, { IUser } from "../model/user.model.js";
import brandModel, { IBrand } from "../model/brand.model.js";
import storeDetailsModel, { IStoreDetails } from "../model/storeDetails.model.js";


// this function is checked
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products: IProduct[] = await productModel.find({}).populate("category");

        if (!products.length) return res.status(200).json({ success: true, data: [] });

        res.status(200).json({ success: true, data: products });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await userModel.find({});

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}


// this function is checked
export const createListing = async (req: Request, res: Response) => {
    try {
        const { name, description, price, category, brand, stock, images } = req.body;

        if (!name || !description || !price || !category || !brand || !stock || !images) {
            return res.status(401).json({ success: false, message: "Manque d'informations" });
        }

        const brandExist: IBrand | null = await brandModel.findOne({ name: brand });
        if (!brandExist) return res.status(404).json({ successs: false, message: "Brand Pas Existé" });

        const categoryExist: ICategory | null = await categoryModel.findOne({ categoryName: category });
        if (!categoryExist) return res.status(404).json({ success: false, message: "Categorie Pas Trouvé" });

        const newProduct: IProduct = new productModel({
            name: name,
            description: description,
            price: price,
            category: categoryExist._id,
            brand: brandExist,
            stock: stock,
            images: images
        });

        newProduct.save().then((product: IProduct) => {

            categoryExist?.categoryProducts?.push(product?._id as mongoose.Types.ObjectId);
            categoryExist.save().then((category: ICategory) => {
                res.status(201).json({ success: true, message: "Produit Enregistrer avec Succès" });
            }).catch((error) => {
                console.error(error);
                res.status(500).json({ success: false, message: "Une Erreur au Cours D'enregistrer la Categorie" });
            });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur au cours d'enregistrer le Produit S'il vou plai recommencer une autre fois" });
        })
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user_id = req.query.user_id;

        if (!user_id) return res.status(400).json({ success: false, message: "Manque D'informations" });

        const userExist: IUser | null = await userModel.findByIdAndDelete(user_id);
        if (!userExist) return res.status(404).json({ success: false, message: "Utilisateur pas trouvé" });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Inrerne du Sreveur" });
    }
}

export const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const product_id = req.query.id;

        if (!product_id) return res.status(400).json({ success: false, message: "Manque D'informations" });

        const product: IProduct | null = await productModel.findById(product_id).populate("category");
        if (!product) return res.status(404).json({ success: false, message: "Produit Pas Trouvé" });

        res.status(200).json({ success: true, product: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, messgae: "Erreur Interne du serveur" });
    }
}


export const setStoreDetails = async (req: Request, res: Response) => {
    try {
        const storeData = req.body.storeData; // Data to update

        if (!storeData || Object.keys(storeData).length === 0) {
            return res.status(400).json({ success: false, message: "No data provided for update." });
        }

        // Update the document or create a new one if it doesn't exist
        const store = await storeDetailsModel.findByIdAndUpdate(
            null,
            { $set: storeData }, // Set the fields in storeData
            { new: true, upsert: true } // Create if not found, return the new document
        );

        res.status(200).json({ success: true, store: store.toObject() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// This function is checked
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { _id, name, description, price, category, brand, stock, images } = req.body;


        if (!_id || !name || !description || !price || !category || !brand || !stock || !images) {
            return res.status(401).json({ success: false, message: "Manque d'informations" });
        }

        const categoriyExist: ICategory | null = await categoryModel.findOne({ categoryName: category });
        if (!categoriyExist) return res.status(404).json({ success: false, message: "Catégorie Pas Trouvé" });

        const updateProduct: IProduct | null = await productModel.findByIdAndUpdate(_id, {
            name: name,
            description: description,
            price: price,
            category: categoriyExist._id,
            brand: { name: brand }, // Pass an object with brand name
            stock: stock,
            images: images
        }, { new: true });

        if (!updateProduct) return res.status(404).json({ success: false, message: "Produit Pas Trouvé" });

        updateProduct.save().then((product: IProduct) => {
            res.status(200).json({ success: true, message: "Produit Amélioré avec Succès" });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}


// This function is Checked
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const _id = req.query._id;

        if (!_id) return res.status(401).json({ success: false, message: "Manque d'informations" });

        const deletedProduct: IProduct | null = await productModel.findByIdAndDelete(_id);

        if (!deletedProduct) return res.status(404).json({ success: false, message: "Produit non Trouvé" });

        const categoryExist: ICategory | null = await categoryModel.findById(deletedProduct.category);

        if (!categoryExist) return res.status(404).json({ success: false, message: "Category Pas Trouvé" });

        categoryExist.categoryProducts?.filter((elem: mongoose.Types.ObjectId) => {
            return (
                elem._id != deletedProduct._id
            )
        });

        categoryExist.save().then((category: ICategory) => {
            // Socket Logic here
            io.emit("deletedProduct", deletedProduct);
            res.status(200).json({ success: true, category: category });
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur Interne du  Serveur" });
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreurn Interne du Serveur" });
    }
}


// this function is checked
export const searchProductByName = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query) return res.status(400).json({ success: false, message: "Query parameter est manquant" });

        const products: IProduct[] = await productModel.find({
            aname: { $regex: query, $option: "i" }
        })

        if (!products.length) {
            return res.status(200).json({ success: true, data: [] });
        }

        res.status(200).json({ success: true, data: products });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}


// this function is checked
export const getProductsByBrand = async (req: Request, res: Response) => {
    try {
        const { brandName } = req.query;

        if (!brandName) return res.status(400).json({ success: false, message: "Besoin de nom du marque" });

        const products: IProduct[] = await productModel.find({
            "brand.name": { $regex: new RegExp(brandName as string, "i") }
        });

        res.status(200).json({ success: true, data: products });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}