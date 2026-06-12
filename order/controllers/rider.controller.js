import { z } from 'zod';
import bcrypt from 'bcrypt'
import { createToken } from '../utils/jwt.utils.js'
import { errorResponse, successResponse } from "../utils/response.utils.js";
import OrderModel from "../models/order.model.js";


//Rider Accepts Order
const assignRider = async (req, res) => {
    try {

        const { orderId } = req.params;

        //Get Order
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return errorResponse(res, 404,
                "Order Not Found!"
            )
        }

        //Check if rider is already assigned
        if (order.riderAssigned) {
            return errorResponse(res, 400,
                "Rider is already Assigned"
            )
        };

        //Assign Rider
        order.riderAssigned = req.entity.riderId;

        await order.save();

        successResponse(res,
            201,
            "Rider Assigned!")

    } catch (error) {
        errorResponse(res, 400, error.message, null, error)
    }
}


const pickUpOrder = async (req, res) => {
    try {

        const { orderId } = req.params;
        const { pickedUpItemsRestaurantId } = req.body;

        //Get Order
        const order = await OrderModel.findOne({
            _id: orderId,
            riderAssigned: req.entity.riderId
        });

        if (!order) {
            return errorResponse(res, 404,
                "Order Not Found!"
            )
        }


        //Check if items exist for the restaurant id
        const pickUpItems = order.items.filter(item=> item.restaurantId.toString() === pickedUpItemsRestaurantId);

        if(!pickUpItems){
            return errorResponse(res, 404, "No Items Found");
        }

        //Check if all items are ready to pickup
        if(pickUpItems.every(item=> !item.acceptedAt)){
            return errorResponse(res, 400, "Items are not ready for pickup, please wait..");
        }

        //Check if items are already picked?
        if(pickUpItems.every(item=> item.pickedUpAt)){
            return errorResponse(res, 400, "Items Already Pickedup")
        }

        // Filter and update items status from all the items from this restaurant id in the order
        order.items = order.items.map(item => {
            if (item.restaurantId.toString() === pickedUpItemsRestaurantId) {
                return {
                    ...item,
                    pickedUpAt: new Date()
                };
            }

            return item;
        });

        if(order.items.every(item=> item.preparedAt)){
            order.status = "OUT_FOR_DELIVERY"
        }

        await order.save();

        

        successResponse(res,
            201,
            "Order PickedUp!")

    } catch (error) {
        errorResponse(res, 400, error.message, null, error)
    }
}


const orderDelivered = async (req, res) => {
    try {

        const { orderId } = req.params;

        //Get Order
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return errorResponse(res, 404,
                "Order Not Found!"
            )
        }

        //Check if order is already delivered
        if (order.deliveredAt) {
            return errorResponse(res, 400,
                "Order is already Delivered"
            )
        };

        order.deliveredAt = new Date();
        order.status = "DELIVERED";

        await order.save();

        successResponse(res,
            201,
            "Order Delivered!")

    } catch (error) {
        errorResponse(res, 400, error.message, null, error)
    }
}

//TODO : Add Polling / Kafka here to allow rider fetch orders with riders not assigned

const riderController = {
    assignRider,
    pickUpOrder,
    orderDelivered
}

export default riderController;