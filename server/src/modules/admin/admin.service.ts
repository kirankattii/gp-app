import { prisma } from "@/config/prisma";

export const getPendingSellers = async () => {
  const sellers = await prisma.sellerProfile.findMany({
    where: { approvalStatus: "PENDING" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      legalDocuments: true,
    },
  });
  return { status: 200, data: sellers };
};

export const approveSeller = async (sellerId: string) => {
  const seller = await prisma.sellerProfile.findUnique({ where: { id: sellerId } });
  if (!seller) return { status: 404, data: { message: "Seller not found" } };

  const updated = await prisma.sellerProfile.update({
    where: { id: sellerId },
    data: {
      approvalStatus: "APPROVED",
      rejectionReason: null,
    },
  });
  return { status: 200, data: { message: "Seller approved", seller: updated } };
};

export const rejectSeller = async (sellerId: string, reason: string) => {
  const seller = await prisma.sellerProfile.findUnique({ where: { id: sellerId } });
  if (!seller) return { status: 404, data: { message: "Seller not found" } };

  const updated = await prisma.sellerProfile.update({
    where: { id: sellerId },
    data: {
      approvalStatus: "REJECTED",
      rejectionReason: reason,
    },
  });
  return { status: 200, data: { message: "Seller rejected", seller: updated } };
};

export const getAllUsers = async (params: any = {}) => {
  const {
    role,
    status,
    search,
    alpha,
    startDate,
    endDate,
    listType,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const where: any = {};

  if (role && role !== "All") {
    where.role = role;
  }

  if (status && status !== "All") {
    where.sellerProfile = {
      approvalStatus: status,
    };
  }

  if (alpha) {
    where.name = {
      startsWith: alpha,
      mode: "insensitive",
    };
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    if (listType === "count") {
      const [total, buyers, sellers] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.count({ where: { ...where, role: "BUYER" } }),
        prisma.user.count({ where: { ...where, role: "SELLER" } }),
      ]);

      return {
        status: 200,
        data: {
          total,
          buyers,
          sellers,
        },
      };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [users, totalRecords] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: isNaN(skip) ? 0 : skip,
        take: isNaN(take) ? 20 : take,
      }),
      prisma.user.count({ where }),
    ]);

    return { status: 200, data: { users, totalRecords } };
  } catch (error: any) {
    console.error("Error in getAllUsers:", error);
    return { status: 500, data: { message: "Internal server error", error: error.message } };
  }
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      sellerProfile: {
        include: {
          legalDocuments: true,
        },
      },
    },
  });

  if (!user) {
    return { status: 404, data: { message: "User not found" } };
  }

  // Remove sensitive data
  const { passwordHash, ...userWithoutPassword } = user;
  return { status: 200, data: userWithoutPassword };
};

export const getAllSellers = async (params: any = {}) => {
  const {
    status,
    search,
    startDate,
    endDate,
    outputType,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const where: any = {};

  if (status && status !== "All") {
    // Expected status: PENDING, APPROVED, REJECTED
    if (status && status !== "All") {
      where.approvalStatus = typeof status === "string" ? status.toUpperCase() : status;
    }
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  if (search) {
    where.OR = [
      { storeName: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }
  try {
    if (outputType === "count") {
      // Build base filter without approvalStatus for status-specific counts
      const { approvalStatus, ...baseWhere } = where;
      const [pending, approved, rejected] = await Promise.all([
        prisma.sellerProfile.count({ where: { ...baseWhere, approvalStatus: "PENDING" } }),
        prisma.sellerProfile.count({ where: { ...baseWhere, approvalStatus: "APPROVED" } }),
        prisma.sellerProfile.count({ where: { ...baseWhere, approvalStatus: "REJECTED" } }),
      ]);

      return {
        status: 200,
        data: {
          pending,
          approved,
          rejected,
          total: pending + approved + rejected,
        },
      };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [sellers, totalRecords] = await Promise.all([
      prisma.sellerProfile.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: isNaN(skip) ? 0 : skip,
        take: isNaN(take) ? 20 : take,
      }),
      prisma.sellerProfile.count({ where }),
    ]);

    return { status: 200, data: { sellers, totalRecords } };
  } catch (error: any) {
    console.error("Error in getAllSellers:", error);
    return { status: 500, data: { message: "Internal server error", error: error.message } };
  }
};

export const getPendingProducts = async () => {
  const products = await prisma.product.findMany({
    where: { status: "PENDING" },
    include: {
      seller: {
        select: {
          storeName: true,
          user: { select: { email: true, name: true } }
        }
      },
      variants: true,
      images: true,
    },
  });
  return { status: 200, data: { success: true, products } };
};

export const approveProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { status: 404, data: { success: false, message: "Product not found" } };

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      status: "APPROVED",
      rejectionReason: null,
      approvedAt: new Date(),
    },
  });
  return { status: 200, data: { success: true, message: "Product approved", product: updated } };
};

export const rejectProduct = async (productId: string, reason: string) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { status: 404, data: { success: false, message: "Product not found" } };

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      status: "REJECTED",
      rejectionReason: reason,
    },
  });
  return { status: 200, data: { success: true, message: "Product rejected", product: updated } };
};

export const getAllProducts = async (params: any = {}) => {
  const {
    status,
    search,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const where: any = {};

  if (status && status !== "All") {
    where.status = status.toUpperCase();
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { productCode: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [products, totalRecords] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: { select: { storeName: true } },
          variants: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: isNaN(skip) ? 0 : skip,
        take: isNaN(take) ? 20 : take,
      }),
      prisma.product.count({ where }),
    ]);

    return { status: 200, data: { success: true, products, totalRecords } };
  } catch (error: any) {
    console.error("Error in getAllProducts:", error);
    return { status: 500, data: { success: false, message: "Internal server error", error: error.message } };
  }
};
