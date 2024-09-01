var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import productModel from "../model/product.model.js";
import categoryModel from "../model/category.model.js";
import { io } from "../socket/socket.js";
import userModel from "../model/user.model.js";
import brandModel from "../model/brand.model.js";
import storeDetailsModel from "../model/storeDetails.model.js";
// this function is checked
export const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel.find({}).populate("category");
        if (!products.length)
            return res.status(200).json({ success: true, data: [] });
        res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
export const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel.find({});
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
// this function is checked
export const createListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, category, brand, stock, images } = req.body;
        if (!name || !description || !price || !category || !brand || !stock || !images) {
            return res.status(401).json({ success: false, message: "Manque d'informations" });
        }
        const brandExist = yield brandModel.findOne({ name: brand });
        if (!brandExist)
            return res.status(404).json({ successs: false, message: "Brand Pas Existé" });
        const categoryExist = yield categoryModel.findOne({ categoryName: category });
        if (!categoryExist)
            return res.status(404).json({ success: false, message: "Categorie Pas Trouvé" });
        const newProduct = new productModel({
            name: name,
            description: description,
            price: price,
            category: categoryExist._id,
            brand: brandExist,
            stock: stock,
            images: images
        });
        newProduct.save().then((product) => {
            var _a;
            (_a = categoryExist === null || categoryExist === void 0 ? void 0 : categoryExist.categoryProducts) === null || _a === void 0 ? void 0 : _a.push(product === null || product === void 0 ? void 0 : product._id);
            categoryExist.save().then((category) => {
                res.status(201).json({ success: true, message: "Produit Enregistrer avec Succès" });
            }).catch((error) => {
                console.error(error);
                res.status(500).json({ success: false, message: "Une Erreur au Cours D'enregistrer la Categorie" });
            });
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur au cours d'enregistrer le Produit S'il vou plai recommencer une autre fois" });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
export const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.query.user_id;
        if (!user_id)
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        const userExist = yield userModel.findByIdAndDelete(user_id);
        if (!userExist)
            return res.status(404).json({ success: false, message: "Utilisateur pas trouvé" });
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Inrerne du Sreveur" });
    }
});
export const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product_id = req.query.id;
        if (!product_id)
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        const product = yield productModel.findById(product_id).populate("category");
        if (!product)
            return res.status(404).json({ success: false, message: "Produit Pas Trouvé" });
        res.status(200).json({ success: true, product: product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, messgae: "Erreur Interne du serveur" });
    }
});
export const setStoreDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeData = req.body.storeData; // Data to update
        if (!storeData || Object.keys(storeData).length === 0) {
            return res.status(400).json({ success: false, message: "No data provided for update." });
        }
        // Update the document or create a new one if it doesn't exist
        const store = yield storeDetailsModel.findByIdAndUpdate(null, { $set: storeData }, // Set the fields in storeData
        { new: true, upsert: true } // Create if not found, return the new document
        );
        res.status(200).json({ success: true, store: store.toObject() });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
// This function is checked
export const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, name, description, price, category, brand, stock, images } = req.body;
        if (!_id || !name || !description || !price || !category || !brand || !stock || !images) {
            return res.status(401).json({ success: false, message: "Manque d'informations" });
        }
        const categoriyExist = yield categoryModel.findOne({ categoryName: category });
        if (!categoriyExist)
            return res.status(404).json({ success: false, message: "Catégorie Pas Trouvé" });
        const updateProduct = yield productModel.findByIdAndUpdate(_id, {
            name: name,
            description: description,
            price: price,
            category: categoriyExist._id,
            brand: { name: brand }, // Pass an object with brand name
            stock: stock,
            images: images
        }, { new: true });
        if (!updateProduct)
            return res.status(404).json({ success: false, message: "Produit Pas Trouvé" });
        updateProduct.save().then((product) => {
            res.status(200).json({ success: true, message: "Produit Amélioré avec Succès" });
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
// This function is Checked
export const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const _id = req.query._id;
        if (!_id)
            return res.status(401).json({ success: false, message: "Manque d'informations" });
        const deletedProduct = yield productModel.findByIdAndDelete(_id);
        if (!deletedProduct)
            return res.status(404).json({ success: false, message: "Produit non Trouvé" });
        const categoryExist = yield categoryModel.findById(deletedProduct.category);
        if (!categoryExist)
            return res.status(404).json({ success: false, message: "Category Pas Trouvé" });
        (_a = categoryExist.categoryProducts) === null || _a === void 0 ? void 0 : _a.filter((elem) => {
            return (elem._id != deletedProduct._id);
        });
        categoryExist.save().then((category) => {
            // Socket Logic here
            io.emit("deletedProduct", deletedProduct);
            res.status(200).json({ success: true, category: category });
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur Interne du  Serveur" });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreurn Interne du Serveur" });
    }
});
// this function is checked
export const searchProductByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query)
            return res.status(400).json({ success: false, message: "Query parameter est manquant" });
        const products = yield productModel.find({
            aname: { $regex: query, $option: "i" }
        });
        if (!products.length) {
            return res.status(200).json({ success: true, data: [] });
        }
        res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
// this function is checked
export const getProductsByBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brandName } = req.query;
        if (!brandName)
            return res.status(400).json({ success: false, message: "Besoin de nom du marque" });
        const products = yield productModel.find({
            "brand.name": { $regex: new RegExp(brandName, "i") }
        });
        res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
