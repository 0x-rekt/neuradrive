import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const { id: shareId } = await params;

    const share = await prisma.share.findUnique({
      where: { id: shareId },
      include: {
        file: true,
        folder: {
          include: {
            files: true,
            children: true,
          },
        },
        owner: {
          select: { name: true, email: true },
        },
      },
    });

    if (!share) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    if (session?.user?.email !== share.sharedWithEmail) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      share,
      item: share.file || share.folder,
    });
  } catch (error) {
    console.error("Share access error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
