import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import sellerRoutes from "../modules/seller/seller.routes";
import adminRoutes from "../modules/admin/admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/seller", sellerRoutes);
router.use("/admin", adminRoutes);

export default router;
