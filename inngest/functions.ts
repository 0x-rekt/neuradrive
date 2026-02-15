import { getFileFromS3 } from "@/utils/getFile";
import { inngest } from "./client";
import { chunkText } from "@/utils/chunk";
import { storeEmbeddings } from "@/utils/embeddings";
import { extractTextFromFile } from "@/utils/extract";

export const helloWorld = inngest.createFunction(
  { id: "Hello World" },
  { event: "hello/world" },
  async ({ event, step }) => {
    await step.sleep("waiting for 5 seconds", "5s");
    return `Hello, ${event.data.email}!`;
  },
);

export const processFile = inngest.createFunction(
  { id: "process-uploaded-file" },
  { event: "file/uploaded" },
  async ({ event, step }) => {
    const { bucket, key, fileId, userId } = event.data;

    const fileBufferBase64 = await step.run("download-file", async () => {
      const buffer = await getFileFromS3(bucket, key);
      return buffer.toString("base64");
    });

    const text = await step.run("extract-text", async () => {
      const buffer = Buffer.from(fileBufferBase64, "base64");
      return await extractTextFromFile(buffer, key);
    });

    if (!text || text.length === 0) {
      return { status: "error", message: "No text extracted from file" };
    }

    const chunks = await step.run("chunk-text", async () => {
      return await chunkText(text);
    });

    await step.run("store-embeddings", async () => {
      await storeEmbeddings(chunks, {
        fileId,
        userId,
        key,
      });
    });

    return { status: "success", message: "File processed successfully" };
  },
);
