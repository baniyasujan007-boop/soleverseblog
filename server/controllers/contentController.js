import ContentItem, { contentTypes } from "../models/ContentItem.js";
import mongoose from "mongoose";
import { removeAsset, uploadBuffer } from "../utils/cloudinaryUpload.js";
import slugify from "slugify";

const validType = (type) => contentTypes.includes(type);
const fields = ["title", "summary", "content", "category", "section", "status"];
const toBoolean = (value) => value === true || value === "true";
const metadata = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

export const listContent = async (req, res) => {
  const { type } = req.params;
  if (!validType(type))
    return res
      .status(400)
      .json({ success: false, message: "Unsupported content type" });
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
  const query = { type };
  if (req.query.search)
    query.$or = ["title", "summary", "category"].map((field) => ({
      [field]: { $regex: req.query.search, $options: "i" },
    }));
  if (req.query.status) query.status = req.query.status;
  if (req.query.category) query.category = req.query.category;
  if (req.query.featured !== undefined)
    query.featured = toBoolean(req.query.featured);
  const sorts = {
    oldest: { createdAt: 1 },
    az: { title: 1 },
    za: { title: -1 },
    newest: { createdAt: -1 },
  };
  const [total, data] = await Promise.all([
    ContentItem.countDocuments(query),
    ContentItem.find(query)
      .sort(sorts[req.query.sort] || sorts.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name"),
  ]);
  res.json({
    success: true,
    data,
    page,
    count: data.length,
    total,
    totalPages: Math.ceil(total / limit),
  });
};

export const listPublishedContent = (req, res) => {
  req.query.status = "published";
  return listContent(req, res);
};

export const getPublishedContent = async (req, res) => {
  const { type, id } = req.params;
  if (!validType(type))
    return res
      .status(400)
      .json({ success: false, message: "Unsupported content type" });
  const item = await ContentItem.findOne({
    type,
    status: "published",
    $or: [
      { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
      { slug: id },
    ],
  }).populate("author", "name");
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Content not found" });
  res.json({ success: true, data: item });
};

export const createContent = async (req, res) => {
  const { type } = req.params;
  if (!validType(type))
    return res
      .status(400)
      .json({ success: false, message: "Unsupported content type" });
  const payload = {
    type,
    author: req.user._id,
    featured: toBoolean(req.body.featured),
    metadata: metadata(req.body.metadata),
  };
  fields.forEach((field) => {
    if (req.body[field] !== undefined) payload[field] = req.body[field];
  });
  payload.slug =
    req.body.slug ||
    slugify(payload.title || "", { lower: true, strict: true });
  if (req.file) {
    const asset = await uploadBuffer(req.file.buffer, `soleverse/${type}`);
    payload.image = asset.secure_url;
    payload.imagePublicId = asset.public_id;
  }
  const item = await ContentItem.create(payload);
  await item.populate("author", "name");
  res.status(201).json({ success: true, data: item });
};

export const updateContent = async (req, res) => {
  const { type, id } = req.params;
  if (!validType(type))
    return res
      .status(400)
      .json({ success: false, message: "Unsupported content type" });
  const item = await ContentItem.findOne({ _id: id, type });
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Content not found" });
  fields.forEach((field) => {
    if (req.body[field] !== undefined) item[field] = req.body[field];
  });
  if (req.body.title)
    item.slug =
      req.body.slug || slugify(req.body.title, { lower: true, strict: true });
  if (req.body.featured !== undefined)
    item.featured = toBoolean(req.body.featured);
  if (req.body.metadata !== undefined)
    item.metadata = metadata(req.body.metadata);
  if (req.file) {
    const asset = await uploadBuffer(req.file.buffer, `soleverse/${type}`);
    await removeAsset(item.imagePublicId);
    item.image = asset.secure_url;
    item.imagePublicId = asset.public_id;
  }
  await item.save();
  await item.populate("author", "name");
  res.json({ success: true, data: item });
};

export const deleteContent = async (req, res) => {
  const item = await ContentItem.findOneAndDelete({
    _id: req.params.id,
    type: req.params.type,
  });
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Content not found" });
  await removeAsset(item.imagePublicId);
  res.json({ success: true, message: "Content deleted" });
};
