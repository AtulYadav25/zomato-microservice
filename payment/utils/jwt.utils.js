import jwt from 'jsonwebtoken';

export const verifyToken = (token)=>{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        return {
            success: false,
            data: null
        }
    }

    return {
        success: true,
        data: decoded
    }
}