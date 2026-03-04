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
        select: { ownerId: true },
      });

      if (!file || file.ownerId !== session.user.id) {
        return NextResponse.json(
          { error: "File not found or access denied" },
          { status: 404 },
        );
      }
    }

    if (folderId) {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
        select: { userId: true },
      });

      if (!folder || folder.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Folder not found or access denied" },
          { status: 404 },
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
