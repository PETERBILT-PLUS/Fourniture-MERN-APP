import { Request, Response } from "express";
import orderModel, { IOrder } from "../model/order.model.js";
import productModel, { IProduct } from "../model/product.model.js";
import basketModel, { IBasket } from "../model/basket.model.js";



export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;

        const orderExist: IOrder[] = await orderModel.find({
            customer: user_id,
        });

        if (!orderExist || orderExist.length === 0) return res.status(200).json({ success: true, order: [] });

        res.status(200).json({ success: true, order: orderExist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreurn Interne du Serveur" });
    }
}


export const makeOrder = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;
        const { products, basket_id } = req.body;

        if (!user_id || !basket_id || !products || !Array.isArray(products)) {
            return res.status(401).json({ success: false, message: "Manque D'informations" });
        }

        // Find if the user already has an active order
        const order: IOrder | null = await orderModel.findOne({
            customer: user_id,
        });

        let totalAmount: number = 0;
        // Create a new order if one doesn't exist
        for (const elem of products) {
            const productExist: IProduct | null = await productModel.findById(elem.product);
            if (productExist) {
                totalAmount += (Number(productExist.price) * Number(elem.quantity));
            }
        }

        const newOrder: IOrder = new orderModel({
            customer: user_id,
            products: products.map((elem: IBasket, index: number) => ({
                product: elem._id,
                quantity: elem.products[index].product,
            })),
            totalAmount: totalAmount,
            status: "pending",
        });

        const deleteBasket: IBasket | null = await basketModel.findByIdAndDelete(basket_id);
        if (!deleteBasket) return res.status(404).json({ success: false, message: "Panier Pas Trouvé" });

        newOrder.save().then((order: IOrder) => {
            res.status(201).json({ success: true, order: order });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
        })
        // Emit socket event or any other business logic
        res.status(201).json({ success: true, message: "Ordre Crée avec Succès", order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}