import UserModel from "../models/user.model.js";
import {z} from 'zod';
import bcrypt from 'bcrypt'
import {createToken} from '../utils/jwt.utils.js'
import { errorResponse, successResponse } from "../utils/response.utils.js";


export const registerUser = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const {name, email, password} = req.body;

        //If Email already exist
        const existingUser = await UserModel.findOne({email});

        if(existingUser){
            throw new Error("Email Already Exist")
        }

        //Create new User
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = await UserModel.create({
            name,
            email,
            password: hashPassword
        })

        //Create and send token
        const token = createToken({
            userId: newUser._id, 
        });

        res.cookie('token', token);
        const userData = newUser.toObject();
        delete userData.password;

        successResponse(res, 
            201, 
            "User Registered!", 
            userData)

    } catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const loginUser = async(req, res)=>{
    try {
        //Data is already valdiated by middleware
        const {email, password} = req.body;

        // Find User
        const user = await UserModel.findOne({email}).select("+password");

        if(!user){
            throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            throw new Error("Invalid Credentials");
        }

        //Create and send token
        const token = createToken({
            userId: user._id, 
        });

        res.cookie('token', token);

        const userData = user.toObject();
        delete userData.password;

        successResponse(res, 
            200, 
            "User Login Successful!", 
            userData)

    }  catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


export const logoutUser = async(req, res)=>{
    try {

        res.clearCookie('token');

        successResponse(res, 
            200, 
            "Logout Successfull")

    }  catch (error) {
        errorResponse(res,400,error.message,null, error)
    }
}


const userController = {
    registerUser,
    loginUser,
    logoutUser
}

export default userController;