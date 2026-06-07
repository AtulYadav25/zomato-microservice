import { model, Schema } from "mongoose";

const restaurantSchema = new Schema({
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

const RestaurantModel = model('Restaurant', restaurantSchema);
export default RestaurantModel;