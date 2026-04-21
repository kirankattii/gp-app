import { prisma } from "@/config/prisma";
import { generateProductCode, generateSlug, generateSku } from "@/utils/product.utils";
import { uploadMultipleFiles, cleanupFiles } from "@/utils/file.utils";

export const createProduct = async (userId: string, data: any) => {
  const seller = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!seller) return { status: 404, data: { success: false, message: "Seller profile not found" } };
  
  if (seller.approvalStatus !== "APPROVED") {
    return { status: 403, data: { success: false, message: "Only approved sellers can manage products" } };
  }

  const productCode = await generateProductCode();
  const slug = generateSlug(data.title);

  const product = await prisma.product.create({
    data: {
      sellerId: seller.id,
      productCode,
      slug,
      title: data.title,
      description: data.description,
      category: data.category,
      features: data.features || {},
      hsn: data.hsn,
      country: data.country,
      manufacturer: data.manufacturer,
      manufacturerContact: data.manufacturerContact,
      packerContact: data.packerContact,
      netQuantity: data.netQuantity,
      attributes: data.attributes,
      status: "PENDING",
      variants: data.variants && data.variants.length > 0 ? {
        create: data.variants.map((v: any) => ({
          skuCode: v.skuCode || generateSku({ title: data.title, weight: v.weight, color: v.color, ml: v.ml }),
          size: v.size,
          color: v.color,
          weight: v.weight,
          ml: v.ml,
          price: v.price,
          stock: v.stock,
        }))
      } : undefined,
      packaging: data.packaging ? {
        create: data.packaging
      } : undefined,
      documents: data.documents && data.documents.length > 0 ? {
        create: data.documents
      } : undefined
    },
    include: { variants: true, packaging: true, documents: true }
  });

  return { status: 201, data: { success: true, message: "Product created successfully", data: product } };
};

export const updateProduct = async (userId: string, productId: string, data: any) => {
  const seller = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!seller) return { status: 404, data: { success: false, message: "Seller profile not found" } };

  if (seller.approvalStatus !== "APPROVED") {
    return { status: 403, data: { success: false, message: "Only approved sellers can manage products" } };
  }

  const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
  if (!existingProduct) return { status: 404, data: { success: false, message: "Product not found" } };
  
  if (existingProduct.sellerId !== seller.id) {
    return { status: 403, data: { success: false, message: "You don't have permission to update this product" } };
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      features: data.features,
      hsn: data.hsn,
      country: data.country,
      manufacturer: data.manufacturer,
      manufacturerContact: data.manufacturerContact,
      packerContact: data.packerContact,
      netQuantity: data.netQuantity,
      attributes: data.attributes,
      status: "PENDING", // Any update forces it back to PENDING for admin approval
      packaging: data.packaging ? {
        upsert: {
          create: data.packaging,
          update: data.packaging,
        }
      } : undefined,
      documents: data.documents ? {
        deleteMany: {},
        create: data.documents
      } : undefined
    },
    include: { packaging: true, documents: true }
  });

  return { status: 200, data: { success: true, message: "Product updated successfully", data: updated } };
};

export const uploadProductImages = async (userId: string, productId: string, files: Express.Multer.File[]) => {
  const seller = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!seller) return { status: 404, data: { success: false, message: "Seller profile not found" } };

  const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
  if (!existingProduct) return { status: 404, data: { success: false, message: "Product not found" } };
  
  if (existingProduct.sellerId !== seller.id) {
    return { status: 403, data: { success: false, message: "You do not own this product" } };
  }

  try {
    const uploadedImages = await uploadMultipleFiles(files, "products");

    const imagesToCreate = uploadedImages.map((img) => ({
      productId,
      url: img.secure_url,
      // First image can be main if necessary, here we set false
      isMain: false 
    }));

    await prisma.productImage.createMany({
      data: imagesToCreate
    });

    const finalProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true }
    });

    return { status: 201, data: { success: true, message: "Images uploaded successfully", data: finalProduct } };
  } finally {
    // Cleanup temporary files
    await cleanupFiles(files);
  }
};

export const getSellerProducts = async (userId: string, params: any) => {
  const seller = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!seller) return { status: 404, data: { success: false, message: "Seller profile not found" } };

  const {
    status,
    search,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const where: any = { sellerId: seller.id, isDeleted: false };

  if (status && status !== "All") {
    where.status = status.toUpperCase();
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { productCode: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [products, totalRecords] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        variants: true,
        images: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip: isNaN(skip) ? 0 : skip,
      take: isNaN(take) ? 20 : take,
    }),
    prisma.product.count({ where }),
  ]);

  // Optionally calculate counts for the UI summary cards
  const [active, pending, rejected] = await Promise.all([
    prisma.product.count({ where: { sellerId: seller.id, status: "ACTIVE", isDeleted: false } }),
    prisma.product.count({ where: { sellerId: seller.id, status: "PENDING", isDeleted: false } }),
    prisma.product.count({ where: { sellerId: seller.id, status: "REJECTED", isDeleted: false } }),
  ]);

  return { status: 200, data: { success: true, products, totalRecords, counts: { active, pending, rejected } } };
};

export const getProductById = async (userId: string, productId: string) => {
  const seller = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!seller) return { status: 404, data: { success: false, message: "Seller profile not found" } };

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: true,
      images: true,
      packaging: true,
      documents: true,
    }
  });

  if (!product) return { status: 404, data: { success: false, message: "Product not found" } };
  
  if (product.sellerId !== seller.id) {
    return { status: 403, data: { success: false, message: "Unauthorized access to product" } };
  }

  return { status: 200, data: { success: true, product } };
};
