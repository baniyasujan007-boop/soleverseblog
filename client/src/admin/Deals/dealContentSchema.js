import { DEAL_META_FIELDS, DEAL_CATEGORIES, DEAL_AVAILABILITY } from "../../utils/deal";
import { BRAND_OPTIONS, CURRENCY_OPTIONS } from "../Releases/releaseFormConfig";

const F = DEAL_META_FIELDS;

export const dealContentSchema = [
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
        name: F.productCategory,
        label: "Product Category",
        type: "select",
        options: DEAL_CATEGORIES,
      },
    ],
  },
  {
    title: "Pricing",
    fields: [
      { name: F.originalPrice, label: "Original Price", type: "number", min: 0, step: 0.01, required: true },
      { name: F.salePrice, label: "Sale Price", type: "number", min: 0, step: 0.01, required: true },
      {
        name: F.currency,
        label: "Currency",
        type: "select",
        options: CURRENCY_OPTIONS,
      },
      {
        name: F.discountPercentage,
        label: "Discount % (fallback only — auto-calculated from prices when possible)",
        type: "number",
        min: 0,
        max: 100,
        step: 1,
      },
    ],
  },
  {
    title: "Deal Information",
    fields: [
      { name: F.retailer, label: "Retailer", type: "text", required: true },
      { name: F.affiliateUrl, label: "Affiliate URL (used for Get Deal CTA)", type: "url" },
      { name: F.productUrl, label: "Product URL", type: "url" },
      { name: F.couponCode, label: "Coupon Code", type: "text" },
      {
        name: F.availability,
        label: "Availability",
        type: "select",
        options: DEAL_AVAILABILITY,
      },
      { name: F.startDate, label: "Deal Start Date", type: "date" },
      { name: F.expirationDate, label: "Deal Expiration Date", type: "date" },
      { name: F.availableSizes, label: "Available Sizes (comma or line separated)", type: "text" },
    ],
  },
  {
    title: "Editorial",
    fields: [
      { name: F.quickSummary, label: "Quick Summary", type: "textarea", rows: 3 },
      { name: F.whyWeLikeIt, label: "Why We Like It (one per line)", type: "textarea", rows: 4 },
      { name: F.dealNotes, label: "Deal Notes (one per line)", type: "textarea", rows: 3 },
      { name: F.terms, label: "Terms / Conditions", type: "textarea", rows: 3 },
    ],
  },
  {
    title: "SEO",
    fields: [
      { name: F.metaTitle, label: "Meta Title", type: "text" },
      { name: F.metaDescription, label: "Meta Description", type: "textarea", rows: 3 },
      { name: F.ogTitle, label: "Open Graph Title", type: "text" },
      { name: F.ogDescription, label: "Open Graph Description", type: "textarea", rows: 3 },
    ],
  },
];
