import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { streamText } from "ai";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export const POST = async (req: NextRequest) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { messages, fileId } = await req.json();

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      OR: [
        { ownerId: session.user.id },
        { shares: { some: { recipientId: session.user.id } } },
      ],
    },
  });
  if (!file) return new Response("File not found", { status: 404 });

  const normalizedMessages = messages.map((m: any) => ({
    role: m.role,
    content: Array.isArray(m.parts)
      ? m.parts.map((p: any) => p.text ?? "").join(" ")
      : (m.content ?? ""),
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
    topK: 5,
    includeMetadata: true,
    filter: { fileId: { $eq: fileId } },
  });

  const context = searchRes.matches
    ?.map((m) => m.metadata?.text)
    .filter(Boolean)
    .join("\n\n");

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are a helpful assistant. Answer questions based on the following document content:

${context}

If the answer isn't in the document, say so clearly.`,
    messages: normalizedMessages,
  });

  return result.toUIMessageStreamResponse();
};
