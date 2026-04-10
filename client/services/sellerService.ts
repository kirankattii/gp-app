import api from "@/lib/axios";

export const sellerService = {
  getProfile: () => api.get("/seller/profile"),

  becomeSeller: () => api.post("/seller/become-seller"),

  updateProfile: (data: any) => api.patch("/seller/profile", data),

  updateAddress: (data: any) => api.patch("/seller/address", data),

  updateBankDetails: (data: any) => api.patch("/seller/bank", data),

  completeOnboarding: (data: any) => api.post("/seller/complete-onboarding", data),

  reapply: () => api.post("/seller/reapply"),

  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/seller/upload-document", formData);
  },
};
