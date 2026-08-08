const CLOUDINARY_MARKER = "/image/upload/";

export const optimizeImage = (url, width = 800) => {
  if (!url || typeof url !== "string") return "";
  const index = url.indexOf(CLOUDINARY_MARKER);
  if (index === -1) return url;
  const rest = url.slice(index + CLOUDINARY_MARKER.length);
  if (rest.startsWith("w_")) return url;
  return `${url.slice(0, index + CLOUDINARY_MARKER.length)}w_${width},q_auto,f_auto/${rest}`;
};
