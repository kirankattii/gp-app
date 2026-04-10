import { Request, Response } from "express";
import * as AdminService from "./admin.service";
import logger from "../../utils/logger";

export const getPendingSellers = async (_req: Request, res: Response) => {
  try {
    logger.info("Admin fetching pending sellers");
    const result = await AdminService.getPendingSellers();
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("Error fetching pending sellers", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const approveSeller = async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId as string;
  logger.info(`Admin approving seller: ${sellerId}`);
  const result = await AdminService.approveSeller(sellerId);
  return res.status(result.status).json(result.data);
};

export const rejectSeller = async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId as string;
  const { reason } = req.body;

  if (!reason) {
    logger.warn(`Admin attempt to reject seller ${sellerId} without reason`);
    return res.status(400).json({ message: "Rejection reason is required" });
  }

  logger.info(`Admin rejecting seller: ${sellerId}`);
  const result = await AdminService.rejectSeller(sellerId, reason);
  return res.status(result.status).json(result.data);
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    logger.info("Admin fetching all users with filters", req.query);
    const result = await AdminService.getAllUsers(req.query);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("Error fetching users", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    logger.info(`Admin fetching user: ${userId}`);
    const result = await AdminService.getUserById(userId);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`Error fetching user ${req.params.id}`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllSellers = async (req: Request, res: Response) => {
  try {
    logger.info("Admin fetching all sellers with filters", req.query);
    const result = await AdminService.getAllSellers(req.query);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("Error fetching sellers", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
