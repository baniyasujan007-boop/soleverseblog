import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getFeaturedArticles,
} from "../controllers/articleController.js";
const router = express.Router();  

router.get("/", getArticles);
router.get("/featured", getFeaturedArticles);

router.post("/", protect, admin, upload.single("image"), createArticle);
router.get("/:id", getArticleById);
router.put("/:id", protect, admin, upload.single("image"), updateArticle);
router.delete("/:id", protect, admin, deleteArticle);

export default router;
