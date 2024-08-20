import { Schema, model, Document } from 'mongoose';

// تعريف واجهة الرسالة
export interface IMessage extends Document {
    senderId: Schema.Types.ObjectId; // إشارة إلى المرسل (مستخدم أو مدير)
    receiverId: Schema.Types.ObjectId; // إشارة إلى المستقبل (مستخدم أو مدير)
    message: string; // محتوى الرسالة
    createdAt: Date;
    updatedAt: Date;
}

// تعريف نموذج الرسالة
const messageSchema = new Schema<IMessage>(
    {
        senderId: { type: Schema.Types.ObjectId, required: true },
        receiverId: { type: Schema.Types.ObjectId, required: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

// تصدير نموذج الرسالة
export default model<IMessage>('Message', messageSchema);
