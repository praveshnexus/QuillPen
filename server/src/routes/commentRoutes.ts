import express from "express";
import { createComment,getCommentsByPost, deleteComment } from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, createComment);
router.get("/", getCommentsByPost);
router.delete("/:commentId",authMiddleware,deleteComment);

export default router;