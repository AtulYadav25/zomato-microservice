import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { userAuth } from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', validate(registerSchema), userController.registerUser);
router.post('/login', validate(loginSchema), userController.loginUser);
router.post('/logout', userAuth, userController.logoutUser);

export default router;