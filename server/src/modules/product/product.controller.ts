import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth.middleware";
import * as productService from "./product.service";
import logger from "@/utils/logger";

export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized attempt to create a product");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    logger.info(`Seller ${req.user.id} is creating a new product`);
    const result = await productService.createProduct(req.user.id, req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("Error creating product:", error);
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized attempt to update a product");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const productId = req.params.id as string;
    logger.info(`Seller ${req.user.id} is updating product ${productId}`);
    const result = await productService.updateProduct(req.user.id, productId, req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error updating product ${req.params.id}:`, error);
    next(error);
  }
};

export const uploadProductImages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized attempt to upload product images");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const productId = req.params.id as string;
    logger.info(`Seller ${req.user.id} uploading images for product ${productId}`);
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      logger.warn(`No images provided by seller ${req.user.id} for product ${productId}`);
      return res.status(400).json({ success: false, message: "No images provided" });
    }

    const result = await productService.uploadProductImages(req.user.id, productId, files);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error uploading images for product ${req.params.id}:`, error);
    next(error);
  }
};

export const getSellerProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await productService.getSellerProducts(req.user.id, req.query);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("Error fetching seller products:", error);
    next(error);
  }
};

export const getProductById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const productId = req.params.id as string;
    const result = await productService.getProductById(req.user.id, productId);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error fetching product ${req.params.id}:`, error);
    next(error);
  }
};
