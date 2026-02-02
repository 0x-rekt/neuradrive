/*
  Warnings:

  - Added the required column `size` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "folder" ALTER COLUMN "parentId" SET DEFAULT '';
