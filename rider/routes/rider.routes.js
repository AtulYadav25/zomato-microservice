import express from 'express';
import riderController from '../controllers/rider.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { riderAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(registerSchema), riderController.registerRider);
router.post('/login', validate(loginSchema), riderController.loginRider);
router.post('/logout', riderAuth, riderController.logoutRider);
router.post('/toggle-availability', riderAuth, riderController.toggleAvailability);

export default router;