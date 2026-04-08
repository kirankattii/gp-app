
import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  registerSellerSchema,
} from "../../validations/auth.schema";

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ errors: parsed.error.flatten() });

  const result = await AuthService.register(parsed.data);
  return res.status(result.status).json(result.data);
};

export const registerSeller = async (req: Request, res: Response) => {
  const parsed = registerSellerSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ errors: parsed.error.flatten() });

  const result = await AuthService.registerSeller(parsed.data);
  return res.status(result.status).json(result.data);
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ errors: parsed.error.flatten() });

  const result = await AuthService.login(parsed.data, res);
  return res.status(result.status).json(result.data);
};

export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string | undefined;

  if (!token)
    return res.status(400).json({ message: "Token missing" });

  const result = await AuthService.verifyEmail(token, res);
  return res.status(result.status).json(result.data);
};

export const refresh = async (req: Request, res: Response) => {
  const result = await AuthService.refresh(req, res);
  return res.status(result.status).json(result.data);
};

export const logout = async (_req: Request, res: Response) => {
  const result = await AuthService.logout(res);
  return res.status(result.status).json(result.data);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ errors: parsed.error.flatten() });

  const result = await AuthService.forgotPassword(parsed.data.email);
  return res.status(result.status).json(result.data);
};

export const resetPassword = async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ errors: parsed.error.flatten() });

  const result = await AuthService.resetPassword(parsed.data);
  return res.status(result.status).json(result.data);
};

export const googleStart = async (_req: Request, res: Response) => {
  await AuthService.googleStart(res);
};

export const googleCallback = async (req: Request, res: Response) => {
  const result = await AuthService.googleCallback(req, res);
  if (result.redirect) {
    return res.redirect(result.redirect);
  }
  return res.status(result.status).json(result.data);
};