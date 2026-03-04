-- CreateEnum
CREATE TYPE "ShareRole" AS ENUM ('VIEWER', 'EDITOR');

-- CreateTable
CREATE TABLE "share" (
    "id" TEXT NOT NULL,
    "fileId" TEXT,
    "folderId" TEXT,
    "ownerId" TEXT NOT NULL,
    "recipientId" TEXT,
    "sharedWithEmail" TEXT NOT NULL,
    "role" "ShareRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "share_ownerId_idx" ON "share"("ownerId");

-- CreateIndex
CREATE INDEX "share_recipientId_idx" ON "share"("recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "share_fileId_sharedWithEmail_key" ON "share"("fileId", "sharedWithEmail");

-- CreateIndex
CREATE UNIQUE INDEX "share_folderId_sharedWithEmail_key" ON "share"("folderId", "sharedWithEmail");

-- AddForeignKey
ALTER TABLE "share" ADD CONSTRAINT "share_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share" ADD CONSTRAINT "share_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share" ADD CONSTRAINT "share_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share" ADD CONSTRAINT "share_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
