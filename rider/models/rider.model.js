import { model, Schema } from "mongoose";

const riderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "available"
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
        select: false,
    }
},{
    timestamps: true
});

const RiderModel = model('Rider', riderSchema);
export default RiderModel;