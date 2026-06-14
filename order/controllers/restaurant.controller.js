import { z } from 'zod';
import bcrypt from 'bcrypt'
import { createToken } from '../utils/jwt.utils.js'
import { errorResponse, successResponse } from "../utils/response.utils.js";
import OrderModel from "../models/order.model.js";

//Rider Accepts Order
const acceptOrder = async (req, res) => {
    try {

        const { orderId } = req.params;

        //Get Order
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return errorResponse(res, 404,
                "Order Not Found!"
            )
        }

        if(order.paymentStatus !== "PAID"){
            return errorResponse(res, 400, "Order is not paid yet!")
        }

        //Filter items for this restaurant
        const itemsForThisRestaurant = order.items.filter(item=> item.restaurantId.toString() === req.entity.restaurantId);

        //Check if already accepted the order
        if (itemsForThisRestaurant.some(item=> item.acceptedAt)) {
            return errorResponse(res, 400,
                "Order is already Accepted"
            )
        };

        let currentTime = new Date();

        
        // Update the order.items with this itemsForThisRestaurant new data;
        order.items = order.items.map(item=>{
            if(item.restaurantId.toString() === req.entity.restaurantId.toString()){
                return {
                    ...item,
                    acceptedAt: currentTime
                }

                return item;
            }
        })
        

        //Check if all items are accepted, then mark the whole order as accepted
        if(order.items.every(item=> item.acceptedAt)){
            order.acceptedAt = currentTime;
            order.status = "PREPARING"
        }

        await order.save();

        return successResponse(res,
            201,
            "Order Accepted!")

    } catch (error) {
        errorResponse(res, 400, error.message, null, error)
    }
}

const orderReady = async (req, res) => {
    try {

        const { orderId } = req.params;

        //Get Order
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return errorResponse(res, 404,
                "Order Not Found!"
            )
        };

        //Check if orders are already set as prepared
        const orderedItems = order.items.filter(item=> (item.restaurantId.toString() === req.entity.restaurantId.toString()))

        if(orderedItems.every(item=> !item.acceptedAt)){
            return errorResponse(res, 400, "Order is not accepted yet!")
        }

        if(orderedItems.every(item=> item.preparedAt)){
            return errorResponse(res, 400, "Order is already ready for pickup")
        }

        // Filter and update items status from pickedItemIds
        order.items = order.items.map(item => {
            if (item.restaurantId.toString() === req.entity.restaurantId.toString()) {
                return {
                    ...item,
                    preparedAt: new Date()
                };
            }
            return item;
        });

        await order.save();
        

        return successResponse(res,
            201,
            "Order Ready for Pickup!")

    } catch (error) {
        errorResponse(res, 400, error.message, null, error)
    }
}

//TODO : Add Polling / Kafka here to allow restaurant fetch orders with items of their restaurant

const restaurantController = {
    acceptOrder,
    orderReady
}

export default restaurantController;