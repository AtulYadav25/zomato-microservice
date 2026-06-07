import RiderModel from "../models/rider.model.js";
import {z} from 'zod';
import bcrypt from 'bcrypt'
import {createToken} from '../utils/jwt.utils.js'
import { errorResponse, successResponse } from "../utils/response.utils.js";


export const registerRider = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const {name, email, password} = req.body;

        //If Email already exist
        const existingRider = await RiderModel.findOne({email});

        if(existingRider){
            throw new Error("Email Already Exist")
        }

        //Create new Rider
        const hashPassword = await bcrypt.hash(password,10)
        const newRider = await RiderModel.create({
            name,
            email,
            password: hashPassword
        })

        //Create and send token
        const token = createToken({
            riderId: newRider._id, 
        });

        res.cookie('token', token);
        const riderData = newRider.toObject();
        delete riderData.password;

        successResponse(res, 
            201, 
            "Rider Registered!", 
            riderData)

    } catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const loginRider = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const {email, password} = req.body;

        // Find Rider
        const rider = await RiderModel.findOne({email}).select("+password");

        if(!rider){
            throw new Error("Rider not found");
        }

        const isMatch = await bcrypt.compare(password,rider.password);

        if(!isMatch){
            throw new Error("Invalid Credentials");
        }

        //Create and send token
        const token = createToken({
            riderId: rider._id, 
        });

        res.cookie('token', token);

        const riderData = rider.toObject();
        delete riderData.password;

        successResponse(res, 
            200, 
            "Rider Login Successful!", 
            riderData)

    }  catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const logoutRider = async(req, res)=>{
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

        // Find Rider
        const rider = await RiderModel.findByIdAndUpdate(req.rider.riderId,
            {status},
        {new: true}); //new: true returns updated doc

        successResponse(res, 
            200, 
            "Rider Status Updated Successful!", 
            rider)

    }  catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}

const riderController = {
    registerRider,
    loginRider,
    logoutRider,
    toggleAvailability
}

export default riderController;