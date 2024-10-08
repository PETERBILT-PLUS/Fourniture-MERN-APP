import { Schema, model } from 'mongoose';
const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });
export default model('Notification', notificationSchema);
