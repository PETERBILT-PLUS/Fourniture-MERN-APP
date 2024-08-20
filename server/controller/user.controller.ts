import { Request, Response } from "express";
import userModel, { IUser } from "../model/user.model.js";
import bcrypt from "bcrypt";



export const viewProfile = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;

        const user: IUser | null = await userModel.findById(user_id);

        if (!user) return res.status(404).json({ success: false, message: "Pas D'utilisateur avec cet _id" });

        res.status(200).json({ success: true, user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

export const editProfile = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;
        const { name, email, password, adress, phone } = req.body;

        if (!name || !email || !password) return res.status(401).json({ success: false, message: "Manque D'informations" });

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const userUpdate: IUser | null = await userModel.findByIdAndUpdate(user_id, {
            name: name,
            email: email,
            password: hashPass,
            adress: adress,
            phone: phone,
        }, { new: true });

        if (!userUpdate) return res.status(404).json({ success: false, message: "Utilisateur Pas trouvé D'après cet _id", newUser: userUpdate });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}