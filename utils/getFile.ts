import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getFileFromS3 = async (bucket: string, key: string) => {
  const res = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  const stream = res.Body;

  if (!stream) {
    throw new Error("No body returned from S3");
  }

  const chunks: Uint8Array[] = [];

  // Handle the stream as an async iterable
  if (Symbol.asyncIterator in stream) {
    for await (const chunk of stream as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
  } else {
    // Fallback for streams without async iterator
    const reader = (stream as ReadableStream<Uint8Array>).getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  return Buffer.concat(chunks);
};
