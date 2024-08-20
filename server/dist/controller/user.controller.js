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
