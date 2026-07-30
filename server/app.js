import express from "express";
import cors from "cors";
import articleRoutes from "./routes/articleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
 
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to SoleVerse API 🚀" });
});

app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/cms", cmsRoutes);

app.use((error, _req, res, _next) => {
  console.error("Unhandled API error:", error);
  if (error.code === 11000) {
    return res.status(400).json({ success: false, message: "That value already exists" });
  }
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "An unexpected error occurred",
  });
});

export default app;
