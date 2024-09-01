import { Request, Response } from "express";
import userModel, { IUser } from "../model/user.model.js";
import bcrypt from "bcrypt";
import userMessageModel, { IUserMEssage } from "../model/user.message.model.js";
import { getUserSocketId, io } from "../socket/socket.js";
import adminModel, { IAdmin } from "../model/admin.model.js";
import storeDetailsModel, { IStoreDetails } from "../model/storeDetails.model.js";


// this function is checked
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


export const getStoreDetails = async (req: Request, res: Response) => {
    try {
        const detail: IStoreDetails[] = await storeDetailsModel.find({});
        const realDetail = detail[0];

        res.status(200).json({ success: true, details: realDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

// this function is checked
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


// this function is checked
export const sendMessageToAdmin = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;
        const { name, message } = req.body;

        if (!name || !message) return res.status(400).json({ succes: false, message: "Manque D'informations" });

        const newMessage: IUserMEssage = new userMessageModel({
            name: name,
            message: message
        });

        const admin: IAdmin[] = await adminModel.find({});
        const adminExist: IAdmin = admin[0];

        newMessage.save().then((message: IUserMEssage) => {
            const receiver: string = getUserSocketId(adminExist?._id as string);
            io.to(receiver).emit("userMessage", message);
            res.status(201).json({ success: true });
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json({ succes: false, message: "Erreur au cours D'enregistrer le Message" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ succes: false, message: "Erreur Interne du Serveur" });
    }
}