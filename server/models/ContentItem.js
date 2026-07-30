import mongoose from "mongoose";
import slugify from "slugify";

export const contentTypes = ["home", "release", "review", "brand", "guide", "deal", "calendar"];

const contentItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: contentTypes, required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    category: { type: String, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    featured: { type: Boolean, default: false, index: true },
    section: { type: String, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

contentItemSchema.index({ type: 1, slug: 1 }, { unique: true });
contentItemSchema.pre("validate", function createSlug() {
  if (!this.slug && this.title) this.slug = slugify(this.title, { lower: true, strict: true });
});

export default mongoose.model("ContentItem", contentItemSchema);
