import ChatInterface from "@/components/ChatInterface";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function FolderChatPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;

  let folder;

  if (folderId === "root") {
    folder = { id: "root", name: "My Cloud" };
  } else {
    folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
  }

  if (!folder) {
    notFound();
  }

  return <ChatInterface folder={folder} />;
}
