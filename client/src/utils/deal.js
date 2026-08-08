import { splitLines } from "./review";

export const DEAL_META_FIELDS = {
  brand: "brand",
  model: "model",
  colorway: "colorway",
  productCategory: "productCategory",
  originalPrice: "originalPrice",
  salePrice: "salePrice",
  currency: "currency",
  discountPercentage: "discountPercentage",
  retailer: "retailer",
  affiliateUrl: "affiliateUrl",
  productUrl: "productUrl",
  couponCode: "couponCode",
  availability: "availability",
  startDate: "startDate",
  expirationDate: "expirationDate",
  availableSizes: "availableSizes",
  quickSummary: "quickSummary",
  whyWeLikeIt: "whyWeLikeIt",
  dealNotes: "dealNotes",
  terms: "terms",
  metaTitle: "metaTitle",
  metaDescription: "metaDescription",
  ogTitle: "ogTitle",
  ogDescription: "ogDescription",
};

export const DEAL_CATEGORIES = [
  "Running",
  "Basketball",
  "Lifestyle",
  "Skateboarding",
  "Trail / Outdoor",
  "Training",
  "Other",
];

export const DEAL_AVAILABILITY = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
  "Preorder",
];

const CURRENCY_SYMBOLS = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", INR: "₹" };

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const parseDealDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Discount is always calculated from the real prices when both are valid.
 * Returns null when the prices cannot produce a valid discount.
 */
export const computeDiscountPercentage = (originalPrice, salePrice) => {
  const original = toNumber(originalPrice);
  const sale = toNumber(salePrice);
  if (original === null || sale === null || original <= 0) return null;
  if (sale > original) return null;
  if (original === sale) return 0;
  return Math.round((1 - sale / original) * 100);
};

const DAY = 24 * 60 * 60 * 1000;

export const isDealExpired = (expiration, now = Date.now()) => {
  if (!expiration) return false;
  const time = new Date(expiration).getTime();
  if (Number.isNaN(time)) return false;
  return time < now;
};

export const isDealEndingSoon = (expiration, now = Date.now()) => {
  if (!expiration) return false;
  const time = new Date(expiration).getTime();
  if (Number.isNaN(time)) return false;
  return time >= now && time - now <= 7 * DAY;
};

export const formatDealPrice = (value, currency = "USD") => {
  const number = toNumber(value);
  if (number === null) return "";
  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  const amount = Number.isInteger(number)
    ? number.toLocaleString("en-US")
    : number.toFixed(2);
  return `${symbol}${amount}`;
};

export const getDealUrl = (deal) =>
  deal?.affiliateUrl || deal?.productUrl || null;

const splitSizes = (value = "") =>
  String(value)
    .split(/[\n,]+/)
    .map((size) => size.trim())
    .filter(Boolean);

export const normalizeDeal = (item = {}) => {
  const metadata = item.metadata || {};
  const originalPrice = toNumber(metadata[DEAL_META_FIELDS.originalPrice]);
  const salePrice = toNumber(metadata[DEAL_META_FIELDS.salePrice]);
  const storedDiscount = toNumber(
    metadata[DEAL_META_FIELDS.discountPercentage],
  );
  const calculatedDiscount = computeDiscountPercentage(
    originalPrice,
    salePrice,
  );
  let discountPercentage = null;
  if (calculatedDiscount !== null) {
    discountPercentage = calculatedDiscount;
  } else if (storedDiscount !== null && storedDiscount > 0 && storedDiscount <= 100) {
    discountPercentage = storedDiscount;
  }
  const expiration = parseDealDate(metadata[DEAL_META_FIELDS.expirationDate]);
  const startDate = parseDealDate(metadata[DEAL_META_FIELDS.startDate]);
  return {
    id: item._id,
    slug: item.slug,
    name: item.title,
    summary: item.summary,
    content: item.content,
    image: item.image,
    featured: Boolean(item.featured),
    createdAt: item.createdAt,
    brand: metadata[DEAL_META_FIELDS.brand] || item.category || "SoleVerse",
    model: metadata[DEAL_META_FIELDS.model],
    colorway: metadata[DEAL_META_FIELDS.colorway],
    productCategory: metadata[DEAL_META_FIELDS.productCategory] || item.category,
    originalPrice,
    salePrice,
    currency: metadata[DEAL_META_FIELDS.currency] || "USD",
    discountPercentage,
    retailer: metadata[DEAL_META_FIELDS.retailer],
    affiliateUrl: metadata[DEAL_META_FIELDS.affiliateUrl],
    productUrl: metadata[DEAL_META_FIELDS.productUrl],
    couponCode: metadata[DEAL_META_FIELDS.couponCode],
    availability: metadata[DEAL_META_FIELDS.availability],
    startDate,
    expiration,
    availableSizes: splitSizes(metadata[DEAL_META_FIELDS.availableSizes]),
    quickSummary: metadata[DEAL_META_FIELDS.quickSummary],
    whyWeLikeIt: splitLines(metadata[DEAL_META_FIELDS.whyWeLikeIt]),
    dealNotes: splitLines(metadata[DEAL_META_FIELDS.dealNotes]),
    terms: metadata[DEAL_META_FIELDS.terms],
    metaTitle: metadata[DEAL_META_FIELDS.metaTitle],
    metaDescription: metadata[DEAL_META_FIELDS.metaDescription],
    ogTitle: metadata[DEAL_META_FIELDS.ogTitle],
    ogDescription: metadata[DEAL_META_FIELDS.ogDescription],
    expired: isDealExpired(expiration),
    endingSoon: isDealEndingSoon(expiration),
  };
};

export const extractDealBrands = (deals = []) =>
  [...new Set(deals.map((deal) => deal.brand).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );

export const extractDealRetailers = (deals = []) =>
  [...new Set(deals.map((deal) => deal.retailer).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
