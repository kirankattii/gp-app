import { Router } from "express";
import * as AuthController from "./auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/register-seller", AuthController.registerSeller);
router.post("/login", AuthController.login);

router.get("/verify-email", AuthController.verifyEmail);

router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

router.get("/google", AuthController.googleStart);
router.get("/google/callback", AuthController.googleCallback);

export default router;