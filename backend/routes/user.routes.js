import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getUserProfile, followUnfollowUser } from "../controllers/user.controllers.js";

const router = express.Router();


router.get('/profile/:email' , protectRoute, getUserProfile);
router.post('/follow/:id',protectRoute,  followUnfollowUser);

export default router;