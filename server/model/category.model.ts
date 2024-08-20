import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
    categoryName: string;
    categoryProducts?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}


const categoryShema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
    },
    categoryProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: [],
        required: false,
    }],
}, { timestamps: true });


export default mongoose.model("Category", categoryShema); 