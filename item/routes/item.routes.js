import express from 'express';
import itemController from '../controllers/item.controller.js';
import { itemSchema } from '../schemas/item.schema.js';
import { authEntity } from '../middlewares/auth.middleware.js';
import validateBody from '../middlewares/validate.middleware.js';

const router = express.Router();

router.post('/new', 
    authEntity("restaurantId"), 
    validateBody(itemSchema), 
    itemController.addMenuItem);

router.get('/getAllItems', 
    itemController.getAllItems);

router.delete('/:itemId', 
    authEntity("restaurantId"), 
    itemController.deleteItem);

router.patch('/:itemId/toggle-availability', 
    authEntity("restaurantId"), 
    validateBody(itemSchema.pick({
      status: true,
    })), 
    itemController.toggleItemStatus);

export default router;