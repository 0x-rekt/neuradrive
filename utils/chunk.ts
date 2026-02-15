import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const chunkText = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150,
  });

  return splitter.splitText(text);
};
