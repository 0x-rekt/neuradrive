"use client";

import Link from "next/link";
import { useState } from "react";
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
  Upload,
  CheckCircle,
  X,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface DriveProps {
  folders: any[];
  files: any[];
  currentPath: string[];
}

const Drive = ({ folders = [], files = [], currentPath }: DriveProps) => {
  const currentFolderId =
    currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;
  const [showUploader, setShowUploader] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [folderName, setFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadStatus("idle");

    try {
      for (const file of selectedFiles) {
        const response = await axios.post("/api/upload", {
          fileName: file.name,
          fileType: file.type,
        });
        const { signedUrl, key } = response.data;

        await axios.put(signedUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        await axios.post("/api/save", {
          fileName: file.name,
          fileType: file.type,
          s3Key: key,
          size: file.size,
          folderId: currentFolderId,
        });
      }

      setUploadStatus("success");
      setSelectedFiles([]);
      router.refresh();
    } catch (error) {
      console.error("Upload failed", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      await axios.post("/api/create-folder", {
        folderName: folderName.trim(),
        parentFolderId: currentFolderId,
      });
      setFolderName("");
      setShowCreateFolderDialog(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to create folder", error);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    setUploadStatus("idle");
  };
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

  const getFileTypeLabel = (type: string) => {
    if (!type) return "FILE";
    if (type === "application/pdf") return "PDF";
    if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "DOCX";
    if (type === "application/msword") return "DOC";
    if (type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") return "PPTX";
    if (type === "application/vnd.ms-excel") return "XLS";
    if (type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "XLSX";
    if (type === "text/plain") return "TXT";
    if (type === "text/csv") return "CSV";
    if (type === "application/json") return "JSON";

    // Fallback logic for basic images/video (e.g "image/png" -> "PNG")
    const parts = type.split("/");
    if (parts.length > 1) {
       return parts[1].toUpperCase();
    }
    return "FILE";
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    const base =
      "inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full";

    if (s === "PROCESSING") {
      return (
        <div className={base + " bg-violet-700/10 text-violet-300"}>
          <div className="w-4 h-4 border-2 border-violet-300 border-t-transparent rounded-full animate-spin" />
          <span>Processing</span>
        </div>
      );
    }

    if (s === "READY") {
      return (
        <div className={base + " bg-green-700/10 text-green-300"}>
          <CheckCircle className="w-4 h-4 text-green-300" />
          <span>Ready</span>
        </div>
      );
    }

    if (s === "FAILED") {
      return (
        <div className={base + " bg-red-700/10 text-red-300"}>
          <X className="w-4 h-4 text-red-300" />
          <span>Failed</span>
        </div>
      );
    }

    return (
      <div className={base + " bg-indigo-700/10 text-indigo-300"}>
        <Upload className="w-4 h-4 text-indigo-300" />
        <span>
          {s === "" ? "Unknown" : s.charAt(0) + s.slice(1).toLowerCase()}
        </span>
      </div>
    );
  };

  const handleFileOpen = async (fileId: string) => {
    try {
      const response = await axios.get(`/api/file/${fileId}`);
      const { url } = response.data;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to open file", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        {currentPath.length > 0 && (
          <div className="mb-6">
            <Link
              href={
                currentPath.length === 1
                  ? "/drive"
                  : `/drive/${currentPath.slice(0, -1).join("/")}`
              }
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </Link>
          </div>
        )}
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
          <div className="flex gap-4">
            <Button
              onClick={() => router.push(`/chat/folder/${currentFolderId || 'root'}`)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              Chat {currentFolderId ? "with Folder" : "with Root"}
            </Button>
            <Button
              onClick={() => setShowCreateFolderDialog(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Folder
            </Button>
            <Button
              onClick={() => setShowUploader(!showUploader)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] cursor-pointer"
            >
              + Upload Files
            </Button>
          </div>
        </div>

        {showUploader && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <form onSubmit={handleUpload} className="space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  // setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  // setIsDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  if (files.length > 0) {
                    handleFileSelect(files);
                  }
                }}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  selectedFiles.length > 0
                    ? "border-green-400 bg-green-400/5"
                    : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
                }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      handleFileSelect(files);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="*/*"
                />

                <div className="space-y-4">
                  {selectedFiles.length > 0 ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-green-400/10 rounded-full">
                        <File className="w-12 h-12 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-lg">
                          {selectedFiles.length === 1
                            ? selectedFiles[0].name
                            : `${selectedFiles.length} files selected`}
                        </p>
                        {selectedFiles.length === 1 && (
                          <p className="text-slate-500 text-sm">
                            {(selectedFiles[0].size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-6 bg-indigo-400/10 rounded-full inline-block">
                        <Upload className="w-12 h-12 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-xl mb-2">
                          Drag & drop your files here
                        </p>
                        <p className="text-slate-500">
                          or click to browse files
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isUploading}
                  className="w-full px-8 py-4 bg-white text-black rounded-full font-bold transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    `Upload ${selectedFiles.length === 1 ? "File" : "Files"}`
                  )}
                </motion.button>
              )}

              {uploadStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center space-x-2 text-green-400 bg-green-400/10 rounded-full px-6 py-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Upload successful!</span>
                </motion.div>
              )}

              {uploadStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center space-x-2 text-red-400 bg-red-400/10 rounded-full px-6 py-3"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">
                    Upload failed. Please try again.
                  </span>
                </motion.div>
              )}
            </form>
          </motion.div>
        )}

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
                    href={`/drive/${[...currentPath, folder.id].join("/")}`}
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
                  </Link>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/chat/folder/${folder.id}`);
                      }}
                      className="bg-indigo-600/80 hover:bg-indigo-700 text-white px-3 py-1.5 h-auto rounded-md text-xs font-semibold backdrop-blur-sm"
                    >
                      Chat
                    </Button>
                  </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group relative"
                >
                  <div className="absolute -inset-px bg-linear-to-br from-violet-500/20 via-transparent to-indigo-500/10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div
                    onClick={() => handleFileOpen(file.id)}
                    className="relative bg-[#0a0a0a] border border-white/5 group-hover:border-violet-500/40 p-6 rounded-[2rem] transition-all duration-300 cursor-pointer h-full flex flex-col justify-between overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-white/3 rounded-2xl border border-white/5 group-hover:scale-110 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all duration-500">
                        {getFileIcon(file.type)}
                      </div>
                      <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-slate-500 group-hover:text-white" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-white font-medium text-base truncate group-hover:text-violet-300 transition-colors">
                        {file.name}
                      </h3>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(file.status)}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/3">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            Size
                          </span>
                          <span className="text-xs text-slate-300 font-mono">
                            {formatSize(file.size)}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            Type
                          </span>
                          <span className="text-xs text-indigo-400 font-medium truncate max-w-[80px]" title={file.type}>
                            {getFileTypeLabel(file.type)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/chat/${file.id}`);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm"
                        >
                          Chat
                        </Button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/20 to-transparent opacity-0 group-hover:opacity-100" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {showCreateFolderDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Create New Folder
              </h3>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolder();
                  }
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateFolderDialog(false);
                    setFolderName("");
                  }}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={isCreatingFolder || !folderName.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-lg transition-all"
                >
                  {isCreatingFolder ? "Creating..." : "Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drive;
