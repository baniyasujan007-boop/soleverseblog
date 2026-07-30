import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  avatarPublicId: { type: String, default: "" },
  social: { instagram: String, twitter: String, website: String },
}, { timestamps: true });

export default mongoose.model("Author", authorSchema);
