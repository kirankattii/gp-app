import { prisma } from "@/config/prisma";

export const generateProductCode = async () => {
  const lastProduct = await prisma.product.findFirst({
    orderBy: { createdAt: "desc" },
    select: { productCode: true },
  });

  let nextNumber = 1;

  if (lastProduct?.productCode) {
    const lastNumber = parseInt(lastProduct.productCode.split("-")[1], 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  const padded = String(nextNumber).padStart(5, "0");
  return `GPLN-${padded}`;
};

export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-6);
};

export const generateSku = ({ title, weight, color, ml }: { title: string; weight?: string | null; color?: string | null; ml?: string | null }) => {
  const prefix = title.replace(/[^a-zA-Z]/g, "").substring(0, 2).toUpperCase() || "PR";
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  
  const colorCode = (color || "NA").substring(0, 3).toUpperCase();
  
  let weightOrVolumeCode = "NA";
  if (weight) weightOrVolumeCode = weight.replace(/\s/g, "").toUpperCase();
  else if (ml) weightOrVolumeCode = ml.replace(/\s/g, "").toUpperCase() + "ML";

  const random = Math.floor(100 + Math.random() * 900);

  return `${prefix}-${date}-${weightOrVolumeCode}-${colorCode}-${random}`;
};
