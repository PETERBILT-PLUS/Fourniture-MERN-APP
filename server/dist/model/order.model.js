import { Schema, model } from 'mongoose';
const orderSchema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'canceled'], default: 'pending' },
}, { timestamps: true } // Automatically add createdAt and updatedAt fields
);
export default model('Order', orderSchema);
