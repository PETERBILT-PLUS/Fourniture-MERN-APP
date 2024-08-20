import { Request, Response } from "express";
import userModel, { IUser } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import adminModel, { IAdmin } from "../model/admin.model.js";


// this function is Checked
export const register = async (req: Request, res: Response) => {
    try {
        const { nom, prenom, email, password, adress, phone } = req.body;

        if (!nom || !prenom || !email || !password) return res.status(400).json({ success: false, message: "Manque D'informations" });

        const userExist: IUser | null = await userModel.findOne({ email });

        if (userExist) {

            const adminExist: IAdmin | null = await adminModel.findOne({ email });

            const JWT_SECRET = process.env.JWT_SECRET;
            const DEVELOPMENT_MODE = process.env.DEVELOPMENT_MODE

            if (!JWT_SECRET) throw new Error("The JWT_SECRET is not available please check the .env file");
            if (!DEVELOPMENT_MODE) throw new Error("the DEVELOPMENT_MODE is not availabe please check the .env file");

            if (adminExist) {
                const isMatch = await bcrypt.compare(password, adminExist.password);
                if (!isMatch) return res.status(401).json({ sucess: false, message: "Email ou mot de passe incorrect" });

                const token = jwt.sign({ _id: adminExist._id }, JWT_SECRET, { expiresIn: "30d" });

                res.status(200).cookie("token", token, {
                    maxAge: 100 * 60 * 60 * 24 * 30,
                    sameSite: "strict",
                    httpOnly: true,
                    secure: DEVELOPMENT_MODE == "development" ? false : true,
                });
                res.status(200).json({ success: true, message: "Utilisateur déja Enregistrer", admin: adminExist });
                return false;
            }
            const isMatch = await bcrypt.compare(password, userExist.password);

            if (!isMatch) return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });

            const token = jwt.sign({ _id: userExist._id }, JWT_SECRET, { expiresIn: "30d" });

            res.status(200).cookie("token", token, {
                maxAge: 100 * 60 * 60 * 24 * 30,
                sameSite: "strict",
                httpOnly: true,
                secure: DEVELOPMENT_MODE == "development" ? false : true,
            });
            res.status(200).json({ success: true, message: "Connection avec Succès", user: userExist });
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const newUser: IUser = new userModel({
            nom: nom,
            prenom: prenom,
            email: email,
            password: hashPass,
            adress: adress,
            phone: phone
        });

        newUser.save().then((user: IUser) => {
            res.status(201).json({ success: true, message: "Utilisateur crée avec Succès", user });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}


// this function is checked
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(401).json({ success: false, message: "Manque D'informations" });

        const adminExist: IAdmin | null = await adminModel.findOne({ email });

        const JWT_SECRET = process.env.JWT_SECRET;
        const DEVELOPMENT_MODE = process.env.DEVELOPMENT_MODE;

        if (!JWT_SECRET) throw new Error("The JWT_SECRET is not available");
        if (!DEVELOPMENT_MODE) throw new Error("The DEVELOPMENT_MODE is not available please check the .env file");

        if (adminExist) {
            const isMatch = await bcrypt.compare(password, adminExist.password);

            if (!isMatch) return res.status(401).json({ success: false, message: "Email ou Mot de Passe Incorrect" });

            const token = jwt.sign({ _id: adminExist._id }, JWT_SECRET, { expiresIn: "30d" });

            res.status(200).cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                secure: DEVELOPMENT_MODE == "developement" ? false : true,
                httpOnly: true,
                sameSite: "strict"
            });

            res.status(200).json({ success: true, message: "Admin Login Succès", admin: adminExist });
            return false;
        }
        const userExist: IUser | null = await userModel.findOne({ email });

        if (!userExist) return res.status(401).json({ success: false, message: "Utilisateur pas trouvé" });

        const isMatch = await bcrypt.compare(password, userExist.password);

        if (!isMatch) return res.status(401).json({ success: false, message: "Email ou Password Incorrect" });

        const token = jwt.sign({ _id: userExist._id }, JWT_SECRET, { expiresIn: "30d" });

        res.status(200).cookie("token", token, {
            maxAge: 100 * 60 * 60 * 24 * 30,
            sameSite: "strict",
            httpOnly: true,
            secure: DEVELOPMENT_MODE == "development" ? false : true,
        });
        res.status(200).json({ success: true, message: "Utulisateur Connecté avec Succès" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}


// this function is checked 
export const logout = async (req: Request, res: Response) => {
    try {
        res.status(200).cookie("token", "", { maxAge: 0 });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}