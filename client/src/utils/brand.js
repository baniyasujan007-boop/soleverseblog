import { splitLines } from "./review";

export const normalizeBrand = (item = {}) => {
  const metadata = item.metadata || {};
  return {
    id: item._id,
    slug: item.slug,
    name: item.title,
    summary: item.summary,
    image: item.image,
    featured: Boolean(item.featured),
    country: metadata.country,
    founded: metadata.founded,
    founder: metadata.founder,
    headquarters: metadata.headquarters,
    website: metadata.website,
    shortDescription: metadata.shortDescription,
    history: metadata.history,
    mission: metadata.mission,
    innovation: metadata.innovation,
    legacy: metadata.legacy,
    primaryColor: metadata.primaryColor,
    secondaryColor: metadata.secondaryColor,
    technologies: splitLines(metadata.popularTechnologies),
    signatureModels: splitLines(metadata.signatureModels),
    athletes: splitLines(metadata.athletes),
    metaTitle: metadata.metaTitle,
    metaDescription: metadata.metaDescription,
  };
};

export const countByBrand = (items = []) =>
  items.reduce((record, item) => {
    const key = item.brand || "Other";
    record[key] = (record[key] || 0) + 1;
    return record;
  }, {});
