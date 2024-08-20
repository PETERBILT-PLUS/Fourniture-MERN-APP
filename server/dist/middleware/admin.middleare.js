var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import adminModel from "../model/admin.model.js";
export const checkAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({ success: false, message: "Manque D'D'informations" });
        const JWT_SECRET = process.env.JWT_SECRET || "";
        if (!JWT_SECRET)
            throw new Error("The JWT_SECRET is not available please check the .env file");
        const decode = jwt.verify(token, JWT_SECRET);
        if (!decode)
            return res.status(401).json({ success: false, message: "Pas autorisé" });
        const admin = yield adminModel.findById(decode._id);
        if (!admin)
            return res.status(404).json({ success: false, message: "Admin Pas Trouvé" });
        req.admin = admin;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Ineterne Du Serveur" });
    }
});
