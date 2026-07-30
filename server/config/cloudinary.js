import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// This module is imported while Express is initialized. Load the server .env
// here, before reading any Cloudinary credentials, rather than relying on code
// in server.js that runs only after its static imports have been evaluated.
const configDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(configDirectory, "../.env"), quiet: true });

const requiredVariables = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required Cloudinary environment variables: ${missingVariables.join(", ")}`,
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
