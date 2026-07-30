import Article from "../models/Article.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import ContentItem from "../models/ContentItem.js";
import Subscriber from "../models/Subscriber.js";

export const getDashboard = async (_req, res) => {
  const [articles, users, categories, featured, recentArticles, content, subscribers] = await Promise.all([
    Article.countDocuments(), User.countDocuments(), Category.countDocuments(),
    Article.countDocuments({ featured: true }),
    Article.find().sort({ createdAt: -1 }).limit(5).populate("author", "name"),
    ContentItem.countDocuments(), Subscriber.countDocuments({ status: "subscribed" }),
  ]);
  res.json({ success: true, data: { articles, users, categories, featured, recentArticles, content, subscribers } });
};

export const getUsers = async (req, res) => {
  const search = req.query.search?.trim();
  const query = search ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] } : {};
  const users = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.json({ success: true, data: users });
};

export const updateUserRole = async (req, res) => {
  if (!['admin', 'user'].includes(req.body.role)) return res.status(400).json({ success: false, message: "Invalid role" });
  if (req.params.id === String(req.user._id) && req.body.role !== "admin") {
    return res.status(400).json({ success: false, message: "You cannot remove your own administrator access" });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: user });
};

export const getMyProfile = async (req, res) => res.json({ success: true, data: req.user });
