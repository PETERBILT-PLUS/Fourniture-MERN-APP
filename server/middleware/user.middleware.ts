import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel, { IUser } from "../model/user.model.js";


declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}


export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.status(401).json({ success: false, message: "Pas Autorisé" });

        const JWT_SECRET = process.env.JWT_SECRET || "";

        if (!JWT_SECRET) throw new Error("The JWT_SECRET is not Available please Check the .env file");

        const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (!decode) return res.status(401).json({ success: false, message: "Pas Autorisé" });

        const user: IUser | null = await userModel.findById(decode._id);

        if (!user) return res.status(404).json({ success: false, message: "Ulitisateur pas Trouvé" });

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}