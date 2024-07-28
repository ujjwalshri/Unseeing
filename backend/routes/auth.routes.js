import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();


router.post('/signup', signup)
router.get('/me' ,protectRoute,  getMe)
router.post('/login', login)

router.post('/logout',protectRoute, logout)
export default router;