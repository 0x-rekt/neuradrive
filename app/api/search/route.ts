import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams.get("q");

  if (!query?.trim()) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required and must not be empty" },
      { status: 400 },
    );
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const embeddingsRes = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: query,
      config: { outputDimensionality: 768 },
    });

    const embedding = embeddingsRes?.embeddings?.[0]?.values;

    if (!embedding) {
      return NextResponse.json(
        { error: "Failed to generate embedding" },
        { status: 500 },
      );
    }

    const index = pinecone.index(process.env.PINECONE_INDEX!);

    const searchRes = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
      filter: { userId: { $eq: session.user.id } },
    });

    const rawResults =
      searchRes.matches?.map((match) => ({
        text: match.metadata?.text as string,
        fileId: match.metadata?.fileId as string,
        score: match.score,
      })) ?? [];

    const fileIds = [...new Set(rawResults.map((r) => r.fileId))];

    const files = await prisma.file.findMany({
      where: {
        id: { in: fileIds },
        ownerId: session.user.id,
        status: "READY",
      },
      select: { id: true, name: true, type: true, s3Key: true },
    });

    const fileMap = Object.fromEntries(files.map((f) => [f.id, f]));

    const results = rawResults
      .map((r) => ({ ...r, file: fileMap[r.fileId] ?? null }))
      .filter((r) => r.file !== null);

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to process the query" },
      { status: 500 },
    );
  }
};
