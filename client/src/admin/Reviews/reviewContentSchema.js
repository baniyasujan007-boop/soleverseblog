import { BRAND_OPTIONS } from "../Releases/releaseFormConfig";
import { RATING_FIELDS } from "../../utils/review";

export const reviewContentSchema = [
  {
    title: "Basic Information",
    fields: [
      {
        name: "brand",
        label: "Brand",
        type: "select",
        options: BRAND_OPTIONS,
        required: true,
      },
      { name: "model", label: "Model", type: "text" },
      { name: "colorway", label: "Colorway", type: "text" },
      { name: "reviewer", label: "Reviewer", type: "text" },
      { name: "reviewDate", label: "Review Date", type: "date", required: true },
    ],
  },
  {
    title: "Performance Ratings",
    fields: RATING_FIELDS.map((field) => ({
      name: field.name,
      label: `${field.label} (1–10)`,
      type: "number",
      min: 1,
      max: 10,
      step: 0.1,
    })),
  },
  {
    title: "Editorial",
    fields: [
      {
        name: "quickSummary",
        label: "Quick Summary",
        type: "textarea",
        rows: 3,
        required: true,
      },
      { name: "pros", label: "Pros", type: "textarea", rows: 4 },
      { name: "cons", label: "Cons", type: "textarea", rows: 4 },
      { name: "verdict", label: "Verdict", type: "textarea", rows: 5 },
    ],
  },
  {
    title: "Product Information",
    fields: [
      { name: "retailPrice", label: "Retail Price", type: "number", required: true },
      { name: "weight", label: "Weight", type: "text" },
      { name: "bestFor", label: "Best For", type: "text" },
    ],
  },
];
