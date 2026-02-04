import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import Drive from "@/components/Drive";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8 pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-500">Please sign in to access your drive.</p>
        </div>
      </div>
    );
  }

  const folders = await prisma.folder.findMany({
    where: { userId: session.user.id, parentId: null },
    orderBy: { createdAt: "desc" },
  });

  const files = await prisma.file.findMany({
    where: { ownerId: session.user.id, folderId: null },
    orderBy: { createdAt: "desc" },
  });

  return <Drive folders={folders} files={files} currentPath={[]} />;
};

export default Page;
