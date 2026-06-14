import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
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
    },
    totalSpent: {
        type: Number,
        default: 0,
    },
    totalOrders:{
        type: Number,
        default: 0
    },
    lastOrderAt:{
        type: Date
    }
},{
    timestamps: true
});

const UserModel = model('User', userSchema);
export default UserModel;