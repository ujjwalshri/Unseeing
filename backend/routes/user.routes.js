import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getUserProfile, followUnfollowUser, getSuggestedUser, updateUser } from "../controllers/user.controllers.js";

const router = express.Router();


router.get('/profile/:id' , protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUser);
router.post('/follow/:id',protectRoute,  followUnfollowUser);
router.post('/update', protectRoute, updateUser);
export default router;