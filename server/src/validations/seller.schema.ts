import { z } from "zod";

export const updateProfileSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  businessType: z.string().min(2, "Business type is required"),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format").optional().or(z.literal("")),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
});

export const updateAddressSchema = z.object({
  pincode: z.number().int().min(100000).max(999999),
  state: z.string().min(2),
  district: z.string().min(2),
  town: z.string().min(2),
  fullAddress: z.string().min(10),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateBankSchema = z.object({
  bankAccountNumber: z.string().min(9).max(18),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format"),
});

export const completeOnboardingSchema = z.object({
  // Step 1
  storeName: z.string().min(2, "Store name is required"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  businessType: z.string().min(2, "Business type is required"),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format").optional().or(z.literal("")),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  // Step 2
  pincode: z.number().int().min(100000).max(999999),
  state: z.string().min(2),
  district: z.string().min(2),
  town: z.string().min(2),
  fullAddress: z.string().min(10),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  // Step 3
  bankAccountNumber: z.string().min(9).max(18),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format"),
});
