import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  name: { type: String, default: "" },
  status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed" },
}, { timestamps: true });

export default mongoose.model("Subscriber", subscriberSchema);
