import Author from "../models/Author.js";
import Media from "../models/Media.js";
import Subscriber from "../models/Subscriber.js";
import SiteSettings from "../models/SiteSettings.js";
import Article from "../models/Article.js";
import ContentItem from "../models/ContentItem.js";
import { removeAsset, uploadBuffer } from "../utils/cloudinaryUpload.js";

const page = (req) => Math.max(Number(req.query.page) || 1, 1);
const objectValue = (value) => { if (!value) return {}; if (typeof value === "object") return value; try { return JSON.parse(value); } catch { return {}; } };
const list = async (Model, req, res, searchFields = ["name"]) => {
  const term = req.query.search?.trim(); const query = term ? { $or: searchFields.map((field) => ({ [field]: { $regex: term, $options: "i" } })) } : {};
  const current = page(req); const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
  const [total, data] = await Promise.all([Model.countDocuments(query), Model.find(query).sort({ createdAt: -1 }).skip((current - 1) * limit).limit(limit)]);
  res.json({ success: true, data, page: current, total, count: data.length, totalPages: Math.ceil(total / limit) });
};

export const listAuthors = (req, res) => list(Author, req, res);
export const createAuthor = async (req, res) => { const payload = { name: req.body.name, bio: req.body.bio || "" }; if (req.file) { const asset = await uploadBuffer(req.file.buffer, "soleverse/authors"); payload.avatar = asset.secure_url; payload.avatarPublicId = asset.public_id; } const author = await Author.create(payload); res.status(201).json({ success: true, data: author }); };
export const updateAuthor = async (req, res) => { const author = await Author.findById(req.params.id); if (!author) return res.status(404).json({ success: false, message: "Author not found" }); author.name = req.body.name; author.bio = req.body.bio || ""; author.social = req.body.social || {}; if (req.file) { const asset = await uploadBuffer(req.file.buffer, "soleverse/authors"); await removeAsset(author.avatarPublicId); author.avatar = asset.secure_url; author.avatarPublicId = asset.public_id; } await author.save(); res.json({ success: true, data: author }); };
export const deleteAuthor = async (req, res) => { const author = await Author.findByIdAndDelete(req.params.id); if (!author) return res.status(404).json({ success: false, message: "Author not found" }); await removeAsset(author.avatarPublicId); res.json({ success: true, message: "Author deleted" }); };

export const listMedia = (req, res) => list(Media, req, res, ["alt", "format"]);
export const uploadMedia = async (req, res) => { if (!req.file) return res.status(400).json({ success: false, message: "An image file is required" }); const asset = await uploadBuffer(req.file.buffer, "soleverse/media"); const media = await Media.create({ url: asset.secure_url, publicId: asset.public_id, alt: req.body.alt || "", format: asset.format, bytes: asset.bytes, uploadedBy: req.user._id }); res.status(201).json({ success: true, data: media }); };
export const deleteMedia = async (req, res) => { const media = await Media.findByIdAndDelete(req.params.id); if (!media) return res.status(404).json({ success: false, message: "Media not found" }); await removeAsset(media.publicId); res.json({ success: true, message: "Media deleted" }); };

export const listSubscribers = (req, res) => list(Subscriber, req, res, ["email", "name"]);
export const createSubscriber = async (req, res) => { const subscriber = await Subscriber.create({ email: req.body.email, name: req.body.name || "" }); res.status(201).json({ success: true, data: subscriber }); };
export const updateSubscriber = async (req, res) => { const subscriber = await Subscriber.findByIdAndUpdate(req.params.id, { status: req.body.status, name: req.body.name }, { new: true, runValidators: true }); if (!subscriber) return res.status(404).json({ success: false, message: "Subscriber not found" }); res.json({ success: true, data: subscriber }); };
export const deleteSubscriber = async (req, res) => { const subscriber = await Subscriber.findByIdAndDelete(req.params.id); if (!subscriber) return res.status(404).json({ success: false, message: "Subscriber not found" }); res.json({ success: true, message: "Subscriber deleted" }); };

export const getSettings = async (_req, res) => { const settings = await SiteSettings.findOneAndUpdate({ key: "site" }, {}, { new: true, upsert: true, setDefaultsOnInsert: true }); res.json({ success: true, data: settings }); };
export const updateSettings = async (req, res) => { const update = { siteName: req.body.siteName, footerText: req.body.footerText, seo: objectValue(req.body.seo), social: objectValue(req.body.social) }; if (req.body.homepage !== undefined) update.homepage = objectValue(req.body.homepage); if (req.file) { const existing = await SiteSettings.findOne({ key: "site" }); const asset = await uploadBuffer(req.file.buffer, "soleverse/settings"); if (existing?.logoPublicId) await removeAsset(existing.logoPublicId); update.logo = asset.secure_url; update.logoPublicId = asset.public_id; } const settings = await SiteSettings.findOneAndUpdate({ key: "site" }, update, { new: true, upsert: true, setDefaultsOnInsert: true }); res.json({ success: true, data: settings }); };

const defaultSections = ["hero", "latestNews", "latestReleases", "topBrands", "newsletter", "trending"].map((id, order) => ({ id, enabled: true, order, limit: id === "trending" ? 5 : id === "latestNews" ? 4 : 6 }));
const defaultNavigation = [
  ["Home", "/"], ["News", "/news"], ["Releases", "/releases"], ["Reviews", "/reviews"],
  ["Brands", "/brands"], ["Guides", "/guides"], ["Deals", "/deals"], ["Calendar", "/calendar"],
].map(([label, path], order) => ({ label, path, enabled: true, order }));
export const getHomepage = async (_req, res) => {
  const settings = await SiteSettings.findOneAndUpdate({ key: "site" }, {}, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
  const homepage = settings.homepage || {}; const sections = homepage.sections?.length ? homepage.sections : defaultSections;
  const navigation = homepage.navigation?.items?.length ? homepage.navigation : { items: defaultNavigation };
  const limitFor = (id, fallback) => sections.find((section) => section.id === id)?.limit || fallback;
  const [heroSlides, latestNews, releases, brands] = await Promise.all([
    // Include legacy Home records without a section so previously uploaded hero
    // content remains visible after introducing the dedicated Hero Slides page.
    ContentItem.find({ type: "home", status: "published", $or: [{ section: "hero" }, { section: "" }, { section: { $exists: false } }] }).sort({ "metadata.displayOrder": 1, createdAt: -1 }).lean(),
    Article.find({ status: "published" }).sort({ createdAt: -1 }).limit(limitFor("latestNews", 4)).populate("author", "name").lean(),
    ContentItem.find({ type: "release", status: "published" }).sort({ "metadata.releaseDate": 1, "metadata.displayOrder": 1 }).limit(limitFor("latestReleases", 6)).lean(),
    ContentItem.find({ type: "brand", status: "published" }).sort({ "metadata.displayOrder": 1, title: 1 }).limit(limitFor("topBrands", 6)).lean(),
  ]);
  const trendingQuery = homepage.trending?.mode === "manual" && homepage.trending?.manualIds?.length ? { _id: { $in: homepage.trending.manualIds }, status: "published" } : { status: "published" };
  const trending = await Article.find(trendingQuery).sort(homepage.trending?.mode === "manual" ? { createdAt: -1 } : { views: -1, createdAt: -1 }).limit(limitFor("trending", 5)).populate("author", "name").lean();
  res.json({ success: true, data: { settings: { ...settings, homepage: { ...homepage, navigation, sections } }, heroSlides, latestNews, releases, brands, trending } });
};
export const subscribePublic = async (req, res) => { const email = req.body.email?.trim().toLowerCase(); if (!email) return res.status(400).json({ success: false, message: "Email is required" }); const subscriber = await Subscriber.findOneAndUpdate({ email }, { email, name: req.body.name || "", status: "subscribed" }, { upsert: true, new: true, setDefaultsOnInsert: true }); res.status(201).json({ success: true, data: subscriber }); };
