import mongoose from "mongoose";
const storeSchema = new mongoose.Schema({
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
