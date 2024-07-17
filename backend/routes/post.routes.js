import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { createPost, deletePost } from '../controllers/post.controllers.js';

const router = express.Router();


router.post('/create' , protectRoute, createPost);
router.delete('/:id', protectRoute, deletePost);
// router.post('/like/:id' , protectRoute, likePost);
// router.post('/comment/:id' , protectRoute, commentPost);

export default router;