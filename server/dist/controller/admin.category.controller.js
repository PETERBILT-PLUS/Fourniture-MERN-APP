var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import categoryModel from "../model/category.model.js";
// this controller is checked form the errors
export const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category_name } = req.body;
        const categoryExist = yield categoryModel.findOne({ categoryName: category_name });
        if (categoryExist)
            return res.status(400).json({ success: false, message: "Category déja Existé" });
        const newCategory = new categoryModel({
            categoryName: category_name,
        });
        newCategory.save().then((category) => {
            res.status(201).json({ success: true, category: category });
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
export const getCategoryProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { category_name } = req.query;
        if (!category_name)
            return res.status(401).json({ success: false, message: "Nom de Category n'est pas trouvé" });
        const categoryProducts = yield categoryModel.findOne({ categoryName: category_name }).populate("categoryProducts");
        if (!categoryProducts)
            return res.status(404).json({ success: false, message: "Category Pas Trouvé" });
        if (((_a = categoryProducts === null || categoryProducts === void 0 ? void 0 : categoryProducts.categoryProducts) === null || _a === void 0 ? void 0 : _a.length) === 0)
            return res.status(200).json({ success: true, message: "Pas De produit avec cette category" });
        res.status(404).json({ success: true, categoryProducts: categoryProducts.categoryProducts });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Errure Interne du Serveur" });
    }
});
export const updateCategoryName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category_id, category_name } = req.body;
        if (!category_name)
            return res.status(400).json({ success: false, message: "Nom de Catégorie est Non Trouvable" });
        const updateCategory = yield categoryModel.findByIdAndUpdate(category_id, {
            categoryName: category_name,
        }, { new: true });
        if (!updateCategory)
            return res.status(404).json({ success: false, message: "Category Pas Trouvé" });
        res.status(200).json({ success: true, category: updateCategory });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
export const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category_name } = req.body;
        if (!category_name)
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        const categoryDelete = yield categoryModel.findOneAndDelete({ categoryName: category_name }, {
            new: true,
        });
        if (!categoryDelete)
            return res.status(404).json({ succes: false, message: "Catégorie Pas trouvé" });
        res.status(200).json({ success: true, message: "Catégorie est Supprimé aves Succès" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
