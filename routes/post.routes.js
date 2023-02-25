import express from "express";
import { deletePost, feedPosts, likePost, userPosts } from "../controllers/posts.js";
import verifyJwt from "../middlewares/verifyJwt.js";


const router = express.Router()


router.get('/all/:id', verifyJwt, userPosts)
router.get('/all', verifyJwt, feedPosts)
router.patch('/:id/like',verifyJwt, likePost)
router.delete('/:id', verifyJwt, deletePost)


export default router;