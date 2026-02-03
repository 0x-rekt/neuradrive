"use client";

import Link from "next/link";
import {
  Folder as FolderIcon,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  MoreVertical,
  File,
  Clock,
  HardDrive,
} from "lucide-react";
import { motion } from "framer-motion";

interface DriveProps {
  folders: any[];
  files: any[];
}

const Drive = ({ folders = [], files = [] }: DriveProps) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    const iconClass = "w-6 h-6 text-indigo-400";
    if (type.startsWith("image/")) return <ImageIcon className={iconClass} />;
    if (type.startsWith("video/")) return <Video className={iconClass} />;
    if (type.startsWith("audio/")) return <Music className={iconClass} />;
    if (type === "application/pdf") return <FileText className={iconClass} />;
    return <File className={iconClass} />;
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              <HardDrive className="text-indigo-500 w-8 h-8" />
              My Cloud
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-light">
              Managing {folders.length > 0 ? folders.length : "no"} folders and{" "}
              {files.length > 0 ? files.length : "no"} neural assets
            </p>
          </div>
          <Link href="/upload">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              + Upload Files
            </button>
          </Link>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6 text-white/80">
            <FolderIcon className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest">
              Directories
            </h2>
          </div>

          {folders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-dashed border-white/10 rounded-3xl p-12 text-center"
            >
              <FolderIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">No directories created yet.</p>
              <p className="text-slate-500 text-sm">
                Create your first folder to organize your files.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {folders.map((folder, index) => (
                <motion.div
                  key={folder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="group relative bg-white/2 border border-white/5 hover:border-indigo-500/40 hover:bg-white/4 p-4 rounded-2xl transition-all duration-300"
                >
                  <Link
                    href={`/drive/${folder.id}`}
                    className="flex items-center gap-4"
                  >
                    <div className="bg-indigo-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <FolderIcon className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate text-sm">
                        {folder.name}
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 uppercase tracking-tighter">
                        <Clock className="w-3 h-3" />
                        {new Date(folder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6 text-white/80">
            <File className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest">
              Neural Assets
            </h2>
          </div>

          {files.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-dashed border-white/10 rounded-3xl p-12 text-center"
            >
              <File className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Your drive is empty.</p>
              <p className="text-slate-500 text-sm">
                Upload your first file to get started.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="group relative bg-white/1 border border-white/5 hover:bg-slate-900/50 hover:border-violet-500/30 p-5 rounded-3xl transition-all"
                >
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white/3 rounded-2xl border border-white/5 group-hover:border-violet-500/20">
                        {getFileIcon(file.type)}
                      </div>
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-white font-medium text-sm truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {formatSize(file.size)}
                        </span>
                        <span className="text-[11px] text-slate-600 uppercase tracking-tighter">
                          {file.type.split("/")[1] || "file"}
                        </span>
                      </div>
                    </div>
                  </a>

                  <div className="absolute inset-0 -z-10 bg-linear-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drive;
