import { fileTypeFromBuffer } from "file-type";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

export const extractTextFromFile = async (
  fileBuffer: Buffer,
  fileKey: string,
) => {
  try {
    const fileType = await fileTypeFromBuffer(fileBuffer);
    const ext = fileType?.ext || fileKey.split(".").pop()?.toLowerCase();

    console.log("Detected file type:", ext);

    switch (ext) {
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
