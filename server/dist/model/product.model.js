import mongoose, { Schema } from 'mongoose';
const brandShema = new Schema({
    name: {
        type: String,
        required: true
    },
    base64Photo: {
        type: String,
        required: false,
    }
});
const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: brandShema, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String, required: true }],
}, { timestamps: true });
export default mongoose.model('Product', ProductSchema);
