import mongoose from "mongoose";
const userMessageModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
});
export default mongoose.model("User_Message", userMessageModel);
