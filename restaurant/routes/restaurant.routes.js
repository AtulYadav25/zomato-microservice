import express from 'express';
import restaurantController from '../controllers/restaurant.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { restaurantAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(registerSchema), restaurantController.registerRestaurant);
router.post('/login', validate(loginSchema), restaurantController.loginRestaurant);
router.post('/logout', restaurantAuth, restaurantController.logoutRestaurant);
router.post('/toggle-availability', restaurantAuth, restaurantController.toggleAvailability);

export default router;