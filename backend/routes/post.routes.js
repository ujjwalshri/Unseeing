import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { commentOnPost, createPost, deletePost, getAllPosts, getLikedPosts, likeOnPost } from '../controllers/post.controllers.js';

const router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/liked/:id' , protectRoute,getLikedPosts )
router.post('/create' , protectRoute, createPost);
router.delete('/:id', protectRoute, deletePost);
router.post('/like/:id' , protectRoute, likeOnPost);
router.post('/comment/:id' , protectRoute, commentOnPost);

export default router;