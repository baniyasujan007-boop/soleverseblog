import { CALENDAR_META_FIELDS, CALENDAR_CATEGORIES, RELEASE_TYPES, CALENDAR_REGIONS, CALENDAR_AVAILABILITY } from "../../utils/calendar";
import { BRAND_OPTIONS, CURRENCY_OPTIONS } from "../Releases/releaseFormConfig";

const F = CALENDAR_META_FIELDS;

export const calendarContentSchema = [
  {
    title: "Basic Information",
    fields: [
      {
        name: F.brand,
        label: "Brand",
        type: "select",
        options: BRAND_OPTIONS,
        required: true,
      },
      { name: F.model, label: "Model", type: "text" },
      { name: F.colorway, label: "Colorway", type: "text" },
      {
        name: F.category,
        label: "Category",
        type: "select",
        options: CALENDAR_CATEGORIES,
      },
      {
        name: F.sku,
        label: "SKU / Style Code",
        type: "text",
      },
    ],
  },
  {
    title: "Release Information",
    fields: [
      { name: F.releaseDate, label: "Release Date", type: "date", required: true },
      {
        name: F.releaseType,
        label: "Release Type",
        type: "select",
        options: RELEASE_TYPES,
      },
      {
        name: F.availability,
        label: "Availability",
        type: "select",
        options: CALENDAR_AVAILABILITY,
      },
      {
        name: F.region,
        label: "Region",
        type: "select",
        options: CALENDAR_REGIONS,
      },
    ],
  },
  {
    title: "Pricing",
    fields: [
      { name: F.retailPrice, label: "Retail Price", type: "number", min: 0, step: 0.01 },
      {
        name: F.currency,
        label: "Currency",
        type: "select",
        options: CURRENCY_OPTIONS,
      },
    ],
  },
  {
    title: "Editorial",
    fields: [
      { name: F.description, label: "Description", type: "textarea", rows: 4 },
    ],
  },
  {
    title: "SEO",
    fields: [
      { name: F.metaTitle, label: "Meta Title", type: "text" },
      { name: F.metaDescription, label: "Meta Description", type: "textarea", rows: 3 },
    ],
  },
];
