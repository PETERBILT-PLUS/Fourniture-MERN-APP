import { Schema, model } from 'mongoose';
const basketSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    }
}, { timestamps: true } // Automatically add createdAt and updatedAt fields
);
export default model('Basket', basketSchema);
