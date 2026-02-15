import { PDFParse } from "pdf-parse";
import { fileTypeFromBuffer } from "file-type";

export const extractTextFromFile = async (
  fileBuffer: Buffer,
  fileKey: string,
) => {
  try {
    const fileType = await fileTypeFromBuffer(fileBuffer);
    const ext = fileType?.ext || fileKey.split(".").pop()?.toLowerCase();

    console.log("Detected file type:", ext);

    if (ext === "pdf") {
      const data = new PDFParse(fileBuffer);
      const result = await data.getText();

      await data.destroy();

      return result.text;
    }
  } catch (error) {
    console.log("Error extracting text from file:", error);
    throw error;
  }
};
