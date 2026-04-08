/*
  Warnings:

  - You are about to drop the column `userId` on the `LegalDocument` table. All the data in the column will be lost.
  - You are about to drop the column `businessAddress` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `legalName` on the `SellerProfile` table. All the data in the column will be lost.
  - Added the required column `sellerProfileId` to the `LegalDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LegalDocument" DROP CONSTRAINT "LegalDocument_userId_fkey";

-- AlterTable
ALTER TABLE "LegalDocument" DROP COLUMN "userId",
ADD COLUMN     "sellerProfileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SellerProfile" DROP COLUMN "businessAddress",
DROP COLUMN "city",
DROP COLUMN "legalName",
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "fullAddress" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "storeName" TEXT,
ADD COLUMN     "town" TEXT;

-- AddForeignKey
ALTER TABLE "LegalDocument" ADD CONSTRAINT "LegalDocument_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
