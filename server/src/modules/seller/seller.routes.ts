import { Router } from "express";
import multer from "multer";

import { requireAuth } from "../../middlewares/auth.middleware";

import * as SellerController from "./seller.controller";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: image, pdf"));
    }
  },
});
const router = Router();

router.use(requireAuth);

router.get("/profile", SellerController.getProfile);
router.post("/become-seller", SellerController.becomeSeller);
router.post("/complete-onboarding", SellerController.completeOnboarding);

router.patch("/profile", SellerController.updateProfile);
router.patch("/address", SellerController.updateAddress);
router.patch("/bank", SellerController.updateBankDetails);

router.post("/upload-document", upload.single("file"), SellerController.uploadDocument);

export default router;
