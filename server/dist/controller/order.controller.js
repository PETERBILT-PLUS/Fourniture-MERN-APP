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
import productModel from "../model/product.model.js";
import basketModel from "../model/basket.model.js";
export const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const orderExist = yield orderModel.find({
            customer: user_id,
        }).populate("products.product");
        if (!orderExist || orderExist.length === 0)
            return res.status(200).json({ success: true, order: [] });
        res.status(200).json({ success: true, order: orderExist });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreurn Interne du Serveur" });
    }
});
export const makeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!user_id) {
            return res.status(401).json({ success: false, message: "Manque D'informations" });
        }
        // Find if the user already has an active order
        const basketExist = yield basketModel.findOne({
            user: user_id,
        });
        if (!basketExist)
            return res.status(404).json({ sucess: false, message: "Panier Pas Trouvé" });
        let totalAmount = 0;
        // Create a new order if one doesn't exist
        for (const elem of basketExist.products) {
            const productExist = yield productModel.findById(elem.product);
            if (productExist) {
                totalAmount += (Number(productExist.price) * Number(elem.quantity));
            }
        }
        const newOrder = new orderModel({
            customer: user_id,
            products: basketExist.products.map((elem) => ({
                product: elem.product,
                quantity: elem.quantity,
            })),
            totalAmount: totalAmount,
            status: "pending",
        });
        const deleteBasket = yield basketModel.findOneAndDelete({
            user: user_id,
        });
        if (!deleteBasket)
            return res.status(404).json({ success: false, message: "Panier Pas Trouvé" });
        newOrder.save().then((order) => {
            res.status(201).json({ success: true, order: order });
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
        });
        // Emit socket event or any other business logic
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
