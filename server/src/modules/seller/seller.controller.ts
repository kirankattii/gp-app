import { Response, NextFunction } from "express";

import { AuthRequest } from "../../middlewares/auth.middleware";
import logger from "../../utils/logger";
import {
  updateProfileSchema,
  updateAddressSchema,
  updateBankSchema,
  completeOnboardingSchema,
} from "../../validations/seller.schema";

import * as SellerService from "./seller.service";

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    logger.info(`Fetching profile for user: ${req.user!.id}`);
    const result = await SellerService.getProfile(req.user!.id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error fetching profile for user ${req.user!.id}:`, error);
    return next(error);
  }
};

export const becomeSeller = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    logger.info(`User ${req.user!.id} applying to become a seller`);
    const result = await SellerService.becomeSeller(req.user!.id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error becoming seller for user ${req.user!.id}:`, error);
    return next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  try {
    logger.info(`Updating profile details for user: ${req.user!.id}`);
    const result = await SellerService.updateProfile(req.user!.id, parsed.data);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error updating profile for user ${req.user!.id}:`, error);
    return next(error);
  }
};

export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = updateAddressSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  try {
    logger.info(`Updating address for user: ${req.user!.id}`);
    const result = await SellerService.updateAddress(req.user!.id, parsed.data);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error updating address for user ${req.user!.id}:`, error);
    return next(error);
  }
};

export const updateBankDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = updateBankSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  try {
    logger.info(`Updating bank details for user: ${req.user!.id}`);
    const result = await SellerService.updateBankDetails(req.user!.id, parsed.data);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error updating bank details for user ${req.user!.id}:`, error);
    return next(error);
  }
};

export const completeOnboarding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = completeOnboardingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  try {
    logger.info(`Completing onboarding for user: ${req.user!.id}`);
    const result = await SellerService.completeOnboarding(req.user!.id, parsed.data);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error completing onboarding for user ${req.user!.id}:`, error);
    return next(error);
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.file) return res.status(400).json({ message: "File missing" });

  try {
    logger.info(`Uploading document for user: ${req.user!.id}, file: ${req.file.originalname}`);

    const result = await SellerService.uploadDocument(req.user!.id, req.file);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error uploading document for user ${req.user!.id}:`, error);
    return next(error);
  }
};
