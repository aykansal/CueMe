/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Space` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_createdBy_fkey";

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "createdBy",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
