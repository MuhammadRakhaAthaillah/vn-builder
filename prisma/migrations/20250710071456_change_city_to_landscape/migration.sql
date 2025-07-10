/*
  Warnings:

  - You are about to drop the column `cityId` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `landscapeId` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_cityId_fkey";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "cityId",
ADD COLUMN     "landscapeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "City";

-- CreateTable
CREATE TABLE "Landscape" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "x_cord_start" INTEGER NOT NULL,
    "y_cord_start" INTEGER NOT NULL,
    "x_cord_end" INTEGER NOT NULL,
    "y_cord_end" INTEGER NOT NULL,
    "picture" TEXT,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Landscape_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Landscape" ADD CONSTRAINT "Landscape_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_landscapeId_fkey" FOREIGN KEY ("landscapeId") REFERENCES "Landscape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
