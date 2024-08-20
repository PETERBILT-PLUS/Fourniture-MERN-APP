var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import orderModel from "../model/order.model.js";
import { getUserSocketId, io } from "../socket/socket.js";
// This function is checked
export const getAdminOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel.find({});
        if (!orders.length)
            return res.status(404).json({ success: true, message: "Pas D'ordres", data: [] });
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
export const changeOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, status } = req.body;
        if (!order_id || !status)
            return res.status(401).json({ success: false, message: "Manque D'informations" });
        const orderExist = yield orderModel.findById(order_id);
        if (!orderExist)
            return res.status(404).json({ success: false, message: "ordre est Manqué" });
        orderExist.status = status;
        orderExist.save().then((order) => {
            // Socket logic here
            const receiver = getUserSocketId(String(order.customer));
            io.to(receiver).emit("order", order);
            res.status(200).json({ success: true, order: order });
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur au Cour D'enregistrer L'ordre" });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
// Add more delete...
