import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId, folderId, sharedWithEmail, role } = await request.json();

    if (!sharedWithEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!fileId && !folderId) {
      return NextResponse.json(
        { error: "Either fileId or folderId is required" },
        { status: 400 },
      );
    }

    if (fileId && folderId) {
      return NextResponse.json(
        { error: "Cannot share both file and folder at once" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: sharedWithEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (fileId) {
      const file = await prisma.file.findUnique({
        where: { id: fileId },
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

      // Check if user is owner or has EDITOR access
      const isOwner = file.ownerId === session.user.id;
      const hasEditorAccess = file.shares.some(
        (share) => share.role === "EDITOR",
      );

      if (!isOwner && !hasEditorAccess) {
        return NextResponse.json(
          { error: "You don't have permission to share this file" },
          { status: 403 },
        );
      }
    }

    if (folderId) {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
        include: {
          shares: {
            where: {
              sharedWithEmail: session.user.email!,
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

      // Check if user is owner or has EDITOR access
      const isOwner = folder.userId === session.user.id;
      const hasEditorAccess = folder.shares.some(
        (share) => share.role === "EDITOR",
      );

      if (!isOwner && !hasEditorAccess) {
        return NextResponse.json(
          { error: "You don't have permission to share this folder" },
          { status: 403 },
        );
      }
    }

    const existingShare = await prisma.share.findFirst({
      where: {
        OR: [
          fileId ? { fileId, sharedWithEmail } : { folderId, sharedWithEmail },
        ],
      },
    });

    if (existingShare) {
      return NextResponse.json(
        { error: "Already shared with this user" },
        { status: 400 },
      );
    }

    const share = await prisma.share.create({
      data: {
        fileId,
        folderId,
        recipientId: user.id,
        ownerId: session.user.id,
        sharedWithEmail,
        role: role || "VIEWER",
      },
    });

    return NextResponse.json(share);
  } catch (error) {
    console.error("Share creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
