import { Schema, model, Document } from 'mongoose';

export interface IProduct {
    product: Schema.Types.ObjectId; // Reference to the Product model
    quantity: number;
}

export interface IBasket extends Document {
    user: Schema.Types.ObjectId; // Reference to the User model
    products: IProduct[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const basketSchema = new Schema<IBasket>(
    {
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
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export default model<IBasket>('Basket', basketSchema);
