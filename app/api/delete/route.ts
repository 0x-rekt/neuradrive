import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { s3 } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { deleteEmbeddings } from "@/utils/embeddings";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, id } = await request.json();

    if (!type || !id) {
      return NextResponse.json(
        { error: "Type and ID are required" },
        { status: 400 },
      );
    }

    if (type !== "file" && type !== "folder") {
      return NextResponse.json(
        { error: "Type must be 'file' or 'folder'" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    if (type === "file") {
      const file = await prisma.file.findUnique({
        where: { id },
        include: {
          shares: {
            where: {
              sharedWithEmail: session.user.email!,
            },
          },
        },
      });

      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      const isOwner = file.ownerId === userId;
      const hasEditorAccess = file.shares.some(
        (share) => share.role === "EDITOR",
      );

      if (!isOwner && !hasEditorAccess) {
        return NextResponse.json(
          { error: "You don't have permission to delete this file" },
          { status: 403 },
        );
      }

      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: file.s3Key,
        });
        await s3.send(deleteCommand);
      } catch (s3Error) {
        console.error("Failed to delete file from S3:", s3Error);
      }

      try {
        await deleteEmbeddings(file.id);
      } catch (embeddingError) {
        console.error("Failed to delete embeddings:", embeddingError);
      }

      await prisma.file.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "File deleted successfully",
      });
    } else {
      const folder = await prisma.folder.findUnique({
        where: { id },
        include: {
          shares: {
            where: {
              sharedWithEmail: session.user.email!,
            },
          },
          files: true,
          children: {
            include: {
              files: true,
            },
          },
        },
      });

      if (!folder) {
        return NextResponse.json(
          { error: "Folder not found" },
          { status: 404 },
        );
      }

      const isOwner = folder.userId === userId;
      const hasEditorAccess = folder.shares.some(
        (share) => share.role === "EDITOR",
      );

      if (!isOwner && !hasEditorAccess) {
        return NextResponse.json(
          { error: "You don't have permission to delete this folder" },
          { status: 403 },
        );
      }

      const collectFiles = async (folderId: string): Promise<string[]> => {
        const folderData = await prisma.folder.findUnique({
          where: { id: folderId },
          include: {
            files: true,
            children: true,
          },
        });

        if (!folderData) return [];

        let s3Keys: string[] = folderData.files.map((f) => f.s3Key);

        for (const child of folderData.children) {
          const childKeys = await collectFiles(child.id);
          s3Keys = s3Keys.concat(childKeys);
        }

        return s3Keys;
      };

      const collectFileIds = async (folderId: string): Promise<string[]> => {
        const folderData = await prisma.folder.findUnique({
          where: { id: folderId },
          include: {
            files: true,
            children: true,
          },
        });

        if (!folderData) return [];

        let fileIds: string[] = folderData.files.map((f) => f.id);

        for (const child of folderData.children) {
          const childFileIds = await collectFileIds(child.id);
          fileIds = fileIds.concat(childFileIds);
        }

        return fileIds;
      };

      const allS3Keys = await collectFiles(id);
      const allFileIds = await collectFileIds(id);

      for (const s3Key of allS3Keys) {
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: s3Key,
          });
          await s3.send(deleteCommand);
        } catch (s3Error) {
          console.error(`Failed to delete file ${s3Key} from S3:`, s3Error);
        }
      }

      for (const fileId of allFileIds) {
        try {
          await deleteEmbeddings(fileId);
        } catch (embeddingError) {
          console.error(
            `Failed to delete embeddings for file ${fileId}:`,
            embeddingError,
          );
        }
      }

      await prisma.folder.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "Folder deleted successfully",
      });
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
