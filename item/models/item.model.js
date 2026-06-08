import { model, Schema } from "mongoose";

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["AVAILABLE","NOT_AVAILABLE"],
        default: "AVAILABLE"
    },
    restaurantId:{
        type: Schema.Types.ObjectId,
        required: true,
    },
    price:{
        type: Number,
        default: 0 //FREEE!
    }
},{
    timestamps: true
});

const ItemModel = model('Item', itemSchema);
export default ItemModel;