import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    amount:{
        type: Number,
        default: 0 //FREEE!
    }
},{
    timestamps: true
});

const PaymentModel = model('Payment', paymentSchema);
export default PaymentModel;