import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";

const ChatPage = async ({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) => {
  const { fileId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/");

  const file = await prisma.file.findFirst({
    where: { id: fileId, ownerId: session.user.id },
  });
  if (!file) redirect("/drive");

  return <ChatInterface file={file} />;
};

export default ChatPage;
