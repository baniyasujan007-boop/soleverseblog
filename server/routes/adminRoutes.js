import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getDashboard, getUsers, updateUserRole, getMyProfile } from "../controllers/adminController.js";

const router = express.Router();
router.use(protect, admin);
router.get("/dashboard", getDashboard);
router.get("/profile", getMyProfile);
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
export default router;
