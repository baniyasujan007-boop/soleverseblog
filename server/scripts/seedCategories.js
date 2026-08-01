import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import slugify from "slugify";
import { fileURLToPath } from "url";
import Category from "../models/Category.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(scriptDirectory, "../.env"), quiet: true });

const categoryNames = [
  "Releases",
  "Collaborations",
  "Industry",
  "Culture",
  "Brand News",
  "Reviews",
  "Buying Guides",
  "Sneaker News",
];

async function seedCategories() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const results = await Promise.all(
    categoryNames.map(async (name) => {
      const result = await Category.collection.updateOne(
        { name },
        { $setOnInsert: { name, slug: slugify(name, { lower: true, strict: true }) } },
        { upsert: true },
      );
      return { name, inserted: result.upsertedCount === 1 };
    }),
  );
  const inserted = results.filter((result) => result.inserted).map((result) => result.name);
  const existing = results.filter((result) => !result.inserted).map((result) => result.name);

  console.log(`Inserted categories: ${inserted.join(", ") || "none"}`);
  console.log(`Existing categories: ${existing.join(", ") || "none"}`);
}

seedCategories()
  .catch((error) => {
    console.error("Category seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
