import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import adminModel, { IAdmin } from "../model/admin.model.js";


declare global {
    namespace Express {
        interface Request {
            admin?: any;
        }
    }
}


export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.status(401).json({ success: false, message: "Manque D'D'informations" });

        const JWT_SECRET = process.env.JWT_SECRET || "";

        if (!JWT_SECRET) throw new Error("The JWT_SECRET is not available please check the .env file");

        const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (!decode) return res.status(401).json({ success: false, message: "Pas autorisé" });

        const admin: IAdmin | null = await adminModel.findById(decode._id);

        if (!admin) return res.status(404).json({ success: false, message: "Admin Pas Trouvé" });

        req.admin = admin;
        next();
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Ineterne Du Serveur" });
    }
}