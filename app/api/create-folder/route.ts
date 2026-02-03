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

  const { folderName, parentFolderId } = await req.json();

  if (!folderName || typeof folderName !== "string")
    return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });

  try {
    await prisma.folder.create({
      data: {
        name: folderName,
        parentId: parentFolderId || "",
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Folder created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 },
    );
  }
};
