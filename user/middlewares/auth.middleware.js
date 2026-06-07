import { verifyToken } from "../utils/jwt.utils.js";
import { errorResponse } from "../utils/response.utils.js";

export const userAuth = (req,res, next)=>{
    try {
        //Get Token
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        //Verify token
        const decoded = verifyToken(token);

        
        if(!decoded.success){
            return errorResponse(res, 401, "Invalid Credentials");
        }

        req.rider = decoded.data;

        next();
    } catch (error) {
        errorResponse(res, 401, "Not Authorized")
    }
} 