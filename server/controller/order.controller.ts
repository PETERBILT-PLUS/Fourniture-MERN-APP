import { Request, Response } from "express";
import orderModel, { IOrder } from "../model/order.model.js";
import productModel, { IProduct } from "../model/product.model.js";
import basketModel, { IBasket, IProduct as IBasketProduct } from "../model/basket.model.js";
import adminModel, { IAdmin } from "../model/admin.model.js";
import { getUserSocketId, io } from "../socket/socket.js";



export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;

        const orderExist: IOrder[] = await orderModel.find({
            customer: user_id,
        }).populate("products.product");

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

        if (!user_id) {
            return res.status(401).json({ success: false, message: "Manque D'informations" });
        }

        // Find if the user already has an active order
        const basketExist: IBasket | null = await basketModel.findOne({
            user: user_id,
        });

        if (!basketExist) return res.status(404).json({ sucess: false, message: "Panier Pas Trouvé" });

        let totalAmount: number = 0;
        // Create a new order if one doesn't exist
        for (const elem of basketExist.products) {
            const productExist: IProduct | null = await productModel.findById(elem.product);
            if (productExist) {
                totalAmount += (Number(productExist.price) * Number(elem.quantity));
            }
        }

        const newOrder: IOrder = new orderModel({
            customer: user_id,
            products: basketExist.products.map((elem: IBasketProduct) => ({
                product: elem.product,
                quantity: elem.quantity,
            })),
            totalAmount: totalAmount,
            status: "pending",
        });

        const deleteBasket: IBasket | null = await basketModel.findOneAndDelete({
            user: user_id,
        });
        if (!deleteBasket) return res.status(404).json({ success: false, message: "Panier Pas Trouvé" });

        const admin: IAdmin[] = await adminModel.find({});
        const realAdmin: IAdmin | null | undefined = admin[0];

        newOrder.save().then((order: IOrder) => {
            const userSocket = getUserSocketId(realAdmin._id as string);
            io.to(userSocket).emit("newOrder", order);
            res.status(201).json({ success: true, order: order });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
        })
        // Emit socket event or any other business logic
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}