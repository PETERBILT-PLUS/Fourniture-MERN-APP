import { Schema, model, Document } from 'mongoose';


export interface IOrderProducts {
    product: Schema.Types.ObjectId; // Reference to the Product model
    quantity: number;
}

export interface IOrder extends Document {
    customer: Schema.Types.ObjectId; // Reference to the User model
    products: IOrderProducts[];
    totalAmount: number;
    status: 'pending' | 'shipped' | 'delivered' | 'canceled';
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
            }
        ],
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ['pending', 'shipped', 'delivered', 'canceled'], default: 'pending' },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export default model<IOrder>('Order', orderSchema);
