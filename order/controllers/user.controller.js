import {z} from 'zod';
import bcrypt from 'bcrypt'
import {createToken} from '../utils/jwt.utils.js'
import { errorResponse, successResponse } from "../utils/response.utils.js";
import axios from 'axios'
import OrderModel from "../models/order.model.js";


const placeOrder = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const {items, deliveryAddress} = req.body;

        const itemIds = items.map(item => item.itemId);

        //Fetch All Items
        const response = await axios.post(`http://localhost:3004/api/item/getItems`,{
            itemIds
        });

        const fetchedItems = response.data.data;
        //Check if all items exist
        if(fetchedItems.length !== items.length){
            //Get All found items id
            const foundIds = fetchedItems.map(item=> item._id.toString());

            //Filter items not found
            const notFoundItems = itemIds.filter((id)=>{
                !foundIds.has(id.toString())
            });

            return errorResponse(res, 
                404,
                `Not Found Items: ${notFoundItems.join(', ')}`
            )
        }

        //For O(1) Lookup
        const itemsLookup = Object.fromEntries(
            fetchedItems.map(item=>[
                item._id.toString(),
                item
            ])
        );

        //Get Subtotal
        let subTotal = 0;
        const orderedItems = items.map(({itemId, quantity})=>{
            //Get the fetched item
            const dbItem = itemsLookup[itemId];
            subTotal += dbItem.price *  quantity

            return {
                itemId,
                restaurantId: dbItem.restaurantId,
                quantity,
                price: dbItem.price
            }
        });
        
        //Calculate Order Stats
        const platformFee = subTotal * 0.03; // 3% of total spend
        const deliveryFee = 40
        const totalAmount = platformFee + subTotal + deliveryFee;

        const newOrder = await OrderModel.create({
            orderedBy: req.entity.userId,
            items: orderedItems,
            deliveryAddress,
            platformFee,
            subTotal,
            deliveryFee,
            totalAmount,
        })

        successResponse(res, 
            201, 
            "Order Placed!", 
            newOrder)

    } catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


const cancelOrder = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const {orderId} = req.params;

        const order = await OrderModel.findOne({
            _id: orderId,
            orderedBy: req.entity.userId
        })

        if(!order){
            return errorResponse(res, 404, "Order not found!")
        }

        if(order.status === "ACCEPTED"){
            return errorResponse(res, 400, "Order cannot be cancelled once accepted!");
        }

        if(order.status === "CANCELLED"){
            return errorResponse(res, 400, "Order is already cancelled");
        }

        order.status = "CANCELLED";

        await order.save();

        // TODO : Use kafka to refund payment

        successResponse(res, 
            201, 
            "Order Canceled!")

    } catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


const userController = {
    placeOrder,
    cancelOrder
}

export default userController;