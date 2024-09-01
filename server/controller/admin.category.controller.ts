import { Request, Response } from "express";
import categoryModel, { ICategory } from "../model/category.model.js";
import mongoose from "mongoose";
import brandModel, { IBrand } from "../model/brand.model.js";


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

export const createBrand = async (req: Request, res: Response) => {
    try {
        const { name, base64Photo } = req.body;

        if (!name || !base64Photo) return res.status(400).json({ success: false, message: "Manque D'informations" });

        const brandExist: IBrand | null = await brandModel.findOne({ name: name });
        if (brandExist) return res.status(400).json({ success: false, message: "Brand Est déja Existé" });

        const newBrand: IBrand = new brandModel({
            name: name,
            base64Photo: base64Photo,
        });

        newBrand.save().then((brand: IBrand) => {
            res.status(201).json({ success: true, brand: brand });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur au cours D'enregistrer le document" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getCategoryAndBrands = async (req: Request, res: Response) => {
    try {
        const categorys: ICategory[] = await categoryModel.find({});
        const brands: IBrand[] = await brandModel.find({});

        res.status(200).json({ success: true, data: { categorys, brands } });
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