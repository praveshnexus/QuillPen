import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getMyBookmarks } from "../controllers/bookmarkController";

const router = express.Router();

router.get("/", authMiddleware, getMyBookmarks);

export default router;