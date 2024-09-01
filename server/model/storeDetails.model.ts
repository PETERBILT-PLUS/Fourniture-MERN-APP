import mongoose, { Document } from "mongoose";

export interface IStoreDetails extends Document {
    email?: string;
    phoneNumber?: string;
    detail?: string;
    description?: string;
}


const storeSchema = new mongoose.Schema<IStoreDetails>({
    email: {
        type: String,
    },
    phoneNumber: {
        type: String
    },
    detail: {
        type: String
    },
    description: {
        type: String
    }
});

export default mongoose.model("StoreDetail", storeSchema);