import mongoose, { Document } from "mongoose";


export interface IBrand extends Document {
    name: string;
    base64Photo: string;
}


const brandSchema = new mongoose.Schema<IBrand>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    base64Photo: {
        type: String,
        required: true
    }
});

export default mongoose.model<IBrand>("Brand", brandSchema);