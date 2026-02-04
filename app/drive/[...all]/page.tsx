import Drive from "@/components/Drive";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ all: string[] }> }) => {
  const { all } = await params;
  const folderId = all.length > 0 ? all[all.length - 1] : null;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/");

  const folders = await prisma.folder.findMany({
    where: { userId: session?.user?.id, parentId: folderId },
    orderBy: { createdAt: "desc" },
  });

  const files = await prisma.file.findMany({
    where: { ownerId: session?.user?.id, folderId: folderId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Drive folders={folders} files={files} currentPath={all} />
    </div>
  );
};

export default page;
