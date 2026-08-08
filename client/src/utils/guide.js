import { splitLines } from "./review";

export const GUIDE_META_FIELDS = {
  category: "category",
  guideType: "guideType",
  author: "author",
  publishedDate: "publishedDate",
  readingTime: "readingTime",
  brand: "brand",
  model: "model",
  colorway: "colorway",
  productCategory: "productCategory",
  difficulty: "difficulty",
  bestFor: "bestFor",
  keyTakeaways: "keyTakeaways",
  recommendedModels: "recommendedModels",
  relatedTopics: "relatedTopics",
  metaTitle: "metaTitle",
  metaDescription: "metaDescription",
  ogTitle: "ogTitle",
  ogDescription: "ogDescription",
};

export const GUIDE_CATEGORIES = [
  "Buying Guides",
  "Sneaker Care",
  "Beginner Basics",
  "Education & History",
  "Style & Culture",
];

export const GUIDE_TYPES = [
  "Buying",
  "Care & Maintenance",
  "Beginner",
  "Education & History",
  "Style",
];

export const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const estimateReadingTime = (content = "", fallback = "") => {
  if (fallback) return fallback;
  const words = String(content).trim().split(/\s+/).filter(Boolean).length;
  if (!words) return "";
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

export const normalizeGuide = (item = {}) => {
  const metadata = item.metadata || {};
  return {
    id: item._id,
    slug: item.slug,
    name: item.title,
    summary: item.summary,
    content: item.content,
    image: item.image,
    featured: Boolean(item.featured),
    category:
      metadata[GUIDE_META_FIELDS.category] || item.category || "Guide",
    guideType: metadata[GUIDE_META_FIELDS.guideType],
    author: metadata[GUIDE_META_FIELDS.author] || item.author?.name,
    publishedDate:
      metadata[GUIDE_META_FIELDS.publishedDate] || item.createdAt,
    readingTime: estimateReadingTime(
      item.content,
      metadata[GUIDE_META_FIELDS.readingTime],
    ),
    brand: metadata[GUIDE_META_FIELDS.brand] || item.category,
    model: metadata[GUIDE_META_FIELDS.model],
    colorway: metadata[GUIDE_META_FIELDS.colorway],
    productCategory: metadata[GUIDE_META_FIELDS.productCategory],
    difficulty: metadata[GUIDE_META_FIELDS.difficulty],
    bestFor: metadata[GUIDE_META_FIELDS.bestFor],
    keyTakeaways: splitLines(metadata[GUIDE_META_FIELDS.keyTakeaways]),
    recommendedModels: splitLines(
      metadata[GUIDE_META_FIELDS.recommendedModels],
    ),
    relatedTopics: splitLines(metadata[GUIDE_META_FIELDS.relatedTopics]),
    metaTitle: metadata[GUIDE_META_FIELDS.metaTitle],
    metaDescription: metadata[GUIDE_META_FIELDS.metaDescription],
  };
};

export const extractGuideCategories = (guides = []) =>
  [...new Set(guides.map((guide) => guide.category).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );

export const extractGuideBrands = (guides = []) =>
  [...new Set(guides.map((guide) => guide.brand).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );

export const sameBrand = (value, brand) => {
  if (!value || !brand) return false;
  return value.toLowerCase() === brand.toLowerCase();
};

const normalizeModel = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9]/g, "");

export const findReleaseForModel = (model, releases = []) => {
  const key = normalizeModel(model);
  if (!key) return null;
  return (
    releases.find((release) => {
      const a = normalizeModel(release.model);
      const b = normalizeModel(release.name);
      return (
        a === key ||
        b === key ||
        (a && (a.includes(key) || key.includes(a))) ||
        (b && (b.includes(key) || key.includes(b)))
      );
    }) || null
  );
};
