import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        nom: { type: String, required: true },
        prenom: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String },
        phone: { type: String },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc: IUser, ret: any): void => {
                delete ret.password
            }
        }
    }
);

export default mongoose.model<IUser>('User', UserSchema);
