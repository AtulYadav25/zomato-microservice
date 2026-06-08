import ItemModel from "../models/item.model.js";
import {z} from 'zod';
import bcrypt from 'bcrypt'
import { errorResponse, successResponse } from "../utils/response.utils.js";


export const getAllItems = async(req, res)=>{
    try {
        const {restaurantId } = req.query;

        const filter = {
            status: "AVAILABLE"
        }

        if(restaurantId){
            filter.restaurantId = restaurantId;
        }

        const items = await ItemModel.find(filter)

        successResponse(res, 
            201, 
            "Items Fetched!", 
            items)

    } catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const addMenuItem = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const {name, price} = req.body;

        //Create new Item
        const newItem = await ItemModel.create({
            name,
            restaurantId: req.entity.restaurantId,
            price
        })

        successResponse(res, 
            201, 
            "Item Created!", 
            newItem)

    } catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const toggleItemStatus = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const { status } = req.body;
        const { itemId } = req.params;

        // Find Item
        const item = await ItemModel.findOneAndUpdate({_id: itemId, restaurantId: req.entity.restaurantId}, {
            status
        },{ new: true});


        if(!item){
            throw new Error("Item not found");
        }

        successResponse(res, 
            200, 
            "Item Status Updated Successful!", 
            item)

    }  catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const deleteItem = async(req, res)=>{
    try {

        const { itemId } = req.params;

        await ItemModel.findOneAndDelete({_id: itemId, restaurantId: req.entity.restaurantId})

        successResponse(res, 
            200, 
            "Item Deleted Successfully")

    }  catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


const itemController = {
    addMenuItem,
    getAllItems,
    deleteItem,
    toggleItemStatus
}

export default itemController;