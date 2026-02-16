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
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(fileBuffer);
      return data.text;
    }

    return "";
  } catch (error) {
    console.log("Error extracting text from file:", error);
    throw error;
  }
};
