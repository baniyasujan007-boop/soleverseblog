import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadBuffer = (buffer, folder = "soleverse") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => (error ? reject(error) : resolve(result)),
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });

export const removeAsset = async (publicId) => {
  if (publicId) await cloudinary.uploader.destroy(publicId);
};
