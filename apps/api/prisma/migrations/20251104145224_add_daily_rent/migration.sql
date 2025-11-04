/*
  Warnings:

  - You are about to drop the column `dailylyRent` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "dailylyRent",
ADD COLUMN     "dailyRent" DOUBLE PRECISION NOT NULL DEFAULT 0;
