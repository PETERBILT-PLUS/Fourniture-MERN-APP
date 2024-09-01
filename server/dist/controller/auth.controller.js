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
import jwt from "jsonwebtoken";
import adminModel from "../model/admin.model.js";
// this function is Checked
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom, prenom, email, password, adress, phone } = req.body;
        // Check for missing fields
        if (!nom || !prenom || !email || !password || !adress || !phone) {
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        }
        // Check if the user already exists
        const userExist = yield userModel.findOne({ email });
        const adminExist = yield adminModel.findOne({ email });
        const JWT_SECRET = process.env.JWT_SECRET;
        const DEVELOPMENT_MODE = process.env.DEVELOPMENT_MODE;
        if (!JWT_SECRET)
            throw new Error("The JWT_SECRET is not available. Please check the .env file.");
        if (!DEVELOPMENT_MODE)
            throw new Error("The DEVELOPMENT_MODE is not available. Please check the .env file.");
        if (userExist || adminExist) {
            const existingUser = userExist || adminExist;
            const isAdmin = !!adminExist;
            const isMatch = yield bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
            }
            const token = jwt.sign({ _id: existingUser._id, isAdmin }, JWT_SECRET, { expiresIn: "30d" });
            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                sameSite: "strict",
                httpOnly: true,
                secure: DEVELOPMENT_MODE !== "development",
            });
            return res.status(200).json({
                success: true,
                message: isAdmin ? "Connexion administrateur réussie" : "Connexion utilisateur réussie",
                [isAdmin ? 'admin' : 'user']: existingUser === null || existingUser === void 0 ? void 0 : existingUser.toObject(),
                admin: isAdmin ? true : false,
            });
        }
        // If user doesn't exist, create a new user
        const salt = yield bcrypt.genSalt(10);
        const hashPass = yield bcrypt.hash(password, salt);
        const newUser = new userModel({
            nom,
            prenom,
            email,
            password: hashPass,
            adress,
            phone,
        });
        const savedUser = yield newUser.save();
        const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, { expiresIn: "30d" });
        res.cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            sameSite: "strict",
            secure: DEVELOPMENT_MODE == "development" ? false : true,
            httpOnly: true,
        });
        res.status(201).json({ success: true, message: "Utilisateur crée avec succès", user: savedUser, isAdmin: false });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
// this function is checked
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(401).json({ success: false, message: "Manque D'informations" });
        const adminExist = yield adminModel.findOne({ email });
        const JWT_SECRET = process.env.JWT_SECRET;
        const DEVELOPMENT_MODE = process.env.DEVELOPMENT_MODE;
        if (!JWT_SECRET)
            throw new Error("The JWT_SECRET is not available");
        if (!DEVELOPMENT_MODE)
            throw new Error("The DEVELOPMENT_MODE is not available please check the .env file");
        if (adminExist) {
            const isMatch = yield bcrypt.compare(password, adminExist.password);
            if (!isMatch)
                return res.status(401).json({ success: false, message: "Email ou Mot de Passe Incorrect" });
            const token = jwt.sign({ _id: adminExist._id }, JWT_SECRET, { expiresIn: "30d" });
            res.status(200).cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                secure: DEVELOPMENT_MODE == "development" ? false : true,
                httpOnly: true,
                sameSite: "strict"
            });
            res.status(200).json({ success: true, message: "Admin Login Succès", admin: adminExist.toObject() });
            return false;
        }
        const userExist = yield userModel.findOne({ email });
        if (!userExist)
            return res.status(401).json({ success: false, message: "Utilisateur pas trouvé" });
        const isMatch = yield bcrypt.compare(password, userExist.password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: "Email ou Password Incorrect" });
        const token = jwt.sign({ _id: userExist._id }, JWT_SECRET, { expiresIn: "30d" });
        res.status(200).cookie("token", token, {
            maxAge: 100 * 60 * 60 * 24 * 30,
            sameSite: "strict",
            httpOnly: true,
            secure: DEVELOPMENT_MODE == "development" ? false : true,
        });
        res.status(200).json({ success: true, message: "Utulisateur Connecté avec Succès", user: userExist.toObject() });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
// this function is checked 
export const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).cookie("token", "", { maxAge: 0 });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
