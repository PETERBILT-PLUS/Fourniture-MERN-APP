import mongoose from "mongoose";
export const adminModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});
export default mongoose.model("Admin", adminModel);
