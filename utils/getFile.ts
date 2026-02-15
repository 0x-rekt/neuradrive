import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getFileFromS3 = async (bucket: string, key: string) => {
  const res = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: `uploads/${key}`,
    }),
  );

  const stream = res.Body as ReadableStream<Uint8Array>;
  const chunks: Uint8Array[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};
