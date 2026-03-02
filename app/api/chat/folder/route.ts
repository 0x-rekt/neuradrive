import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { streamText } from "ai";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export const POST = async (req: NextRequest) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { messages, folderId } = await req.json();

  if (!folderId) return new Response("Folder ID required", { status: 400 });

  const files = await prisma.file.findMany({
    where: {
      folderId: folderId === "root" ? null : folderId,
      ownerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!files || files.length === 0) {
    return new Response("No files found in this folder", { status: 404 });
  }

  const fileIds = files.map((f) => f.id);

  const normalizedMessages = messages.map((m: any) => ({
    role: m.role,
    content: Array.isArray(m.parts)
      ? m.parts.map((p: any) => p.text ?? "").join(" ")
      : m.content ?? "",
  }));

  const lastMessage = normalizedMessages[normalizedMessages.length - 1];
  const messageText = lastMessage.content;

  if (!messageText) return new Response("Empty message", { status: 400 });

  const embeddingRes = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: messageText,
    config: { outputDimensionality: 768 },
  });
  const embedding = embeddingRes?.embeddings?.[0]?.values!;

  const index = pinecone.index(process.env.PINECONE_INDEX!);

  const searchRes = await index.query({
    vector: embedding,
    topK: 10,
    includeMetadata: true,
    filter: {
      fileId: { $in: fileIds },
      userId: { $eq: session.user.id },
    },
  });

  let context = searchRes.matches
    ?.map((m) => {
      const fName = files.find((f) => f.id === m.metadata?.fileId)?.name || "Unknown Document";
      return `--- Source: ${fName} ---\n${m.metadata?.text}`;
    })
    .filter(Boolean)
    .join("\n\n");

  if (!context) {
    context = "No relevant documents found.";
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are a helpful assistant assisting a user by answering questions based on their documents within a specific folder.
Below are relevant excerpts from their documents, identified by their "Source" file name:

${context}

When referencing information, try to mention which file it came from. If the answer isn't in the provided document contexts, say so clearly. Do not use external knowledge unless summarizing the provided text.`,
    messages: normalizedMessages,
  });

  return result.toUIMessageStreamResponse();
};
