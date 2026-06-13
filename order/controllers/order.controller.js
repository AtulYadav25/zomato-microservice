import { z } from 'zod';
import bcrypt from 'bcrypt'
import { createToken } from '../utils/jwt.utils.js'
import { errorResponse, successResponse } from "../utils/response.utils.js";
import OrderModel from "../models/order.model.js";

const getOrder = async (req, res) => {
    try {
        
        const {orderId} = req.params;

        const order = await OrderModel.findById(orderId);

        if(!order){
            return errorResponse(res, 404, "Order Not Found!")
        }

        return successResponse(res, 200, "Order Found!", order)

    } catch (error) {
        
    }
}

const orderController = {
    getOrder
}

export default orderController;