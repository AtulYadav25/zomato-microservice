import { model, Schema } from "mongoose";

const orderSchema = new Schema({
    orderedBy: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    items:[
        {
            itemId: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            restaurantId: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            quantity: {
                type: Number,
                min: 1,
                required: true
            },
            price: {
                type: Number
            },
            acceptedAt: Date,
            preparedAt: Date,
            pickedUpAt: Date,
        }
    ],
    status:{
        type: String,
        enum: [
        "PENDING",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
    riderAssigned:{
        type: Schema.Types.ObjectId,
        default: null,
    },
    deliveryAddress:{
        addressLine1: String,
        city: String,
        state: String,
        pincode: Number
    },
    paymentStatus:{
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING"
    },
    subTotal:{
        type: Number,
        required: true
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    platformFee:{
        type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
},{
    timestamps: true
});

const OrderModel = model('Order', orderSchema);
export default OrderModel;