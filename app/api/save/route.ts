import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fileName, fileType, fileUrl, size, folderId } = await req.json();

  if (!fileName || !fileType || !fileUrl || !size) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const file = await prisma.file.create({
      data: {
        name: fileName,
        type: fileType,
        url: fileUrl,
        size: size,
        ownerId: session.user.id,
        ...(folderId && { folderId }),
      },
    });
    return NextResponse.json({ file }, { status: 201 });
  } catch (error) {
    console.error("Error saving file metadata:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
