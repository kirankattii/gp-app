import { promises as fs } from "fs";

import { prisma } from "@/config/prisma";
import cloudinary from "@/utils/cloudinary";

export const getProfile = async (userId: string) => {
  const profile = await prisma.sellerProfile.findUnique({
    where: { userId },
    include: { legalDocuments: true },
  });
  return { status: 200, data: profile };
};

export const becomeSeller = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { status: 404, data: { message: "User not found" } };

  if (user.role === "SELLER") {
    const profile = await prisma.sellerProfile.findUnique({ where: { userId } });
    if (profile) return { status: 200, data: { message: "Already a seller", profile } };
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: "SELLER" },
  });

  const profile = await prisma.sellerProfile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      approvalStatus: "PENDING",
    },
  });

  return { status: 201, data: { message: "Role updated to seller", profile, user: updatedUser } };
};

export const updateProfile = async (userId: string, data: any) => {
  const existing = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!existing) return { status: 404, data: { message: "Seller profile not found" } };

  // Only increment if this step wasn't completed before
  const shouldIncrement = !existing.storeName;

  const updated = await prisma.sellerProfile.update({
    where: { userId },
    data: {
      storeName: data.storeName,
      mobileNumber: data.mobileNumber,
      businessType: data.businessType,
      gstin: data.gstin || null,
      pan: data.pan,
      profileCompletion: shouldIncrement ? { increment: 10 } : undefined,
    },
  });
  return { status: 200, data: updated };
};

export const updateAddress = async (userId: string, data: any) => {
  const updated = await prisma.sellerProfile.update({
    where: { userId },
    data: {
      pincode: data.pincode,
      state: data.state,
      district: data.district,
      town: data.town,
      fullAddress: data.fullAddress,
      latitude: data.latitude,
      longitude: data.longitude,
      profileCompletion: { increment: 10 },
    },
  });
  return { status: 200, data: updated };
};

export const updateBankDetails = async (userId: string, data: any) => {
  const updated = await prisma.sellerProfile.update({
    where: { userId },
    data: {
      bankAccountNumber: data.bankAccountNumber,
      ifscCode: data.ifscCode,
      profileCompletion: { increment: 10 },
    },
  });
  return { status: 200, data: updated };
};

export const completeOnboarding = async (userId: string, data: any) => {
  const updated = await prisma.sellerProfile.update({
    where: { userId },
    data: {
      // Step 1
      storeName: data.storeName,
      mobileNumber: data.mobileNumber,
      businessType: data.businessType,
      gstin: data.gstin || null,
      pan: data.pan,
      // Step 2
      pincode: data.pincode,
      state: data.state,
      district: data.district,
      town: data.town,
      fullAddress: data.fullAddress,
      latitude: data.latitude,
      longitude: data.longitude,
      // Step 3
      bankAccountNumber: data.bankAccountNumber,
      ifscCode: data.ifscCode,
      // Finalise
      profileCompletion: 100,
      approvalStatus: "PENDING",
    },
  });
  return { status: 200, data: { message: "Onboarding completed", profile: updated } };
};

export const uploadDocument = async (userId: string, file: any) => {
  const seller = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!seller) return { status: 404, data: { message: "Seller profile not found" } };

  try {
    // Validation should have handled file size/type but we can check here too
    const upload = await cloudinary.uploader.upload(file.path, {
      folder: "seller_docs",
      resource_type: "auto",
    });

    const doc = await prisma.legalDocument.create({
      data: {
        sellerProfileId: seller.id,
        fileUrl: upload.secure_url,
        fileType: upload.format || file.mimetype.split("/")[1],
      },
    });

    return { status: 201, data: { message: "Document uploaded", doc } };
  } finally {
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error("Error deleting temp file:", error);
    }
  }
};
