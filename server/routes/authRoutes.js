import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register User
router.post("/register", registerUser);
// Login User
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);

export default router;
