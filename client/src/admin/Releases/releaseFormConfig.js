export const BRAND_OPTIONS = [
  "Nike",
  "Jordan",
  "Adidas",
  "New Balance",
  "ASICS",
  "Puma",
  "Converse",
  "Reebok",
  "Vans",
  "Other",
];

export const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "JPY", "INR"];

export const REGION_OPTIONS = [
  "Worldwide",
  "United States",
  "Europe",
  "Asia",
  "India",
  "Japan",
];

export const releaseContentSchema = [
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
      { name: "sku", label: "SKU / Style Code", type: "text" },
    ],
  },
  {
    title: "Release Information",
    fields: [
      { name: "releaseDate", label: "Release Date", type: "date", required: true },
      { name: "retailPrice", label: "Retail Price", type: "number", required: true },
      {
        name: "currency",
        label: "Currency",
        type: "select",
        options: CURRENCY_OPTIONS,
      },
      {
        name: "region",
        label: "Region",
        type: "select",
        options: REGION_OPTIONS,
      },
      { name: "designer", label: "Designer", type: "text" },
      { name: "materials", label: "Materials", type: "text" },
      { name: "technology", label: "Technology", type: "text" },
      { name: "sizes", label: "Available Sizes", type: "text" },
    ],
  },
];
