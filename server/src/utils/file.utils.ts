import { promises as fs } from "fs";
import cloudinary from "@/utils/cloudinary";
import logger from "@/utils/logger";

export const uploadMultipleFiles = async (files: Express.Multer.File[], folder: string) => {
  const uploadPromises = files.map(file =>
    cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "auto",
    })
  );

  return Promise.all(uploadPromises);
};

export const cleanupFiles = async (files: Express.Multer.File[]) => {
  for (const file of files) {
    try {
      await fs.unlink(file.path);
    } catch (err) {
      logger.error("Error deleting temporary file:", err);
    }
  }
};
