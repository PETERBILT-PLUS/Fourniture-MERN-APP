import { Request, Response } from "express";
import orderModel, { IOrder } from "../model/order.model.js";
import { getUserSocketId, io } from "../socket/socket.js";


// This function is checked
export const getAdminOrders = async (req: Request, res: Response) => {
    try {
        const orders: IOrder[] = await orderModel
            .find({})
            .populate({ path: "customer", model: "User" })
            .populate({ path: "products.product", model: "Product" });

        if (!orders.length) return res.status(200).json({ success: true, message: "Pas D'ordres", data: [] });

        res.status(200).json({ success: true, data: orders })

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}



export const changeOrderStatus = async (req: Request, res: Response) => {
    try {
        const { order_id, status } = req.body;

        if (!order_id || !status) return res.status(401).json({ success: false, message: "Manque D'informations" });

        const orderExist: IOrder | null = await orderModel.findById(order_id);
        if (!orderExist) return res.status(404).json({ success: false, message: "ordre est Manqué" });

        orderExist.status = status;

        orderExist.save().then((order: IOrder) => {
            // Socket logic here
            const receiver: string = getUserSocketId(String(order.customer));
            io.to(receiver).emit("order", order);
            res.status(200).json({ success: true, order: order });
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur au Cour D'enregistrer L'ordre" })
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

// Add more delete...

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const order_id = req.query.order_id;

        if (!order_id) return res.status(404).json({ succeess: false, message: "Manque D'informations" });

        const orderDelete: IOrder | null = await orderModel.findByIdAndDelete(order_id);
        if (!orderDelete) return res.status(404).json({ success: false, message: "Order Pas Trouvé" });

        res.status(200).json({ success: true, order: orderDelete.toObject() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}