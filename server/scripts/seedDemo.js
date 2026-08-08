import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import ContentItem from "../models/ContentItem.js";
import Article from "../models/Article.js";
import User from "../models/User.js";
import SeedRecord from "../models/SeedRecord.js";
import { ALL_DEMO, SEED_SOURCE } from "./demoData.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(scriptDirectory, "../.env"), quiet: true });

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const CLEAR = args.includes("--clear");

const DEV_EDITOR_EMAIL = "editor@soleverse.demo";
const EXISTING_EDITOR_EMAIL = "sujan@gmail.com";

const result = () => ({
  inserted: [],
  updated: [],
  skipped: [],
  get totals() {
    return { inserted: this.inserted.length, updated: this.updated.length, skipped: this.skipped.length };
  },
});

const countsByType = (list) =>
  list.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

const safeConnect = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  await mongoose.connect(process.env.MONGO_URI);
};

const resolveAuthor = async () => {
  const existing = await User.findOne({ email: EXISTING_EDITOR_EMAIL }).select("_id").lean();
  if (existing) return existing._id;
  const dev = await User.findOne({ email: DEV_EDITOR_EMAIL }).select("_id").lean();
  if (dev) return dev._id;
  const password = crypto.randomBytes(24).toString("hex");
  const user = await User.create({
    name: "SoleVerse Editorial",
    email: DEV_EDITOR_EMAIL,
    password: await bcrypt.hash(password, 10),
    role: "user",
  });
  console.log(`Created development editor user ${DEV_EDITOR_EMAIL} (password not printed).`);
  return user._id;
};

const upsertContentItem = async (doc, authorId, stats, dryRun) => {
  const existing = await ContentItem.findOne({ type: doc.type, slug: doc.slug }).lean();
  const isSeeded = existing?.metadata?.seedSource === SEED_SOURCE;
  if (existing && !isSeeded) {
    stats.skipped.push(`${doc.type}:${doc.slug}`);
    return;
  }
  const payload = {
    ...doc,
    author: authorId,
    status: "published",
    metadata: { ...doc.metadata, seedSource: SEED_SOURCE },
  };
  if (dryRun) {
    (existing ? stats.updated : stats.inserted).push(`${doc.type}:${doc.slug}`);
    return;
  }
  if (existing) {
    await ContentItem.updateOne({ _id: existing._id }, { $set: payload });
    stats.updated.push(`${doc.type}:${doc.slug}`);
  } else {
    await ContentItem.create(payload);
    stats.inserted.push(`${doc.type}:${doc.slug}`);
  }
};

const isSeededArticle = async (slug) => Boolean(await SeedRecord.exists({ kind: "article", slug }));

const upsertArticle = async (doc, authorId, stats, dryRun) => {
  const existing = await Article.findOne({ slug: doc.slug }).lean();
  const seeded = existing ? await isSeededArticle(doc.slug) : false;
  if (existing && !seeded) {
    stats.skipped.push(`article:${doc.slug}`);
    return;
  }
  const payload = { ...doc, author: authorId, status: "published" };
  if (dryRun) {
    (existing ? stats.updated : stats.inserted).push(`article:${doc.slug}`);
    return;
  }
  if (existing) {
    await Article.updateOne({ _id: existing._id }, { $set: payload });
    stats.updated.push(`article:${doc.slug}`);
  } else {
    await Article.create(payload);
    stats.inserted.push(`article:${doc.slug}`);
  }
  await SeedRecord.updateOne({ kind: "article", slug: doc.slug }, { $set: { kind: "article", slug: doc.slug } }, { upsert: true });
};

const runSeed = async (dryRun) => {
  const authorId = await resolveAuthor();
  const stats = result();
  const groups = [
    ["brands", ALL_DEMO.brands],
    ["releases", ALL_DEMO.releases],
    ["reviews", ALL_DEMO.reviews],
    ["guides", ALL_DEMO.guides],
    ["deals", ALL_DEMO.deals],
    ["calendar", ALL_DEMO.calendar],
  ];
  for (const [label, items] of groups) {
    for (const item of items) {
      await upsertContentItem(item, authorId, stats, dryRun);
    }
  }
  for (const article of ALL_DEMO.articles) {
    await upsertArticle(article, authorId, stats, dryRun);
  }
  return stats;
};

const runClear = async (dryRun) => {
  const seededContentQuery = { "metadata.seedSource": SEED_SOURCE };
  const seededArticleSlugs = (
    await SeedRecord.find({ kind: "article" }).select("slug").lean()
  ).map((record) => record.slug);
  const seededArticleQuery = seededArticleSlugs.length
    ? { slug: { $in: seededArticleSlugs } }
    : { _id: null };

  if (dryRun) {
    const contentItems = await ContentItem.countDocuments(seededContentQuery);
    const articles = await Article.countDocuments(seededArticleQuery);
    const records = await SeedRecord.countDocuments({ kind: "article" });
    console.log(`[dry-run] Would remove ${contentItems} seeded content items, ${articles} seeded articles, ${records} tracking records.`);
    return;
  }

  const contentResult = await ContentItem.deleteMany(seededContentQuery);
  const articleResult = await Article.deleteMany(seededArticleQuery);
  await SeedRecord.deleteMany({ kind: "article" });
  console.log(`Removed ${contentResult.deletedCount} seeded content items.`);
  console.log(`Removed ${articleResult.deletedCount} seeded articles.`);
  console.log("Cleared demo seed tracking records.");
};

const printStats = (label, stats) => {
  console.log(`\n=== ${label} ===`);
  console.log(`Inserted: ${stats.totals.inserted}`);
  console.log(`Updated: ${stats.totals.updated}`);
  console.log(`Skipped (real content with same slug): ${stats.totals.skipped}`);
  if (stats.inserted.length) {
    console.log(`\nInserted (${stats.inserted.length}):`);
    console.log(" " + JSON.stringify(countsByType(stats.inserted), null, 1));
  }
  if (stats.updated.length) {
    console.log(`\nUpdated (${stats.updated.length}):`);
    console.log(" " + JSON.stringify(countsByType(stats.updated), null, 1));
  }
  if (stats.skipped.length) {
    console.log("\nSkipped (slug owned by real content):");
    stats.skipped.forEach((slug) => console.log("  - " + slug));
  }
};

const main = async () => {
  await safeConnect();
  if (CLEAR) {
    console.log(DRY_RUN ? "Running clear in dry-run mode..." : "Clearing demo seed data...");
    await runClear(DRY_RUN);
  } else {
    const label = DRY_RUN ? "DRY RUN — no changes written" : "Seeding demo data";
    console.log(`${label}\nSeed source: ${SEED_SOURCE}`);
    const stats = await runSeed(DRY_RUN);
    printStats("Demo data summary", stats);
  }
  console.log("\nDone.");
};

main()
  .catch((error) => {
    console.error("Demo seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
