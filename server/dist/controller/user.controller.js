var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import userMessageModel from "../model/user.message.model.js";
import { getUserSocketId, io } from "../socket/socket.js";
import adminModel from "../model/admin.model.js";
import storeDetailsModel from "../model/storeDetails.model.js";
// this function is checked
export const viewProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield userModel.findById(user_id);
        if (!user)
            return res.status(404).json({ success: false, message: "Pas D'utilisateur avec cet _id" });
        res.status(200).json({ success: true, user: user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
export const getStoreDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detail = yield storeDetailsModel.find({});
        const realDetail = detail[0];
        res.status(200).json({ success: true, details: realDetail });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
// this function is checked
export const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { name, email, password, adress, phone } = req.body;
        if (!name || !email || !password)
            return res.status(401).json({ success: false, message: "Manque D'informations" });
        const salt = yield bcrypt.genSalt(10);
        const hashPass = yield bcrypt.hash(password, salt);
        const userUpdate = yield userModel.findByIdAndUpdate(user_id, {
            name: name,
            email: email,
            password: hashPass,
            adress: adress,
            phone: phone,
        }, { new: true });
        if (!userUpdate)
            return res.status(404).json({ success: false, message: "Utilisateur Pas trouvé D'après cet _id", newUser: userUpdate });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
// this function is checked
export const sendMessageToAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { name, message } = req.body;
        if (!name || !message)
            return res.status(400).json({ succes: false, message: "Manque D'informations" });
        const newMessage = new userMessageModel({
            name: name,
            message: message
        });
        const admin = yield adminModel.find({});
        const adminExist = admin[0];
        newMessage.save().then((message) => {
            const receiver = getUserSocketId(adminExist === null || adminExist === void 0 ? void 0 : adminExist._id);
            io.to(receiver).emit("userMessage", message);
            res.status(201).json({ success: true });
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ succes: false, message: "Erreur au cours D'enregistrer le Message" });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ succes: false, message: "Erreur Interne du Serveur" });
    }
});
