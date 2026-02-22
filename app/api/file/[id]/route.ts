import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  try {
    const file = await prisma.file.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!file)
      return NextResponse.json({ error: "File not found" }, { status: 404 });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: file.s3Key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 },
    );
  }
};
