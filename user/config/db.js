import mongoose from "mongoose";

export const connectMongoose = async()=>{
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDB is connected");
    }).catch((err)=>{
        console.log("MongoDB failed to connect!");
        console.log("Error: ",err)
    })
}