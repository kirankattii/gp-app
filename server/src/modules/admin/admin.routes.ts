import { Router } from "express";
import * as AdminController from "./admin.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireRole("ADMIN", "SUPERADMIN"));

router.get("/sellers/pending", AdminController.getPendingSellers);
router.post("/sellers/:sellerId/approve", AdminController.approveSeller);
router.post("/sellers/:sellerId/reject", AdminController.rejectSeller);
router.get("/sellers", AdminController.getAllSellers);

router.get("/users", AdminController.getAllUsers);
router.get("/users/:id", AdminController.getUserById);

router.get("/products/pending", AdminController.getPendingProducts);
router.post("/products/:productId/approve", AdminController.approveProduct);
router.post("/products/:productId/reject", AdminController.rejectProduct);
router.get("/products", AdminController.getAllProducts);

export default router;
