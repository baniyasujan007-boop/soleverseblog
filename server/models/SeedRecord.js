import mongoose from "mongoose";

const seedRecordSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true, enum: ["article"] },
    slug: { type: String, required: true },
  },
  { timestamps: true },
);

seedRecordSchema.index({ kind: 1, slug: 1 }, { unique: true });

export default mongoose.model("SeedRecord", seedRecordSchema);
