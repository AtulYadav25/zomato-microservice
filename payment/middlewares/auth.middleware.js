import { verifyToken } from "../utils/jwt.utils.js";
import { errorResponse } from "../utils/response.utils.js";

export const authEntity = (requiredEntity) => (req,res, next)=>{
    try {
        //Get Token
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        //Verify token
        const decoded = verifyToken(token);

        
        if(!decoded.success){
            return errorResponse(res, 401, "Invalid Credentials");
        }
        
        req.entity = decoded.data;
        
        if(!req.entity[requiredEntity]){
            return errorResponse(res, 401, "Not Authorized");
        }

        next();
    } catch (error) {
        errorResponse(res, 401, "Not Authorized")
    }
} 