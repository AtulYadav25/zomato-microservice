import { model, Schema } from "mongoose";

const userSchema = new Schema({
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

const UserModel = model('User', userSchema);
export default UserModel;