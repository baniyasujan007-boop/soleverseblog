import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, default: "site", unique: true },
  siteName: { type: String, default: "SoleVerse" },
  logo: { type: String, default: "" },
  logoPublicId: { type: String, default: "" },
  footerText: { type: String, default: "" },
  seo: { title: String, description: String, keywords: String },
  social: { instagram: String, twitter: String, facebook: String, youtube: String },
  homepage: {
    breakingNews: { enabled: { type: Boolean, default: true }, text: { type: String, default: "" }, backgroundColor: { type: String, default: "#050505" }, textColor: { type: String, default: "#ffffff" }, speed: { type: Number, default: 28 } },
    navigation: { items: { type: [{ label: String, path: String, enabled: { type: Boolean, default: true }, order: Number }], default: [] } },
    sections: { type: [{ id: String, enabled: { type: Boolean, default: true }, order: Number, limit: Number, backgroundColor: String }], default: [] },
    hero: { autoPlay: { type: Boolean, default: true }, sliderSpeed: { type: Number, default: 6000 } },
    newsletter: { enabled: { type: Boolean, default: true }, title: { type: String, default: "" }, subtitle: { type: String, default: "" }, backgroundColor: { type: String, default: "#080808" }, backgroundImage: { type: String, default: "" }, buttonText: { type: String, default: "Subscribe" }, placeholder: { type: String, default: "Enter your email address" } },
    trending: { mode: { type: String, enum: ["manual", "views"], default: "views" }, manualIds: { type: [mongoose.Schema.Types.ObjectId], default: [] } },
    footer: { description: { type: String, default: "" }, copyright: { type: String, default: "" }, quickLinks: { type: [{ label: String, path: String }], default: [] }, categories: { type: [String], default: [] }, contact: { type: String, default: "" } },
  },
}, { timestamps: true });

export default mongoose.model("SiteSettings", siteSettingsSchema);
