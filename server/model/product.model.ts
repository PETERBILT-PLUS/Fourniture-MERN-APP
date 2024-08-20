import mongoose, { Schema, Document } from 'mongoose';

interface IBrand {
    name: string,
    base64photo: string,
}


export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: mongoose.Schema.Types.ObjectId;
    brand: IBrand;
    stock: number;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

const brandShema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    base64Photo: {
        type: String,
        required: false,
    }
})

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        brand: { type: brandShema, required: true },
        stock: { type: Number, required: true },
        images: [{ type: String, required: true }],
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
