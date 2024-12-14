/*
  Warnings:

  - You are about to drop the column `Limits` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `Variables` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `Input` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Output` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "Limits",
DROP COLUMN "Variables",
ADD COLUMN     "Input" TEXT NOT NULL,
ADD COLUMN     "Output" TEXT NOT NULL;
