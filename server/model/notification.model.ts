import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
    user: Schema.Types.ObjectId;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model<INotification>('Notification', notificationSchema);
