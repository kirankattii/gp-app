import { Router } from "express";
import * as AuthController from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/register-seller", AuthController.registerSeller);
router.post("/login", AuthController.login);
router.post("/admin-login", AuthController.adminLogin);

router.get("/me", requireAuth, AuthController.getMe);
router.get("/verify-email", AuthController.verifyEmail);

router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

router.get("/google", AuthController.googleStart);
router.get("/google/callback", AuthController.googleCallback);

export default router;