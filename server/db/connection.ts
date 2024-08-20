import mongoose from "mongoose";


export const connectToDataBase = async () => {

    const MONGO_URI = process.env.MONGO_URI || "";

    if (!MONGO_URI) throw new Error("the MONGO_URI is not available please check the .env file");

    mongoose.connect(MONGO_URI).then(() => {
        console.log("Connected to DataBase Succesfully");
    }).catch((error: any) => {
        throw new Error(error);
    })
}