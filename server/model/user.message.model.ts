import mongoose, { Document } from "mongoose";

export interface IUserMEssage extends Document {
    name: string;
    message: string;
}

const userMessageModel = new mongoose.Schema<IUserMEssage>({
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
});

export default mongoose.model<IUserMEssage>("User_Message", userMessageModel);