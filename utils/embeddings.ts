import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX!);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const storeEmbeddings = async (
  chunks: string[],
  meta: { fileId: string; userId: string; key: string },
) => {
  const vectors = await Promise.all(
    chunks.map(async (chunk, i) => {
      const res = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk,
      });

      return {
        id: `${meta.fileId}-${i}`,
        values: res?.embeddings?.[0]?.values,
        metadata: {
          text: chunk,
          fileId: meta.fileId,
          userId: meta.userId,
          key: meta.key,
        },
      };
    }),
  );

  await index.upsert({ records: vectors });
};
