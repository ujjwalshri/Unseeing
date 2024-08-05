

import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { storeBug } from '../controllers/bug.controllers.js';

const router = express.Router();

router.post('/', protectRoute, storeBug);

export default router;