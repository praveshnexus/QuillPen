import express from "express";
import { likePost,unlikePost,getLikeStatus, getLikeCount } from "../controllers/likeController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, likePost);

router.delete("/",authMiddleware,unlikePost);

router.get("/status", authMiddleware, getLikeStatus);
router.get("/count",getLikeCount);

export default router;