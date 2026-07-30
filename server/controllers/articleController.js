import Article from "../models/Article.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import slugify from "slugify";

export const getArticles = async (req, res) => {
  try {
    const sort = req.query.sort || "newest";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const category = req.query.category || "";
    const status = req.query.status || "";

    const query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    const total = await Article.countDocuments(query);

    const articles = await Article.find(query)
      .sort(
        sort === "oldest"
          ? { createdAt: 1 }
          : sort === "az"
            ? { title: 1 }
            : sort === "za"
              ? { title: -1 }
              : { createdAt: -1 },
      )
      .populate("author", "name")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalArticles: total,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "soleverse",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try { return JSON.parse(tags); } catch { return tags.split(",").map((tag) => tag.trim()).filter(Boolean); }
};
// POST /api/articles
export const createArticle = async (req, res) => {
  try {
    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Upload image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Get article data from the request body
    const { title, content, category, featured, status } = req.body;

    // Create article
    const article = await Article.create({
      title,
      slug: slugify(title, {
        lower: true,
        strict: true,
      }),
      content,
      category,
      tags: parseTags(req.body.tags),
      featured: featured === true || featured === "true",
      status: status || "draft",
      author: req.user._id,
      image: result.secure_url,
      imagePublicId: result.public_id,
    });

    await article.populate("author", "name");

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// GET /api/articles/:id
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "name",
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// PUT /api/articles/:id
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const { title, content, category, featured, status } = req.body;
    if (title) { article.title = title; article.slug = slugify(title, { lower: true, strict: true }); }
    if (content !== undefined) article.content = content;
    if (category) article.category = category;
    if (featured !== undefined) article.featured = featured === true || featured === "true";
    if (status !== undefined) article.status = status;
    if (req.body.tags !== undefined) article.tags = parseTags(req.body.tags);
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      if (article.imagePublicId) await cloudinary.uploader.destroy(article.imagePublicId);
      article.image = result.secure_url;
      article.imagePublicId = result.public_id;
    }
    await article.save();
    await article.populate("author", "name");

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// DELETE /api/articles/:id
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    if (article.imagePublicId) await cloudinary.uploader.destroy(article.imagePublicId);

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getFeaturedArticles = async (req, res) => {
  try {
    const articles = await Article.find({ featured: true })
      .sort({ createdAt: -1 }).populate("author", "name");

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
