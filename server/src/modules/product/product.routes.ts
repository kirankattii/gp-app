import { Router } from "express";
import multer from "multer";
import { requireAuth } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "@/validations/product.schema";
import * as ProductController from "./product.controller";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: image/jpeg, image/png, image/webp"));
    }
  },
});

const router = Router();

// Only sellers can manage products
router.use(requireAuth);
router.use(requireRole("SELLER", "ADMIN"));

router.get("/", ProductController.getSellerProducts);
router.get("/:id", ProductController.getProductById);

router.post(
  "/",
  validate(createProductSchema),
  ProductController.createProduct
);

router.patch(
  "/:id",
  validate(updateProductSchema),
  ProductController.updateProduct
);

router.post(
  "/:id/images",
  upload.array("images", 5), // allow up to 5 images
  ProductController.uploadProductImages
);

export default router;
