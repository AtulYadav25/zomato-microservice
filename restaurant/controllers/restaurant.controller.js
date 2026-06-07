import RestaurantModel from "../models/restaurant.model.js";
import {z} from 'zod';
import bcrypt from 'bcrypt'
import {createToken} from '../utils/jwt.utils.js'
import { errorResponse, successResponse } from "../utils/response.utils.js";


export const registerRestaurant = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const {name, email, password} = req.body;

        //If Email already exist
        const existingRestaurant = await RestaurantModel.findOne({email});

        if(existingRestaurant){
            throw new Error("Email Already Exist")
        }

        //Create new Restaurant
        const hashPassword = await bcrypt.hash(password,10)
        const newRestaurant = await RestaurantModel.create({
            name,
            email,
            password: hashPassword
        })

        //Create and send token
        const token = createToken({
            restaurantId: newRestaurant._id, 
        });

        res.cookie('token', token);
        const restaurantData = newRestaurant.toObject();
        delete restaurantData.password;

        successResponse(res, 
            201, 
            "Restaurant Registered!", 
            newRestaurant)

    } catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const loginRestaurant = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const {email, password} = req.body;

        // Find Restaurant
        const restaurant = await RestaurantModel.findOne({email}).select("+password");

        if(!restaurant){
            throw new Error("Restaurant not found");
        }

        const isMatch = await bcrypt.compare(password,restaurant.password);

        if(!isMatch){
            throw new Error("Invalid Credentials");
        }

        //Create and send token
        const token = createToken({
            restaurantId: restaurant._id, 
        });

        res.cookie('token', token);

        const restaurantData = restaurant.toObject();
        delete restaurantData.password;

        successResponse(res, 
            200, 
            "Restaurant Login Successful!", 
            restaurantData)

    }  catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const logoutRestaurant = async(req, res)=>{
    try {

        res.clearCookie('token');

        successResponse(res, 
            200, 
            "Logout Successfull")

    }  catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const toggleAvailability = async(req,res) =>{
     try {

        const {status} = req.body

        // Find Restaurant
        const restaurant = await RestaurantModel.findByIdAndUpdate(req.restaurant.restaurantId,
            {status},
        {new: true}); //new: true returns updated doc

        successResponse(res, 
            200, 
            "Restaurant Status Updated Successful!", 
            restaurant)

    }  catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}

const restaurantController = {
    registerRestaurant,
    loginRestaurant,
    logoutRestaurant,
    toggleAvailability
}

export default restaurantController;