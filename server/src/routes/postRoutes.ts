import express from "express";
import {
  createPost,
  getAllPosts,
  getSinglePostID,
  getSinglePost,
  updatePost,
  deletePost,
  searchPosts,
} from "../controllers/postController";
import commentRoutes from "./commentRoutes";
import authMiddleware from "../middleware/authMiddleware";
import likeRoutes from "./likeRoutes";

import postBookmarkRoutes from "./postBookmarkRoutes";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/search",searchPosts);
router.get("/id/:id", authMiddleware, getSinglePostID);
router.get("/:slug", getSinglePost);

router.put("/:id", authMiddleware, updatePost);

router.delete("/:id", authMiddleware, deletePost);

router.use("/:postId/comments", commentRoutes);
router.use("/:postId/like", likeRoutes);
router.use("/:postId/bookmark", postBookmarkRoutes);

export default router;
