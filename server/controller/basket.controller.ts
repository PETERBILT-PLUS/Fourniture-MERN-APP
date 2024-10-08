import { Request, Response } from "express";
import userModel, { IUser } from "../model/user.model.js"
import basketModel, { IBasket } from "../model/basket.model.js";
import productModel, { IProduct } from "../model/product.model.js";
import { IProduct as IBasketProduct } from "../model/basket.model.js";
import { ObjectId } from "mongoose";


// this fuction is checked
export const getBasket = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;


        const userExist: IUser | null = await userModel.findById(user_id);

        if (!userExist) return res.status(404).json({ success: false, message: "Utilisateur Pas Trouvé" });


        const basketExist: IBasket | null = await basketModel.findOne({
            user: user_id,
        }).populate({
            path: "products.product",
            model: "Product"
        });


        if (!basketExist) return res.status(200).json({ success: true, data: [] });

        if (!basketExist.products) return res.status(200).json({ success: true, data: [] });

        let totalAmount: number = 0;
        let productUpdate: boolean = false;

        for (let elem of basketExist.products) {
            const productInfo: IProduct | null = await productModel.findById(elem.product);
            if (productInfo) {
                if (productInfo.stock < elem.quantity) {
                    elem.quantity = Number(productInfo.stock);
                    productUpdate = true;
                }
                // code
                totalAmount += elem.quantity * productInfo.price;
                basketExist.totalAmount = totalAmount;
            }
        }

        if (productUpdate) {
            basketExist.save().then((basket: IBasket) => {
                res.status(200).json({ success: true, data: basket.populate({ path: "products.product", model: "Product" }), totalAmount: totalAmount });
            }).catch((error: any) => {
                console.error(error);
                res.status(500).json({ success: false, message: "Erreur au cours D'analyser le Panier" });
            })
            return false;
        }

        res.status(200).json({ success: true, data: basketExist, Totalamount: basketExist.totalAmount });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}


// this function is checked
export const addToBasket = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;
        const { product } = req.body;

        if (!product) return res.status(401).json({ success: false, message: "Manque D'informations" });

        let basketExist: IBasket | null = await basketModel.findOne({ user: user_id }).populate("products.product");

        if (!basketExist) {
            const productExist: IProduct | null = await productModel.findById(product._id);
            if (!productExist) return res.status(404).json({ success: false, message: "Produit Pas Trouvé" });

            const newBasket: IBasket = new basketModel({
                user: user_id,
                products: [
                    {
                        product: product._id,
                        quantity: 1
                    }
                ],
                totalAmount: productExist.price
            });

            await newBasket.save();
            await newBasket.populate("products.product");

            return res.status(201).json({ success: true, basket: newBasket });
        }

        let totalAmount: number = 0;

        const productExisting = basketExist.products.find((elem: any) => String(elem.product._id) === String(product._id));
        if (productExisting) {
            const myProduct: IProduct | null = await productModel.findById(product._id);
            if (!myProduct) return res.status(404).json({ success: false, message: "Produit Pas Trouvé" });
            if (Number(myProduct.stock) === Number(productExisting.quantity)) {
                return res.status(200).json({ success: false, message: "Max Quantité" });
            }
            productExisting.quantity += 1;
        } else {
            const productExist: IProduct | null = await productModel.findById(product._id);
            if (!productExist) return res.status(404).json({ success: false, message: "Produit Pas Trouvé" });

            basketExist.products.push({
                product: productExist._id as ObjectId,
                quantity: 1,
            });
        }

        // Calculate totalAmount
        for (let elem of basketExist.products) {
            const productExist: IProduct | null = await productModel.findById(elem.product);
            if (productExist) {
                totalAmount += (Number(elem.quantity) * Number(productExist.price));
            }
        }
        basketExist.totalAmount = totalAmount;

        await basketExist.save();
        await basketExist.populate("products.product");

        return res.status(201).json({ success: true, basket: basketExist });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur Inererne du Serveur" });
    }
}


// this function is checked
export const removeFromBasket = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;
        const { products } = req.body;

        if (!products) return res.status(401).json({ success: false, message: "Manque D'informations" });

        const basketExist: IBasket | null = await basketModel.findOne({
            user: user_id,
        });

        if (!basketExist) return res.status(404).json({ success: false, message: "Basket Pas trouvé" });

        const updateBasketProducts: any[] = basketExist.products.filter((elem) => String(elem.product) !== String(products.product));

        basketExist.products = updateBasketProducts;

        basketExist.save().then((basket: IBasket) => {
            res.status(201).json({ success: true, basket: basket });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ succes: false, message: "Erreur au cours D'enregistrer le produit" });
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}


// this function is ckecked
export const addProductQuantity = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;
        const { product } = req.body;


        if (!product) return res.status(401).json({ success: false, message: "Manque d'informations" });

        const basketExist: IBasket | null = await basketModel.findOne({ user: user_id });
        if (!basketExist) return res.status(404).json({ success: false, message: "Panier non trouvé" });

        const preciseIndex = basketExist.products.findIndex((elem: IBasketProduct) =>
            elem.product.toString() === product.product.toString()
        );

        if (preciseIndex === -1) return res.status(404).json({ success: false, message: "Produit non trouvé dans le panier" });

        const productInfo: IProduct | null = await productModel.findById(product.product);
        if (!productInfo) return res.status(404).json({ success: false, message: "Produit non trouvé" });

        const currentQuantity = basketExist.products[preciseIndex].quantity;
        const stock: number = productInfo.stock;

        if (currentQuantity >= stock) {
            return res.status(400).json({ success: false, message: "Quantité maximale atteinte" });
        }

        let totalBasketPrice: number = 0;

        basketExist.products[preciseIndex].quantity += 1;

        for (let elem of basketExist.products) {
            const productInBasket = await productModel.findById(elem.product);
            if (productInBasket) {
                totalBasketPrice += Number(elem.quantity) * Number(productInBasket.price);
            }
        }

        basketExist.totalAmount = totalBasketPrice;

        basketExist.save().then((basket: IBasket) => {
            res.status(200).json({ success: true, message: "Quantité mise à jour avec succès", basket: basket });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur au cours D'enregistrer le Produit dans le Panier" });
        });


    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du serveur" });
    }
}


// this function is checked
export const minusProductQuantity = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;
        const { product } = req.body

        if (!product || !user_id) return res.status(401).json({ success: false, message: "Manque D'information" });

        const basketExist: IBasket | null = await basketModel.findOne({ user: user_id });
        if (!basketExist) return res.status(404).json({ success: false, message: "Panier non trouvé" });

        const preciseIndex = basketExist.products.findIndex((elem: IBasketProduct) => {
            return (
                elem.product.toString() === product.product.toString()
            );
        });

        if (preciseIndex === -1) return res.status(404).json({ success: false, message: "Produit Pas Trouvé" });

        const productInfo: IProduct | null = await productModel.findById(product.product);
        if (!productInfo) return res.status(404).json({ success: false, message: "Produit Pas Trouvé" });

        let totalAmount: number = 0;

        if (basketExist.products[preciseIndex].quantity !== 0) {
            basketExist.products[preciseIndex].quantity = Number(basketExist.products[preciseIndex].quantity -= 1);

            if (basketExist.products[preciseIndex].quantity === 0) {
                basketExist.products = basketExist.products.filter((elem) => {
                    elem.product.toString() !== basketExist.products[preciseIndex].product.toString();
                });

                await basketExist.save();
                await basketExist.populate("products.product");

                return res.status(200).json({ success: true, basket: basketExist });
            }

            for (let elem of basketExist.products) {
                const productExist: IProduct | null = await productModel.findById(elem.product);
                if (productExist) {
                    totalAmount += productExist.price * elem.quantity;
                }
            }

            basketExist.totalAmount = totalAmount;

            await basketExist.save();
            await basketExist.populate("products.product");

            res.status(200).json({ success: true, basket: basketExist });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}