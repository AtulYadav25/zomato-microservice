import PaymentModel from "../models/payment.model.js";
import { z } from 'zod';
import bcrypt from 'bcrypt'
import { errorResponse, successResponse } from "../utils/response.utils.js";
import axios from 'axios';
import { publishEvent } from '../../kafka/producer.js'
import { TOPICS } from '../../kafka/topics.js'

export const payForOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { amount } = req.body;

        //Fetch Order
        const response = await axios.get(`http://localhost:3005/api/order/${orderId}`);

        const order = response.data.data

        if (order.paymentStatus === "PAID") {
            return errorResponse(res, 400, "Already Paid For the Order");
        }

        if (order.totalAmount != amount) {
            return errorResponse(res, 400, "Please pay correct amount for order")
        }

        // MOCK : Just Update Payment Status

        //order.paymentStatus = "PAID";

        // TODO: Use Kafka here to send a event to order service and mark the payment status as paid there

        await publishEvent(TOPICS.PAYMENT_SUCCESS, {
            orderId,
            userId: req.entity.userId,
            amount,
            paidAt: new Date()
        },orderId)

        const paymentDoc = await PaymentModel.create({
            orderId,
            userId: req.entity.userId,
            amount,
        })

        successResponse(res,
            201,
            "Thanks for using Zomato Service")

    } catch (error) {
        errorResponse(res, 400, error.message, null, error)
    }
}

// TODO : Use Kafka to refund for orders

const paymentController = {
    payForOrder
}

export default paymentController;