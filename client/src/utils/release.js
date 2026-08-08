export const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "number") {
    const amount = Number.isInteger(value)
      ? value.toLocaleString("en-US")
      : value.toFixed(2);
    return `$${amount}`;
  }
  const text = String(value).trim();
  if (!text) return "";
  return text.startsWith("$") ? text : `$${text}`;
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const normalizeRelease = (item = {}) => {
  const metadata = item.metadata || {};
  const retailPrice = toNumber(metadata.retailPrice ?? metadata.price);
  return {
    id: item._id,
    slug: item.slug,
    name: item.title,
    image: item.image,
    summary: item.summary,
    content: item.content,
    featured: Boolean(item.featured),
    category: item.category,
    brand: metadata.brand || item.category || "SoleVerse",
    model: metadata.model,
    colorway: metadata.colorway,
    sku: metadata.sku || metadata.styleCode,
    styleCode: metadata.styleCode,
    releaseType: metadata.releaseType,
    availability: metadata.availability,
    region: metadata.region,
    currency: metadata.currency || "USD",
    retailPrice,
    price: formatPrice(metadata.retailPrice ?? metadata.price),
    releaseDate: metadata.releaseDate,
    designer: metadata.designer,
    materials: metadata.materials,
    technology: metadata.technology,
    sizes: metadata.sizes,
    metaTitle: metadata.metaTitle,
    metaDescription: metadata.metaDescription,
  };
};
