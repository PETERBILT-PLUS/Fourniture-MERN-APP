import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel, { IUser } from "../model/user.model.js";
import adminModel, { IAdmin } from "../model/admin.model.js";
import { isNamedImportBindings } from "typescript";

export const getState = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not available. Please check the .env file");
        }


        let decode: JwtPayload;
        // Verify the token
        try {
            decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (error: any) {
            if (error.name === 'JsonWebTokenError') {
                // Invalid token signature
                return res.status(401).json({ success: false, message: "Invalid token" });
            } else if (error.name === 'TokenExpiredError') {
                // Token has expired
                return res.status(401).json({ success: false, message: "Token has expired" });
            } else {
                // Other JWT errors
                return res.status(401).json({ success: false, message: "Token verification failed" });
            }
        }

        if (!decode) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Find the user or admin
        const user: IUser | null = await userModel.findById(decode._id);
        const admin: IAdmin | null = await adminModel.findById(decode._id);

        if (admin) {
            return res.status(200).json({ success: true, isAdmin: true });
        } else if (user) {
            return res.status(200).json({ success: true, isAdmin: false });
        }

        res.status(404).json({ success: false, message: "User or Admin not found" });
    } catch (error) {
        console.error("Error in getState function:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
