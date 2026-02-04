/*
  Warnings:

  - You are about to drop the column `url` on the `file` table. All the data in the column will be lost.
  - Added the required column `s3Key` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "file" DROP COLUMN "url",
ADD COLUMN     "s3Key" TEXT NOT NULL,
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'UPLOADED',
ADD COLUMN     "textContent" TEXT,
ALTER COLUMN "folderId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "folder" ALTER COLUMN "parentId" DROP DEFAULT;
