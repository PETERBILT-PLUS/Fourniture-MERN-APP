import { Request, Response } from "express";
import categoryModel, { ICategory } from "../model/category.model.js";
import mongoose from "mongoose";


// this controller is checked form the errors

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { category_name } = req.body;

        const categoryExist: ICategory | null = await categoryModel.findOne({ categoryName: category_name });
        if (categoryExist) return res.status(400).json({ success: false, message: "Category déja Existé" });

        const newCategory: ICategory = new categoryModel({
            categoryName: category_name,
        });

        newCategory.save().then((category: ICategory) => {
            res.status(201).json({ success: true, category: category });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

export const getCategoryProducts = async (req: Request, res: Response) => {
    try {
        const { category_name } = req.query;

        if (!category_name) return res.status(401).json({ success: false, message: "Nom de Category n'est pas trouvé" });

        const categoryProducts: ICategory | null = await categoryModel.findOne({ categoryName: category_name }).populate("categoryProducts");
        if (!categoryProducts) return res.status(404).json({ success: false, message: "Category Pas Trouvé" });
        if (categoryProducts?.categoryProducts?.length === 0) return res.status(200).json({ success: true, message: "Pas De produit avec cette category" });

        res.status(404).json({ success: true, categoryProducts: categoryProducts.categoryProducts });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Errure Interne du Serveur" });
    }
}

export const updateCategoryName = async (req: Request, res: Response) => {
    try {
        const { category_id, category_name } = req.body;

        if (!category_name) return res.status(400).json({ success: false, message: "Nom de Catégorie est Non Trouvable" });

        const updateCategory: ICategory | null = await categoryModel.findByIdAndUpdate(category_id as mongoose.Types.ObjectId, {
            categoryName: category_name,
        }, { new: true });

        if (!updateCategory) return res.status(404).json({ success: false, message: "Category Pas Trouvé" });

        res.status(200).json({ success: true, category: updateCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { category_name } = req.body;

        if (!category_name) return res.status(400).json({ success: false, message: "Manque D'informations" });

        const categoryDelete: ICategory | null = await categoryModel.findOneAndDelete({ categoryName: category_name }, {
            new: true,
        });

        if (!categoryDelete) return res.status(404).json({ succes: false, message: "Catégorie Pas trouvé" });

        res.status(200).json({ success: true, message: "Catégorie est Supprimé aves Succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}