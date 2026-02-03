"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, File, CheckCircle, X } from "lucide-react";
import axios from "axios";

const Uploader = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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
        const { signedUrl } = response.data;

        await axios.put(signedUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        await axios.post("/api/save", {
          fileName: file.name,
          fileType: file.type,
          fileUrl: signedUrl.split("?")[0],
          size: file.size,
        });
      }

      setUploadStatus("success");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload failed", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    setUploadStatus("idle");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-black min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.06, 0.08, 0.06],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[-15%] left-[-5%] w-[40%] h-[40%] bg-indigo-600 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.04, 0.06, 0.04],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 right-[-5%] w-[35%] h-[35%] bg-violet-700 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/3 border border-white/8 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md"
          >
            <Upload className="w-3.5 h-3.5 fill-indigo-400" />
            <span className="tracking-wider uppercase">
              Neural Upload System
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter"
          >
            Upload Your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-indigo-400 via-purple-400 to-violet-500">
              Neural Assets
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            Securely upload your files to NeuraDrive's AI-powered storage
            system. Your data evolves through intelligent processing.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleUpload} className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragOver
                  ? "border-indigo-400 bg-indigo-400/10"
                  : selectedFiles
                    ? "border-green-400 bg-green-400/5"
                    : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="*/*"
              />

              <motion.div
                animate={{ scale: isDragOver ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
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
                          {(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB
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
                        {isDragOver
                          ? "Drop your files here"
                          : "Drag & drop your files here"}
                      </p>
                      <p className="text-slate-500">or click to browse files</p>
                    </div>
                  </div>
                )}
              </motion.div>
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
      </div>
    </section>
  );
};

export default Uploader;
