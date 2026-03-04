import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX!);

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
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
        config: {
          outputDimensionality: 768,
        },
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

export const deleteEmbeddings = async (fileId: string) => {
  try {
    // Delete all vectors with this fileId from Pinecone
    await index.deleteMany({ filter: { fileId: { $eq: fileId } } });
    console.log(`Deleted embeddings for file: ${fileId}`);
  } catch (error) {
    console.error(`Failed to delete embeddings for file ${fileId}:`, error);
    throw error;
  }
};
