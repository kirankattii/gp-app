import { NextFunction, Request, Response } from "express";
import multer from "multer";

export default function errorHandler(
  err: Error & { status?: number; code?: string },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB",
      });
    }
    // Handle other multer errors
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error",
    });
  }

  // Handle file filter errors (invalid type)
  if (err.message === "Invalid file type. Allowed: image, pdf") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const statusCode = err.status || 500;
  const isOperationalError = statusCode < 500;

  res.status(statusCode).json({
    success: false,
    message: isOperationalError ? err.message : "Internal Server Error",
  });
}
