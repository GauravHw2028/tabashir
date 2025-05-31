/*
  Warnings:

  - Added the required column `city` to the `AiEducation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AiEducation" ADD COLUMN     "city" TEXT NOT NULL;
