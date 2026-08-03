import express from "express";
import { signup, login, logout ,getMe } from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected profile accessed",
  });
});

router.get("/me", authMiddleware, getMe);

export default router;
