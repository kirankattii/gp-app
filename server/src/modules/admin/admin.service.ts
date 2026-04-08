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
