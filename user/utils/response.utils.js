export const successResponse = (res,statusCode, message, data)=>{
    return res.status(statusCode).json({
        success:true,
        message,
        data
    })
}

export const errorResponse = (res,statusCode,message, data = null, error = null)=>{
    return res.status(statusCode).json({
        success:true,
        message,
        data,
        error
    })
}