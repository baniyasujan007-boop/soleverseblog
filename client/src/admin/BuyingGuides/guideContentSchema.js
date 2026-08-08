import {
  DIFFICULTY_LEVELS,
  GUIDE_CATEGORIES,
  GUIDE_META_FIELDS,
  GUIDE_TYPES,
} from "../../utils/guide";
import { BRAND_OPTIONS } from "../Releases/releaseFormConfig";

const F = GUIDE_META_FIELDS;

export const guideContentSchema = [
  {
    title: "Basic Information",
    fields: [
      {
        name: F.category,
        label: "Category",
        type: "select",
        options: GUIDE_CATEGORIES,
        required: true,
      },
      {
        name: F.guideType,
        label: "Guide Type",
        type: "select",
        options: GUIDE_TYPES,
      },
      { name: F.author, label: "Author", type: "text" },
      { name: F.publishedDate, label: "Published Date", type: "date" },
      {
        name: F.readingTime,
        label: "Reading Time (e.g. 8 min read)",
        type: "text",
      },
    ],
  },
  {
    title: "Sneaker Information",
    fields: [
      {
        name: F.brand,
        label: "Brand",
        type: "select",
        options: BRAND_OPTIONS,
      },
      { name: F.model, label: "Model", type: "text" },
      { name: F.colorway, label: "Colorway", type: "text" },
      { name: F.productCategory, label: "Product Category", type: "text" },
    ],
  },
  {
    title: "Guide Information",
    fields: [
      {
        name: F.difficulty,
        label: "Difficulty",
        type: "select",
        options: DIFFICULTY_LEVELS,
      },
      { name: F.bestFor, label: "Best For", type: "text" },
      {
        name: F.keyTakeaways,
        label: "Key Takeaways (one per line)",
        type: "textarea",
        rows: 4,
      },
      {
        name: F.recommendedModels,
        label: "Recommended Models (one per line)",
        type: "textarea",
        rows: 4,
      },
      {
        name: F.relatedTopics,
        label: "Related Topics (one per line)",
        type: "textarea",
        rows: 3,
      },
    ],
  },
  {
    title: "SEO",
    fields: [
      { name: F.metaTitle, label: "Meta Title", type: "text" },
      {
        name: F.metaDescription,
        label: "Meta Description",
        type: "textarea",
        rows: 3,
      },
      { name: F.ogTitle, label: "Open Graph Title", type: "text" },
      {
        name: F.ogDescription,
        label: "Open Graph Description",
        type: "textarea",
        rows: 3,
      },
    ],
  },
];
