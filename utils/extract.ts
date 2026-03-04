import { fileTypeFromBuffer } from "file-type";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const IMAGE_MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  tiff: "image/tiff",
  tif: "image/tiff",
};

export const extractTextFromFile = async (
  fileBuffer: Buffer,
  fileKey: string,
) => {
  try {
    const fileType = await fileTypeFromBuffer(fileBuffer);
    const ext = fileType?.ext || fileKey.split(".").pop()?.toLowerCase();

    console.log("Detected file type:", ext);

    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
      case "bmp":
      case "tiff":
      case "tif": {
        const mimeType = IMAGE_MIME_TYPES[ext] ?? "image/jpeg";
        const base64Data = fileBuffer.toString("base64");

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: { mimeType, data: base64Data },
                },
                {
                  text: "Please extract and describe all text, content, and visual information from this image in detail. Include any visible text verbatim, describe charts, tables, diagrams, and other visual elements thoroughly so the content can be searched and queried.",
                },
              ],
            },
          ],
        });

        return (
          response.candidates?.[0]?.content?.parts
            ?.map((p) => p.text ?? "")
            .join("\n") ?? ""
        );
      }

      case "pdf": {
        const blob = new Blob([new Uint8Array(fileBuffer)], {
          type: "application/pdf",
        });
        const loader = new PDFLoader(blob, { splitPages: false });
        const docs = await loader.load();
        return docs.map((doc) => doc.pageContent).join("\n\n");
      }

      case "docx":
      case "doc": {
        const blob = new Blob([new Uint8Array(fileBuffer)], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const loader = new DocxLoader(blob);
        const docs = await loader.load();
        return docs.map((doc) => doc.pageContent).join("\n\n");
      }

      case "txt":
      case "text": {
        return fileBuffer.toString("utf-8");
      }

      case "md":
      case "markdown": {
        return fileBuffer.toString("utf-8");
      }

      case "json": {
        const jsonContent = JSON.parse(fileBuffer.toString("utf-8"));
        return JSON.stringify(jsonContent, null, 2);
      }

      case "csv": {
        const text = fileBuffer.toString("utf-8");
        return text;
      }

      case "html":
      case "htm": {
        return fileBuffer.toString("utf-8");
      }

      default:
        console.log(`Unsupported file type: ${ext}`);
        return "";
    }
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw error;
  }
};
