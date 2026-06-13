import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import { placeOrderSchema } from '../schemas/order.schema.js';
import { authEntity } from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';
import riderController from '../controllers/rider.Controller.js';
import restaurantController from '../controllers/restaurant.controller.js';
import orderController from '../controllers/order.controller.js';

const router = express.Router();

//Order Routes
router.get('/:orderId', orderController.getOrder);

//Order Routes for User
router.post('/place-order', authEntity("userId"),validate(placeOrderSchema), userController.placeOrder); // TODO : Edit ValidateBody Middleware
router.post('/cancel-order/:orderId',authEntity("userId"), userController.cancelOrder);

//Rider Order Routes
router.post('/rider/accept-order/:orderId',authEntity("riderId"), riderController.assignRider);
router.post('/rider/pickup-order/:orderId',authEntity("riderId"), riderController.pickUpOrder);
router.post('/rider/deliver-order/:orderId',authEntity("riderId"), riderController.orderDelivered);

// Restaurant Order Routes
router.post('/restaurant/accept-order/:orderId',authEntity("restaurantId"), restaurantController.acceptOrder)
router.post('/restaurant/order-ready/:orderId',authEntity("restaurantId"), restaurantController.orderReady)

export default router;