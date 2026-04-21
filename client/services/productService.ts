import api from "@/lib/axios";

export const productService = {
  getProducts: (params = {}) => api.get("/product", { params }),

  getProductById: (id: string) => api.get(`/product/${id}`),

  createProduct: (data: any) => api.post("/product", data),

  updateProduct: (id: string, data: any) => api.patch(`/product/${id}`, data),

  uploadImages: (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    return api.post(`/product/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
