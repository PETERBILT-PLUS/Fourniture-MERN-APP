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
import userModel from "../model/user.model.js";
import adminModel from "../model/admin.model.js";
export const getState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not available. Please check the .env file");
        }
        let decode;
        // Verify the token
        try {
            decode = jwt.verify(token, JWT_SECRET);
        }
        catch (error) {
            if (error.name === 'JsonWebTokenError') {
                // Invalid token signature
                return res.status(401).json({ success: false, message: "Invalid token" });
            }
            else if (error.name === 'TokenExpiredError') {
                // Token has expired
                return res.status(401).json({ success: false, message: "Token has expired" });
            }
            else {
                // Other JWT errors
                return res.status(401).json({ success: false, message: "Token verification failed" });
            }
        }
        if (!decode) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Find the user or admin
        const user = yield userModel.findById(decode._id);
        const admin = yield adminModel.findById(decode._id);
        if (admin) {
            return res.status(200).json({ success: true, isAdmin: true });
        }
        else if (user) {
            return res.status(200).json({ success: true, isAdmin: false });
        }
        res.status(404).json({ success: false, message: "User or Admin not found" });
    }
    catch (error) {
        console.error("Error in getState function:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
