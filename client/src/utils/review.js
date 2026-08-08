import { formatPrice } from "./release";

export const RATING_FIELDS = [
  { name: "comfort", label: "Comfort" },
  { name: "quality", label: "Quality" },
  { name: "materials", label: "Materials" },
  { name: "fit", label: "Fit" },
  { name: "durability", label: "Durability" },
  { name: "traction", label: "Traction" },
  { name: "breathability", label: "Breathability" },
  { name: "value", label: "Value" },
];

const toScore = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 10) / 10 : null;
};

export const computeOverallRating = (metadata = {}) => {
  const scores = RATING_FIELDS.map((field) => toScore(metadata[field.name])).filter(
    (score) => score !== null,
  );
  if (!scores.length) return null;
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(average * 10) / 10;
};

export const splitLines = (value = "") =>
  String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

export const extractBrands = (reviews = []) => {
  const brands = reviews
    .map((review) => review.brand)
    .filter(Boolean);
  return [...new Set(brands)].sort((a, b) => a.localeCompare(b));
};

export const normalizeReview = (item = {}) => {
  const metadata = item.metadata || {};
  const ratings = RATING_FIELDS.reduce((record, field) => {
    record[field.name] = toScore(metadata[field.name]);
    return record;
  }, {});
  return {
    id: item._id,
    slug: item.slug,
    name: item.title,
    summary: item.summary,
    content: item.content,
    image: item.image,
    featured: Boolean(item.featured),
    brand: metadata.brand || item.category || "SoleVerse",
    model: metadata.model || item.title,
    colorway: metadata.colorway,
    reviewer: metadata.reviewer || item.author?.name || "SoleVerse Desk",
    reviewDate: metadata.reviewDate || item.createdAt,
    retailPrice: formatPrice(metadata.retailPrice ?? metadata.price),
    weight: metadata.weight,
    bestFor: metadata.bestFor,
    quickSummary: metadata.quickSummary,
    pros: metadata.pros,
    cons: metadata.cons,
    verdict: metadata.verdict || item.content,
    ratings,
    overall: computeOverallRating(metadata),
  };
};
