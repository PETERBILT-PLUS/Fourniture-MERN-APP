import mongoose from "mongoose";
const categoryShema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
    },
    categoryProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: [],
            required: false,
        }],
}, { timestamps: true });
export default mongoose.model("Category", categoryShema);
