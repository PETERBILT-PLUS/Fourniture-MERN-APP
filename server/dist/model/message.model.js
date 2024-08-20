import { Schema, model } from 'mongoose';
// تعريف نموذج الرسالة
const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, required: true },
    receiverId: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
}, { timestamps: true });
// تصدير نموذج الرسالة
export default model('Message', messageSchema);
