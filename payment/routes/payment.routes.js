import express from 'express';
import { authEntity } from '../middlewares/auth.middleware.js';
import paymentController from '../controllers/payment.controller.js';
import validateBody from '../middlewares/validate.middleware.js';
import z from 'zod'

const router = express.Router();

router.post('/pay/:orderId', 
    authEntity("userId"),
    validateBody(z.object({
        amount: z.number()
    })),
    paymentController.payForOrder);


export default router;