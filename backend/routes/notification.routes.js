import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { deleteNotification, getAllNotifications } from '../controllers/notification.controllers.js';

const router = express.Router();


router.get('/', protectRoute ,getAllNotifications );
router.delete('/', protectRoute, deleteNotification);
export default router;