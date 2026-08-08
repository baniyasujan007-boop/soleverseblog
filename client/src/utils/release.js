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

export const normalizeRelease = (item = {}) => {
  const metadata = item.metadata || {};
  return {
    id: item._id,
    slug: item.slug,
    name: item.title,
    image: item.image,
    summary: item.summary,
    brand: metadata.brand || item.category || "SoleVerse",
    price: formatPrice(metadata.retailPrice ?? metadata.price),
    releaseDate: metadata.releaseDate,
    region: metadata.region,
    colorway: metadata.colorway,
  };
};
