"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020203] pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Semantic File Management</span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold tracking-tight text-white"
          >
            Your Files, <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
              Powered by Intelligence.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed"
          >
            Experience the first AI-native cloud drive. Search by meaning, chat
            with documents, and transform handwritten notes into structured
            insights instantly.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-slate-200 font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)] group transition-all cursor-pointer">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-white/5"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 mb-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-white font-medium">Semantic Search</h3>
              <p className="text-sm text-slate-500">
                Find files by concepts, not just names.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 mb-2">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-white font-medium">Auto-Summary</h3>
              <p className="text-sm text-slate-500">
                Instant TL;DR for long PDFs & docs.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-white font-medium">Secure RAG</h3>
              <p className="text-sm text-slate-500">
                Encrypted embeddings for total privacy.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-125 bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none" />
    </section>
  );
};

export default Hero;
