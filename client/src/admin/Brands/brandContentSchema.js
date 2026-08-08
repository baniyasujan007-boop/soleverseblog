export const brandContentSchema = [
  {
    title: "Basic Information",
    fields: [
      { name: "country", label: "Country", type: "text" },
      { name: "founded", label: "Founded (Year)", type: "number", min: 1800, max: 2100, step: 1 },
      { name: "founder", label: "Founder", type: "text" },
      { name: "headquarters", label: "Headquarters", type: "text" },
      { name: "website", label: "Official Website", type: "url" },
    ],
  },
  {
    title: "Brand Overview",
    fields: [
      { name: "shortDescription", label: "Short Description", type: "textarea", rows: 3 },
      { name: "history", label: "History", type: "textarea", rows: 6 },
      { name: "mission", label: "Mission", type: "textarea", rows: 4 },
      { name: "innovation", label: "Innovation", type: "textarea", rows: 4 },
      { name: "legacy", label: "Legacy", type: "textarea", rows: 4 },
    ],
  },
  {
    title: "Brand Identity",
    fields: [
      { name: "primaryColor", label: "Primary Color", type: "color" },
      { name: "secondaryColor", label: "Secondary Color", type: "color" },
      { name: "popularTechnologies", label: "Popular Technologies", type: "textarea", rows: 4 },
      { name: "signatureModels", label: "Signature Models", type: "textarea", rows: 4 },
      { name: "athletes", label: "Athletes / Collaborations", type: "textarea", rows: 4 },
    ],
  },
  {
    title: "SEO",
    fields: [
      { name: "metaTitle", label: "Meta Title", type: "text" },
      { name: "metaDescription", label: "Meta Description", type: "textarea", rows: 3 },
      { name: "ogTitle", label: "Open Graph Title", type: "text" },
      { name: "ogDescription", label: "Open Graph Description", type: "textarea", rows: 3 },
    ],
  },
];
