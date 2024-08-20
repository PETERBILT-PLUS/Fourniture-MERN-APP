import mongoose, { Document } from "mongoose";

export interface IAdmin extends Document {
    name: string,
    email: string,
    password: string,
}

export const adminModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

export default mongoose.model<IAdmin>("Admin", adminModel);