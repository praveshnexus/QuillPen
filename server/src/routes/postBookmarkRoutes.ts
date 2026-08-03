// server/src/routes/bookmarkRoutes.ts

import express from "express";
import {
  bookmarkPost,
  removeBookmark,
  getBookmarkStatus,
} from "../controllers/bookmarkController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, bookmarkPost);

router.delete("/", authMiddleware, removeBookmark);

router.get("/status",authMiddleware,getBookmarkStatus);



export default router;